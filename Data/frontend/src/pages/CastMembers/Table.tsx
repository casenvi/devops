import * as React from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { httpVideo } from '../../util/http';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';

const castmember_type: { [key: number]: string } = {
  1: 'Diretor',
  2: 'Ator'
}

const columnsDefinition: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "Nome"
  },
  {
    name: "type",
    label: "Tipo",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return castmember_type[value];
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
  }
];

export const Table = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    httpVideo.get('cast_members').then(
      response => setData(response.data.data)
    )
  }, []
  );

  return (
    <MUIDataTable
      title=""
      columns={columnsDefinition}
      data={data}
    />
  );
}