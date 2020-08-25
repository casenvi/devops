import * as React from 'react';
import { Page } from '../../components/Page';
import { Box, Fab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { Table } from './Table';

export const VideoList = () => {
  return (
    <Page title='Listagem de video'>
      <Box dir={'rtl'} paddingBottom={2}>
        <Fab
          title="Adicionar video"
          color={"secondary"}
          size="small"
          component={Link}
          to="/Videos/create"
        >
          <AddIcon />
        </Fab>
      </Box>
      <Box>
        <Table />
      </Box>

    </Page>
  );
};