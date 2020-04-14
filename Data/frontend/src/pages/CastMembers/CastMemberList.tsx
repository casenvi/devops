import * as React from 'react';
import { Page } from '../../components/Page';
import { Box, Fab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { Table } from './Table';

export const CastMemberList = () => {
  return (
    <Page title='Listagem de membros do elenco'>
      <Box dir={'rtl'}>
        <Fab
          title="Adicionar categoria"
          size="small"
          component={Link}
          to="/cast_members/create"
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