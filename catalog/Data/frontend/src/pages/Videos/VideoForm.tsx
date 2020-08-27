import * as React from 'react';
import { Form } from './Form';
import { Page } from '../../components/Page';
import { useParams } from 'react-router';

export const VideoForm = () => {
  const { id } = useParams()
  return (
    <Page title={id ? "Editar vídeo" : "Criar vídeo"}>
      <Form />
    </Page>
  );
}