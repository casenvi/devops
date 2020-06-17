import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField, Checkbox, Box, Button, ButtonProps } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core';
import { InputLabel, MenuItem } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { genreHttp } from '../../util/http/genre-http';
import { categoryHttp } from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

export const Form = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState<boolean>(false);

  const buttonProps: ButtonProps = {
    variant: 'contained',
    color: 'secondary',
    className: classes.submit
  }
  const [categories, setCategories] = useState<any[]>([]);
  const { register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    watch } = useForm(
      //validationSchema
    );
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams();

  const [genre, setGenre] = useState<{ id: string } | null>(null);

  useEffect(() => {
    register({ name: "categories_id" })
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    genreHttp
      .get(id)
      .then(
        ({ data }) => {
          setGenre(data.data)
          reset(data.data)
        }
      )
      .finally(
        () => setLoading(false)
      );
  }, []);

  function onSubmit(formData, event) {
    setLoading(true);
    const http = !genre
      ? genreHttp.create(formData)
      : genreHttp.update(genre.id, formData);
    http
      .then((response) => {
        snackbar.enqueueSnackbar(
          'Genero salva com sucesso',
          { variant: 'success' }
        )
        setTimeout(() => {
          event
            ? (
              genre
                ? history.replace(`/genres/${response.data.id}/edit`)
                : history.push(`/genres/${response.data.id}/edit`)
            )
            : history.push('/genres')
        });
      })
      .catch((error) => {
        console.log(error);
        snackbar.enqueueSnackbar(
          'Não foi possível salvar o Genero',
          { variant: 'error' }
        )
      })
      .finally(
        () => setLoading(false)
      );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="Nome"
        fullWidth
        variant={"outlined"}
        margin={"normal"}
        disabled={loading}
        inputRef={register}
      />

      <InputLabel id="categories_id_label">Categorias</InputLabel>
      <TextField
        select
        name="categories_id"
        value={watch('categories_id')}
        label="Categorias"
        margin={"normal"}
        variant={"outlined"}
        fullWidth
        onChange={(e) => {
          setValue('categories_id', e.target.value);
        }}
        SelectProps={{
          multiple: true
        }}
      >
        <MenuItem value="" disabled>
          <em>Selecione categorias</em>
        </MenuItem>
        {
          categories.map(
            (category, key) => (
              <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
            )
          )
        }
      </TextField>

      <Checkbox
        name="is_active"
        inputRef={register}
        defaultChecked
      />
      Ativo?
      <Box dir="rtl">
        <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
        <Button {...buttonProps} type="submit">Salvar e continur editando</Button>
      </Box>
    </form>
  )
}