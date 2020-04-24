import * as React from 'react';
import { SnackbarProvider as NoistackProvider, SnackbarProviderProps } from 'notistack';
import { IconButton, makeStyles, Theme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) => {
  return {
    variantSucces: {
      backgroundColor: theme.palette.success.main
    },
    variantError: {
      backgroundColor: theme.palette.error.main
    },
    variantInfo: {
      backgroundColor: theme.palette.primary.main
    }
  }
});

export const SnackbarProvider: React.FC<SnackbarProviderProps> = (props) => {
  let SnackbarProviderRef;
  const classes = useStyles();
  const defaultProps: SnackbarProviderProps = {
    classes,
    autoHideDuration: 3000,
    maxSnack: 3,
    anchorOrigin: {
      horizontal: 'right',
      vertical: 'top',
    },
    ref: (el) => SnackbarProviderRef = el,
    action: (key) => (
      <IconButton
        color={'inherit'}
        style={{ fontSize: 20 }}
        onClick={() => SnackbarProviderRef.closeSnackbar(key)}
      >
        <CloseIcon />
      </IconButton>
    )
  };
  const newProps = { ...defaultProps, ...props };

  return (
    <NoistackProvider {...newProps}>
      {props.children}
    </NoistackProvider>
  );
};