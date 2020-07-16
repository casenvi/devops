import * as React from 'react';
import { useEffect, useState, useReducer } from 'react';
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import { categoryHttp } from '../../util/http/category-http';
import { BadgeYes, BadgeNo } from '../../components/Badge';
import { IconButton, Theme, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { DefaultTable, TableColumn, makeActionStyles } from '../../components/Table';
import { useSnackbar } from 'notistack';
import { Category, ListResponse } from "../../util/models"
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import { Creators, reducer, INITIAL_STATE } from '../../store/search';

const columnsDefinition: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    width: '35%',
    options: {
      sort: false
    }
  },
  {
    name: "name",
    label: "Nome",
    width: '35%',
    options: {
      sortDirection: 'desc'
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
      }
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
            <IconButton
              color={'primary'}
              component={Link}
              to={`/categories/${value}/delete`}
            >
              <DeleteIcon fontSize={'inherit'} />
            </IconButton>
          </span>
        )
      }
    }
  },
];

export const Table = () => {
  const snackbar = useSnackbar();
  const subscribed = React.useRef(true);
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    subscribed.current = true;
    getData();
    return () => {
      subscribed.current = false;
    }
  }, [
    searchState.search,
    searchState.pagination.page,
    searchState.pagination.per_page,
    searchState.order
  ]);

  async function getData() {
    setLoading(true);
    try {
      const { data } = await categoryHttp.list<ListResponse<Category>>({
        queryParams: {
          search: cleanSearchText(searchState.search),
          page: searchState.pagination.page,
          per_page: searchState.pagination.per_page,
          sort: searchState.order.sort,
          dir: searchState.order.dir
        }
      }
      );
      if (subscribed.current) {
        setData(data.data);
        setSearchState((prevState => ({
          ...prevState,
          pagination: {
            ...prevState.pagination,
            total: data.meta.total
          }
        })))
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
    } finally {
      setLoading(false);
    }
  }

  const columns = columnsDefinition.map(column => {
    if (column.name == searchState.order.sort) {
      (column.options as any).sortDirection = searchState.order.dir;
    }
    return {
      ...column,
      options: {
        ...column.options
      }
    };
  })

  function cleanSearchText(text) {
    let newText = text;
    if (text && text.value !== undefined) {
      newText = text.value;
    }
    return newText;
  }

  return (
    <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
      <DefaultTable
        title=""
        columns={columns}
        data={data}
        isLoading={loading}
        debounceSearchTime={500}
        options={{
          serverSide: true,
          responsive: "scrollMaxHeight",
          searchText: (searchState.search) as any,
          page: searchState.pagination.page - 1,
          rowsPerPage: searchState.pagination.per_page,
          count: searchState.pagination.total,
          customToolbar: () => (
            <FilterResetButton
              handleClick={() => {
                /* setSearchState({
                  ...initialState,
                  search: {
                    value: initialState.search,
                    updated: true
                  } as any
                }); */
              }}
            />
          ),
          onSearchChange: (value) => dispatch(Creators.setSearch({ search: value })),
          onChangePage: (page) => dispatch(Creators.setPage({ page: page + 1 })),
          onChangeRowsPerPage: (perPage) => dispatch(Creators.setPerPage({ per_page: perPage })),
          onColumnSortChange: (changedColumn, direction) =>
            dispatch(Creators.setOrder({
              sort: changedColumn,
              dir: direction.includes('desc') ? 'desc' : 'asc'
            })
            ),
        }}
      />
    </MuiThemeProvider>
  );
}
