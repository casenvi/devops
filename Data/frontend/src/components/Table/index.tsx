import * as React from 'react';

import MUIDataTable, { MUIDataTableOptions, MUIDataTableProps, MUIDataTableColumn } from 'mui-datatables';
import { merge, omit, cloneDeep } from 'lodash';
import { useTheme, MuiThemeProvider, Theme, useMediaQuery, ThemeProvider } from '@material-ui/core';
import DebouncedTableSearch from './DebouncedTableSearch.js';

const makeDefaultOptions = (debouncedSearchTime?:number,debounceTime?:number): MUIDataTableOptions => ({
  print: false,
  download: false,
  textLabels: {
    body: {
      noMatch: "Nenhum registro encontrado",
      toolTip: "Classificar",
    },
    pagination: {
      next: "Pŕoxima página",
      previous: "Página anterior",
      rowsPerPage: "Por página",
      displayRows: "de"
    },
    toolbar: {
      search: "Busca",
      downloadCsv: "Download CSV",
      print: "Imprimir",
      viewColumns: "Ver colunas",
      filterTable: "Filtrar Tabelas"
    },
    filter: {
      all: "Todos",
      title: "Filtros",
      reset: "Limpar"
    },
    viewColumns: {
      title: "Ver Colunas",
      titleAria: "Ver/Esconder colunas da tabela"
    },
    selectedRows: {
      text: "registro(s) selecionados",
      delete: "Excluir",
      deleteAria: "Excluir registro(s) selecionados"
    }
  },
  customSearchRender: (searchText: string,
    handleSearch: any,
    hideSearch: any,
    options: any
  ) => {
    return <DebouncedTableSearch
      searchText={searchText}
      onSearch={handleSearch}
      onHide={hideSearch}
      options={options}
      debounceTime={debounceTime}
      debouncedSearchTime={debouncedSearchTime}
    />
  }
});
export interface TableColumn extends MUIDataTableColumn {
  width?: string;
}

export interface MuiDataTableComponent {
  changePage: (page: number) => void;
  changeRowsPerPage: (page: number) => void;
}
interface TableProps extends MUIDataTableProps, React.RefAttributes<MuiDataTableComponent> {
  columns: TableColumn[];
  isLoading?: boolean;
  debounceSearchTime?: number;
}

export const DefaultTable = React.forwardRef<MuiDataTableComponent, TableProps>((props, ref) => {

  function extractMuiDataTableColumns(columns: TableColumn[]): MUIDataTableColumn[] {
    setColumnsWith(columns);
    return columns.map(column => omit(column, 'width'))
  }

  function setColumnsWith(columns: TableColumn[]) {
    columns.forEach((column, key) => {
      if (column.width) {
        const overrides = theme.overrides as any;
        overrides.MUIDataTableHeadCell.fixedHeaderCommon[`&:nth-child(${key + 2})`] = {
          width: column.width
        }
      }
    })
  }

  function applyLoading() {
    const textLabels = (newProps.options as any).textLabels;
    textLabels.body.noMatch = newProps.isLoading === true ? `Carregando...` : textLabels.body.noMatch

  }

  function applyResponsive() {
    newProps.options.responsive = isSmOrDown ? "scrollMaxHeight" : "stacked";
  }

  function getOriginalMuiDataTableProps() {
    return {
      ...omit(newProps, 'isLoading'),
      ref
    };
  }

  const theme = cloneDeep<Theme>(useTheme());
  const isSmOrDown = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultOptions = makeDefaultOptions(props.debounceSearchTime);
  const newProps = merge(
    { options: cloneDeep(defaultOptions) },
    props,
    { columns: extractMuiDataTableColumns(props.columns) }
  );

  applyLoading();
  applyResponsive();

  const originalProps = getOriginalMuiDataTableProps();

  return (
    <MuiThemeProvider theme={theme}>
      <MUIDataTable {...originalProps} />
    </MuiThemeProvider>

  )
});

export function makeActionStyles(column:number) {
  
  return (theme: Theme) => {
    const copyTheme = cloneDeep(theme);
    const selector = `&[data-testid^="MuiDataTableBodyCell-${column}"]`;
    (copyTheme.overrides as any).MUIDataTableBodyCell.root[selector] = {
      paddingTop: '0px',
      paddingBottom: '0px'
    };
    return copyTheme;
  }
}
