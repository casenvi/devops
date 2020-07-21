import { useState, useReducer, Dispatch, Reducer, useEffect } from "react";
import { reducer, Creators } from "../store/filter";
import { State as FilterState, Actions as FilterActions } from "../store/filter/types";
import { MUIDataTableColumn } from "mui-datatables";
import { useDebounce } from 'use-debounce';
import { useHistory } from "react-router";
import { History } from 'history';
import { isEqual } from 'lodash';
import * as yup from '../util/vendor/yup';
import { MuiDataTableComponent } from "../components/Table";

interface FilterManagerOptions {
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  history: History;
  tableRef: React.MutableRefObject<MuiDataTableComponent>;
}

interface UserFilterOptions extends Omit<FilterManagerOptions, 'history'> { }

export default function useFIlter(options: UserFilterOptions) {
  const history = useHistory();
  const filterManager = new FilterManager({ ...options, history });
  const INITIAL_STATE = filterManager.getStateFromURL();
  const [filterState, dispatch] = useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE);
  const [deboundedFilterState] = useDebounce(filterState, options.debounceTime);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  filterManager.state = filterState;
  filterManager.dispatch = dispatch;
  filterManager.applyOrderInColumns();
  useEffect(() => {
    filterManager.replaceHistory();
  }, []);
  return {
    columns: filterManager.columns,
    filterManager,
    filterState,
    deboundedFilterState,
    dispatch,
    totalRecords,
    setTotalRecords
  }
}

export class FilterManager {
  state: FilterState = null as any;
  dispatch: Dispatch<FilterActions> = null as any;
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  history: History;
  tableRef: React.MutableRefObject<MuiDataTableComponent>;
  schema;

  constructor(options: FilterManagerOptions) {
    const { columns, rowsPerPage, rowsPerPageOptions, history, tableRef } = options;
    this.columns = columns;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.history = history;
    this.createValidationSchema();
    this.tableRef = tableRef;
  }

  private resetTablePagination() {
    this.tableRef.current.changeRowsPerPage(this.rowsPerPage);
    this.tableRef.current.changePage(0);
  }

  changeSearch(value) {
    this.dispatch(Creators.setSearch({ search: value }));
  }
  changePage(page) {
    this.dispatch(Creators.setPage({ page: page + 1 }));
  }
  changeRowsPerPage(perPage) {
    this.dispatch(Creators.setPerPage({ per_page: perPage }));
  }

  resetFilter() {
    this.dispatch(Creators.setReset({state: this.state}));
    this.resetTablePagination();
  }

  changeColumnSort(changedColumn, direction) {
    this.dispatch(Creators.setOrder({
      sort: changedColumn,
      dir: direction.includes('desc') ? 'desc' : 'asc'
    }));
    this.resetTablePagination();
  }

  applyOrderInColumns() {
    this.columns = this.columns.map(column => {
      return column.name === this.state.order.sort ?
        {
          ...column,
          options: {
            ...column.options,
            sortDirection: this.state.order.dir as any

          }
        }
        : column;
    })
  }

  cleanSearchText(text) {
    let newText = text;
    if (text && text.value !== undefined) {
      newText = text.value;
    }
    return newText;
  }

  pushHistory() {
    const newLocation = {
      pathname: this.history.location.pathname,
      search: "?" + new URLSearchParams(this.formatSearchParameters() as any),
      state: {
        ...this.state,
        search: this.cleanSearchText(this.state.search)
      },
    }
    const prevState = this.history.location.state;

    if (isEqual(prevState, this.state)) {
      return;
    }
    this.history.push(newLocation);
  }

  replaceHistory() {
    this.history.replace({
      pathname: this.history.location.pathname,
      search: "?" + new URLSearchParams(this.formatSearchParameters() as any),
      state: this.state,
    });
  }

  private formatSearchParameters() {
    const search = this.cleanSearchText(this.state.search);
    return {
      ...(search && search !== '' && { search: search }),
      ...(this.state.pagination.page !== 1 && { page: this.state.pagination.page }),
      ...(this.state.pagination.per_page !== 15 && { page: this.state.pagination.per_page }),
      ...(this.state.order.sort && {
        sort: this.state.order.sort,
        dir: this.state.order.dir
      }),
    }
  }

  getStateFromURL() {
    const queryParams = new URLSearchParams(this.history.location.search.substr(1));
    return this.schema.cast({
      search: queryParams.get('search'),
      pagination: {
        page: queryParams.get('page'),
        per_page: queryParams.get('per_page'),
      },
      order: {
        sort: queryParams.get('sort'),
        dir: queryParams.get('dir'),
      }
    }
    )
  }

  private createValidationSchema() {
    this.schema = yup.object().shape({
      search: yup.string()
        .transform(value => !value ? undefined : value)
        .default(''),
      pagination: yup.object().shape({
        page: yup.number()
          .transform(value => isNaN(value) || parseInt(value) < 1 ? undefined : value)
          .default(1),
        per_page: yup.number()
          .oneOf(this.rowsPerPageOptions)
          .transform(value => isNaN(value) ? undefined : value)
          .default(this.rowsPerPage),
      }),
      order: yup.object().shape({
        sort: yup.string()
          .nullable()
          .transform(value => {
            const columnsName = this.columns
              .filter(column => !column.options || column.options.sort !== false)
              .map(column => column.name);
            return columnsName.includes(value) ? value : undefined;
          })
          .default(null),
        dir: yup.string()
          .nullable()
          .transform(value => !value || !['asc', 'desc'].includes(value.toLowerCase()) ? value : undefined)
          .default(null)
      })
    });
  }
}
