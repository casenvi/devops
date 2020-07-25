import * as React from 'react';
import { Form } from './Form';
import { Page } from '../../components/Page';
import { useParams } from 'react-router';

export const CastMemberForm = () => {
  const { id } = useParams()
  return (
    <Page title={id ? "Editar elenco" : "Criar elenco"}>
      <Form />
    </Page>
  );
}