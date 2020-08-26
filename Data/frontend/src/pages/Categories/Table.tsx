import * as React from 'react';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import { BadgeYes, BadgeNo } from '../../components/Badge';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import { DefaultTable, TableColumn, makeActionStyles, MuiDataTableComponent } from '../../components/Table';
import { useSnackbar } from 'notistack';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import useFilter from '../../hooks/useFilter';
import { Category, ListResponse } from "../../util/models"
import { categoryHttp } from '../../util/http/category-http';
import useDeleteCollection from '../../hooks/useDeleteCollection';
import DeleteDialog from '../../components/DeleteDialog';
import LoadingContext from '../../components/Loading/LoadingContent';

const columnsDefinition: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    width: '35%',
    options: {
      sort: false,
      filter: false
    }
  },
  {
    name: "name",
    label: "Nome",
    width: '35%',
    options: {
      sortDirection: 'desc',
      filter: false
    }
  },
  {
    name: "is_active",
    label: "Ativo?",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return value ? <BadgeYes /> : <BadgeNo />
      },
      filterList: ['Sim'],
      filterOptions: {
        names: ['Sim', 'Não']
      }
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
              to={`/categories/${value}/edit`}
            >
              <EditIcon fontSize={'inherit'} />
            </IconButton>
            </span>
        )
      },
      filter: false
    }
  },
];

const debounceTime = 300;
const debounceSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];
export const Table = () => {
  const snackbar = useSnackbar();
  const subscribed = React.useRef(true);
  const [data, setData] = useState<Category[]>([]);
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
    tableRef
  });
  useEffect(() => {
    filterManager.replaceHistory();
  }, []);

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
    debouncedFilterState.order
  ]);

  async function getData() {
    try {
      const { data } = await categoryHttp.list<ListResponse<Category>>({
        queryParams: {
          search: filterManager.cleanSearchText(filterState.search),
          page: filterState.pagination.page,
          per_page: filterState.pagination.per_page,
          sort: filterState.order.sort,
          dir: filterState.order.dir
        }
      }
      );
      if (subscribed.current) {
        setData(data.data);
        setTotalRecords(data.meta.total);
      }
    } catch (error) {
      console.error(error);
      if (categoryHttp.isCancelRequest(error)) {
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
    categoryHttp
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
      })
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
          serverSide: true,
          responsive: "scrollMaxHeight",
          searchText: (filterState.search) as any,
          page: filterState.pagination.page - 1,
          rowsPerPage: filterState.pagination.per_page,
          rowsPerPageOptions,
          count: totalRecords,
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
        }}
      />
    </MuiThemeProvider>
  );
}
