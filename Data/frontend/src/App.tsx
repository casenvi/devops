import React from 'react';
import './App.css';
import { NavBar } from './components/Navbar';
import { Box } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import Breadcrumb from './components/Breadcrumb/';

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <NavBar />
        <Box paddingTop={'70px'}>
          <Breadcrumb />
          <AppRouter />
        </Box>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
