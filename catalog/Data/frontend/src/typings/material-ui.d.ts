import { ComponentNameToClassKey } from '@material-ui/core/styles/overrides';
import { PaletteOptions, PaletteColorOptions, Palette, PaletteColor } from "@material-ui/core/styles/createPalette";


declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey {
    MUIDataTable: any;
    MUIDataTableToolbar: any;
    MUIDataTableHeadCell: any;
    MUIDataTableSelectCell: any;
    MUIDataTableBodyCell: any;
    MUIDataTableToolbarSelect: any;
    MUIDataTableBodyRow: any;
    MUIDataTablePagination: any;
    MuiTableSortLabel: any;
    MUIDataTableFilterList: any;
  }
}

declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions {
    success?: PaletteColorOptions
  }
  interface Palette {
    success: PaletteColor
  }
}