import React from 'react';
import './App.css';
import { NavBar } from './components/Navbar';
import { Box, MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import Breadcrumb from './components/Breadcrumb/';
import theme from './theme';
import { SnackbarProvider } from './components/SnackbarProvider';

function App() {
  return (
    <React.Fragment>
      <MuiThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          <BrowserRouter>
            <NavBar />
            <Box paddingTop={'70px'}>
              <Breadcrumb />
              <AppRouter />
            </Box>
          </BrowserRouter>
        </SnackbarProvider>
      </MuiThemeProvider>

    </React.Fragment>
  );
}

export default App;
