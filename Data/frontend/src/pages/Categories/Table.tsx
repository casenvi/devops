import * as React from 'react';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import { categoryHttp } from '../../util/http/category-http';
import { BadgeYes, BadgeNo } from '../../components/Badge';
import { IconButton, Theme, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { DefaultTable, TableColumn, makeActionStyles } from '../../components/Table';
import { useSnackbar } from 'notistack';

const columnsDefinition: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    width: '35%'
  },
  {
    name: "name",
    label: "Nome",
    width: '35%'
  },
  {
    name: "is_active",
    label: "Ativo?",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return value ? <BadgeYes /> : <BadgeNo />
      }
    }
  },
  {
    name: "created_at",
    label: "Criado em",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return <span>{format(parseIso(value), 'dd/MM/yyyy')}</span>;
      }
    }
  },
  {
    name: "id",
    label: "Ações",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return (
          <span>
            <IconButton
              color={'primary'}
              component={Link}
              to={`/categories/${value}/edit`}
            >
              <EditIcon fontSize={'inherit'} />
            </IconButton>
            <IconButton
              color={'primary'}
              component={Link}
              to={`/categories/${value}/delete`}
            >
              <DeleteIcon fontSize={'inherit'} />
            </IconButton>
          </span>
        )
      }
    }
  },
];

interface Category {
  id: string;
  name: string;
};

export const Table = () => {

  const snackbar = useSnackbar();
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await categoryHttp.list()
        if (!isCancelled) {
          setData(data.data);
        }
      } catch (error) {
        console.error(error);
        snackbar.enqueueSnackbar(
          'Não foi possível carregar as informações',
          { variant: 'error' }
        )
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      isCancelled = true
    }
  }, []
  );

  return (
    //<MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
    <DefaultTable
      title=""
      columns={columnsDefinition}
      data={data}
      isLoading={loading}
      options={{
        responsive: "scrollMaxHeight"
      }
      }
    />
    // </MuiThemeProvider>
  );
}