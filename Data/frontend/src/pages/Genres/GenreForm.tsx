import * as React from 'react';
import { Form } from './Form';
import { Page } from '../../components/Page';
import { useParams } from 'react-router';

export const GenreForm = () => {
  const { id } = useParams()
  return (
    <Page title={id ? "Editar genero" : "Criar genero"}>
      <Form />
    </Page>
  );
}