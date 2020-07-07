import * as React from 'react';

import MUIDataTable, { MUIDataTableOptions, MUIDataTableProps, MUIDataTableColumn } from 'mui-datatables';
import { merge, omit, cloneDeep } from 'lodash';
import { useTheme, MuiThemeProvider, Theme, useMediaQuery } from '@material-ui/core';

const defaultOptions: MUIDataTableOptions = {
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
  }
}
export interface TableColumn extends MUIDataTableColumn {
  width?: string;
}
interface TableProps extends MUIDataTableProps {
  columns: TableColumn[];
  isLoading?: boolean;
}

export const DefaultTable: React.FC<TableProps> = (props) => {

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
    return omit(newProps, 'isLoading');
  }

  const theme = cloneDeep<Theme>(useTheme());
  const isSmOrDown = useMediaQuery(theme.breakpoints.down('sm'));
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
}

export function makeActionStyles(column) {
  return theme => {
    const copyTheme = cloneDeep<Theme>(useTheme());
    const selector = `&[data-testid^="MuiDataTAbleBodyCell-${column}"]`;
    (copyTheme.overrides as any).MuiDataTAbleBodyCell.root[selector] = {
      paddingTop: '0px',
      paddingBottom: '0px'
    };
    return copyTheme;
  }

}