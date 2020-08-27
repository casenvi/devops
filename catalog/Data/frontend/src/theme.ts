import { createMuiTheme } from "@material-ui/core";
import { PaletteOptions, SimplePaletteColorOptions } from "@material-ui/core/styles/createPalette";
import { red, green } from "@material-ui/core/colors";

const palette: PaletteOptions = {
  primary: {
    main: '#000000',
    contrastText: '#fff',
  },
  secondary: {
    main: '#cccccc',
    contrastText: '#fff',
    dark: '#055a52'
  },
  background: {
    default: '#fafafa',
  },
  error: {
    main: red["400"]
  },
  success: {
    main: green["400"],
    contrastText: '#fff'
  }
}
const theme = createMuiTheme(
  {
    palette,
    overrides: {
      MUIDataTable: {
        paper: {
          boxShadow: "none",
        },

      },
      MUIDataTableHeadCell: {
        root: {
          color: '#ffffff'
        },
        fixedHeaderCommon: {
          backgroundColor: '#000000',
        },
        sortActive: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      },
      MUIDataTableBodyRow: {
        root: {
          backgroundColor: '#ffffff',
          "&:ntn-child(odd)": {
            backgroundColor: palette!.background!.default,
          },
        },
      },
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: '#ffffff',
        }
      },
      MUIDataTablePagination: {
        root: {
          color: (palette!.primary as SimplePaletteColorOptions).main,
        },
      },
      MUIDataTableToolbar: {
        icon: {

        }
      },
      MUIDataTableFilterList: {
        root: {
          marginBottom: '16px'
        }
      }
    }
  }
);

export default theme;
