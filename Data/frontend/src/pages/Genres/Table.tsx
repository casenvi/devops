import * as React from 'react';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';
import { BadgeYes, BadgeNo } from '../../components/Badge';
import parseIso from 'date-fns/parseISO';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { DefaultTable, TableColumn, makeActionStyles, MuiDataTableComponent } from '../../components/Table';
import { useSnackbar } from 'notistack';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import useFilter from '../../hooks/useFilter';
import { genreHttp } from '../../util/http/genre-http';
import * as yup from '../../util/vendor/yup';
import { Genre, ListResponse, Category } from '../../util/models';
import { categoryHttp } from '../../util/http/category-http';
import useDeleteCollection from '../../hooks/useDeleteCollection';
import DeleteDialog from '../../components/DeleteDialog';
import LoadingContext from '../../components/Loading/LoadingContent';

const columnsDefinition: TableColumn[] = [
  {
    name: "name",
    label: "Nome",
    options: {
      filter: false
    }
  },
  {
    name: "categories",
    label: "Categorias",
    options: {
      filterType: 'multiselect',
      filterOptions: {
        names: []
      },
      customBodyRender(value, tableMeta, updateValue) {
        return value.map((value: any) => value.name).join(', ');
      },
    }
  },
  {
    name: "is_active",
    label: "Ativo?",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return value ? <BadgeYes /> : <BadgeNo />
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
              to={`/genres/${value}/edit`}
            >
              <EditIcon fontSize={'inherit'} />
            </IconButton>
            <IconButton
              color={'primary'}
              component={Link}
              to={`/genres/${value}/delete`}
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
const debounceTime = 300;
const debounceSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];

export const Table = () => {

  const snackbar = useSnackbar();
  const subscribed = React.useRef(true);
  const [data, setData] = useState<Genre[]>([]);
  const loading = React.useContext(LoadingContext);
  const {openDeleteDialog, setOpenDeleteDialog, rowsToDelete, setRowsToDelete} = useDeleteCollection();  
  const [categories, setCategories] = useState<Category[]>();
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
          categories: yup.mixed()
          .nullable()
          .transform(value => {
            return !value || value === '' ? undefined : value.split(',');
          })
          .default(null)
        })
      },
      formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter ? {
          ...(
            debouncedState.extraFilter.categories &&
            {categories: debouncedState.extraFilter.categories.join(',')}
          )
        } : undefined
      },
      getStateFromUrl: (queryParams) => {
        const value = queryParams.get('categories');        
        return {
          categories: value && value.split(',')
        }
      }
    }
  });
  useEffect(() => {
    filterManager.replaceHistory();
  }, []);

  const indexColumnCategories = columns.findIndex(c => c.name === 'categories');
  const columnCategories = columns[indexColumnCategories];
  const categoriesFilterValue = filterState.extraFilter && filterState.extraFilter.categories;
  (columnCategories.options as any).filterList = categoriesFilterValue ? categoriesFilterValue : [];
  const serverSideFilterList = columns.map(column =>[]);
  if (categoriesFilterValue){
    serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
  }

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      try {
        const {data} = await categoryHttp.list({queryParams: {all:''}});
        if (isSubscribed){
          setCategories(data.data);          
          const arrayWithDuplicates = data.data.map((category: any) => category.name);
          (columnCategories.options as any).filterOptions.names = arrayWithDuplicates.filter((n:any, i:any) => arrayWithDuplicates.indexOf(n) === i);
        }
      } catch (error) {
        console.error(error);
        snackbar.enqueueSnackbar(
          'Não foi possível buscar categorias para a montagem do filtro',
          {variant: 'error'}
        );
      }
    })();
    return () => {
      isSubscribed = false;
    }
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
    debouncedFilterState.order,
    debouncedFilterState.extraFilter
  ]);

  async function getData() {
    try {
      const { data } = await genreHttp.list<ListResponse<Genre>>({
        queryParams: {
          search: filterManager.cleanSearchText(filterState.search),
          page: filterState.pagination.page,
          per_page: filterState.pagination.per_page,
          sort: filterState.order.sort,
          dir: filterState.order.dir,
          ...(
            debouncedFilterState.extraFilter &&
            debouncedFilterState.extraFilter.categories !== null &&
            {categories: debouncedFilterState.extraFilter.categories.join(',')}
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
      if (genreHttp.isCancelRequest(error)) {
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
    genreHttp
      .deleteCollection({ids})
      .then(response => {
        snackbar.enqueueSnackbar(
          'Registros excluídos com sucesso',
          {variant: 'success'}
        )
        if (
          rowsToDelete.data.length == filterState.pagination.per_page
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
              [column]: filterList[columnIndex].length ?  filterList[columnIndex] : null
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
          }}
      />
    </MuiThemeProvider>
  );
}
