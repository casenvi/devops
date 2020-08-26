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
import { invert } from 'lodash';
import useDeleteCollection from '../../hooks/useDeleteCollection';
import DeleteDialog from '../../components/DeleteDialog';
import LoadingContext from '../../components/Loading/LoadingContent';

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
              to={`/cast_members/${value}/edit`}
            >
              <EditIcon fontSize={'inherit'} />
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
  const loading = React.useContext(LoadingContext);
  const {openDeleteDialog, setOpenDeleteDialog, rowsToDelete, setRowsToDelete} = useDeleteCollection();
  const tableRef = React.useRef() as React.MutableRefObject<MuiDataTableComponent>;
  const {
    columns,
    filterManager,
    filterState,
    debouncedFilterState,
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
    }    
  }
  function deleteRows(confirmed: boolean) {
    if (!confirmed) {
      setOpenDeleteDialog(false);
      return
    }
    const ids = rowsToDelete
      .data
      .map((value)=>data[value.index].id)
      .join(',');
    castMemberHttp
      .deleteCollection({ids})
      .then(response => {
        snackbar.enqueueSnackbar(
          'Registros excluídos com sucesso',
          {variant: 'success'}
        )
        if (
          rowsToDelete.data.length === filterState.pagination.per_page
          && filterState.pagination.page > 1  
        ){
          const page = filterState.pagination.page -2;
          filterManager.changePage(page);
        } else {
          getData();
        }
        setOpenDeleteDialog(false);
      })
      .catch((error) => {
        snackbar.enqueueSnackbar(
          'Não foi possível excluir os registros',
          {variant: 'error'}
        )
      });
    }

  return (
    <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
      <DeleteDialog open={openDeleteDialog} handleClose={deleteRows}/>      
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
          onRowsDelete: (rowsDeleted: any[]) => {
            setRowsToDelete(rowsDeleted as any);
            return false;
          }
        }
      }
      />
    </MuiThemeProvider>
  );
}
