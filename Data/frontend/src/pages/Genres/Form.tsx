import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField, Checkbox, Box, Button, ButtonProps, FormControlLabel } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core';
import { InputLabel, MenuItem } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { genreHttp } from '../../util/http/genre-http';
import { categoryHttp } from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import useSnackbarFormError from '../../hooks/useSnackbarFormError';
import LoadingContext from '../../components/Loading/LoadingContent';

const validationSchema = yup.object().shape({
  name: yup.string()
    .label('Nome')
    .max(255)
    .required(),
});

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

export const Form = () => {
  const classes = useStyles();
  const loading = React.useContext(LoadingContext);
  const buttonProps: ButtonProps = {
    variant: 'contained',
    color: 'secondary',
    className: classes.submit
  }

  const { register,
    handleSubmit,
    getValues,
    setValue,
    errors,
    reset,
    watch,
    formState } = useForm<{
      name: string, 
      is_active: boolean,
    }>(
      {
        validationSchema,
        defaultValues: {
          is_active: true
        }
      }
    );
    useSnackbarFormError(formState.submitCount, errors);
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [all_categories, setAllCategories] = useState<any[]>([]);
  const categoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategories(event.target.value as string[]);
  };  

  const [genre, setGenre] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    register({ name: "categories_id" })
  }, [register]);

  useEffect(() => {
    categoryHttp
      .list()
      .then(
        ({ data }) => {
          setAllCategories(data.data)
        }
      );
    if (!id) {
      return;
    }
    genreHttp
      .get(id)
      .then(
        ({ data }) => {
          setGenre(data.data);
          setCategories(data.data.categories.map((category) => {return category.id}));            
          reset(data.data);
        }
      );
  }, [id, reset, snackbar]);

  function onSubmit(formData: any, event: any) {
    formData['categories_id'] = categories;
    const http = !genre
      ? genreHttp.create(formData)
      : genreHttp.update(genre.id, formData);
    http
      .then((response) => {
        snackbar.enqueueSnackbar(
          'Gênero salva com sucesso',
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
          'Não foi possível salvar o Gênero',
          { variant: 'error' }
        )
      });
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
        InputLabelProps={{ shrink: true }}
        error={errors.name !== undefined}
        helperText={errors.name && errors.name.message}
      />
      <Box width={1}>
        <InputLabel id="categories_id_label">Categorias</InputLabel>
        <Select
          label="Categorias"
          name="categories_id"
          multiple
          value={categories}
          onChange={categoryChange}
          input={<Input />}
        >
          <MenuItem value="" disabled>
            <em>Selecione categorias</em>
          </MenuItem>
          {
            all_categories.map((category) => (
              <MenuItem key={category.id} value={category.id} >
                {category.name}
              </MenuItem>
            ))
          }
        </Select>
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            name={"is_active"}
            onChange={
              () => setValue('is_active', !getValues()['is_active'])
            }
            checked={watch('is_active')}
          />
        }
        label={"Ativo?"}
        labelPlacement={'end'}
        disabled={loading}
      />
      <Box dir="rtl">
        <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
        <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
      </Box>
    </form>
  )
}