import * as React from 'react';
import { Form } from './Form';
import { Page } from '../../components/Page';
import { useParams } from 'react-router';

export const CategoryForm = () => {
  const { id } = useParams()
  return (
    <Page title={id ? "Criar categoria" : "Editar categoria"}>
      <Form />
    </Page>
  );
}