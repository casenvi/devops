import * as React from 'react';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { DefaultTable, TableColumn, makeActionStyles, MuiDataTableComponent } from '../../components/Table';
import { useSnackbar } from 'notistack';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import useFilter from '../../hooks/useFilter';
import { castMemberHttp } from '../../util/http/cast-member-http';
import { CastMember, ListResponse, CastMemberTypeMap } from "../../util/models"
import * as yup from '../../util/vendor/yup';
import { filter, invert } from 'lodash';

const castMembersNames = Object.values(CastMemberTypeMap);
const debounceTime = 300;
const debounceSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];

const columnsDefinition: TableColumn[] = [
  {
    name: "name",
    label: "Nome",
    options:{
      filter: false
    }
  },
  {
    name: "type",
    label: "Tipo",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return CastMemberTypeMap[value];
      },
      filterOptions: {
        names: castMembersNames
      },
    }
  },
  {
    name: "created_at",
    label: "Criado em",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return <span>{format(parseIso(value), 'dd/MM/yyyy')}</span>;
      },
      filter: false
    }
  },
  {
    name: "id",
    label: "Ações",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return (
          <span>
            <IconButton
              color={'primary'}
              component={Link}
              to={`/castMembers/${value}/edit`}
            >
              <EditIcon fontSize={'inherit'} />
            </IconButton>
            <IconButton
              color={'primary'}
              component={Link}
              to={`/castMembers/${value}/delete`}
            >
              <DeleteIcon fontSize={'inherit'} />
            </IconButton>
          </span>
        )
      },
      filter: false
    }
  }
];

export const Table = () => {
  const snackbar = useSnackbar();
  const subscribed = React.useRef(true);
  const [data, setData] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const tableRef = React.useRef() as React.MutableRefObject<MuiDataTableComponent>;
  const {
    columns,
    filterManager,
    filterState,
    debouncedFilterState,
    dispatch,
    totalRecords,
    setTotalRecords
  } = useFilter({
    columns: columnsDefinition,
    debounceTime: debounceTime,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: rowsPerPageOptions,
    tableRef,
    extraFilter: {
      createValidationSchema: () => {
        return yup.object().shape({
          type: yup.string()
          .nullable()
          .transform(value => {
            return !value || !castMembersNames.includes(value)? undefined : value;
          })
          .default(null)
        })
      },
      formatSearchParams: (debouncedFilterState) => {
        return debouncedFilterState.extraFilter ? {
          ...(
            debouncedFilterState.extraFilter.type &&
            {type: debouncedFilterState.extraFilter.type}
          )
        } : undefined
      },
      getStateFromUrl: (queryParams) => {
        return {
          type: queryParams.get('type')
        }
      }
    }
  });
  useEffect(() => {
    filterManager.replaceHistory();
  }, []);

  const indexColumnType = columns.findIndex(c => c.name === 'type');
  const columnType = columns[indexColumnType];
  const typeFilterValue = filterState.extraFilter && filterState.extraFilter.type as never;
  (columnType.options as any).filterList = typeFilterValue ? [typeFilterValue]:[];

  const serverSideFilterList = columns.map(column =>[]);
  
  if (typeFilterValue){
    serverSideFilterList[indexColumnType] = [typeFilterValue];
  }

  useEffect(() => {
    subscribed.current = true;
    filterManager.pushHistory();
    getData();
    return () => {
      subscribed.current = false;
    }
  }, [
    filterManager.cleanSearchText(debouncedFilterState.search),
    debouncedFilterState.pagination.page,
    debouncedFilterState.pagination.per_page,
    debouncedFilterState.order,
    JSON.stringify(debouncedFilterState.extraFilter)
  ]);

  async function getData() {
    setLoading(true);
    try {
      const { data } = await castMemberHttp.list<ListResponse<CastMember>>({
        queryParams: {
          search: filterManager.cleanSearchText(filterState.search),
          page: filterState.pagination.page,
          per_page: filterState.pagination.per_page,
          sort: filterState.order.sort,
          dir: filterState.order.dir,
          ...(
            debouncedFilterState.extraFilter &&
            debouncedFilterState.extraFilter.type &&
            {type: invert(CastMemberTypeMap)[debouncedFilterState.extraFilter.type]}
          )
        }
      }
      );
      if (subscribed.current) {
        setData(data.data);
        setTotalRecords(data.meta.total);
      }
    } catch (error) {
      console.error(error);
      if (castMemberHttp.isCancelRequest(error)) {
        return;
      }
      snackbar.enqueueSnackbar(
        'Não foi possível carregar as informações',
        { variant: 'error' }
      )
    } finally {
      setLoading(false);
    }
  }


  return (
    <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
      <DefaultTable
        title=""
        columns={columns}
        ref={tableRef}
        data={data}
        isLoading={loading}
        debounceSearchTime={debounceSearchTime}
        options={{
          serverSideFilterList,
          serverSide: true,
          responsive: "scrollMaxHeight",
          searchText: (filterState.search) as any,
          page: filterState.pagination.page - 1,
          rowsPerPage: filterState.pagination.per_page,
          rowsPerPageOptions,
          count: totalRecords,
          onFilterChange: (column, filterList, type) => {
            const columnIndex = columns.findIndex(c => c.name === column);
            filterManager.changeExtraFilter({
              [column]: filterList[columnIndex].length ?  filterList[columnIndex][0] : null
            })
          },
          customToolbar: () => (
            <FilterResetButton
              handleClick={() => filterManager.resetFilter()}
            />
          ),
          onSearchChange: (value) => filterManager.changeSearch(value),
          onChangePage: (page) => filterManager.changePage(page),
          onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
          onColumnSortChange: (changedColumn, direction) =>
            filterManager.changeColumnSort(changedColumn, direction),
        }}
      />
    </MuiThemeProvider>
  );
}
