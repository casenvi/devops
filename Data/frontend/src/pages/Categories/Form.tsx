import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField, Checkbox, Box, Button, ButtonProps, FormControlLabel } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { categoryHttp } from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';

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

  const [loading, setLoading] = useState<boolean>(false);

  const buttonProps: ButtonProps = {
    variant: 'contained',
    color: 'secondary',
    className: classes.submit,
    disabled: loading
  }

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    watch } = useForm({
      validationSchema,
      defaultValues: {
        is_active: true
      }
    });
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams();

  const [category, setCategory] = useState<{ id: string } | null>(null);

  useEffect(() => {
    register({ name: 'is_active' })
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    categoryHttp
      .get(id)
      .then(
        ({ data }) => {
          setCategory(data.data)
          reset(data.data)
        }
      )
      .finally(
        () => setLoading(false)
      );
  }, [id, reset]);

  useEffect(() => {
    snackbar.enqueueSnackbar('Helloworld', {
      variant: "success"
    })
  },[snackbar]);

  function onSubmit(formData, event) {
    setLoading(true);
    const http = !category
      ? categoryHttp.create(formData)
      : categoryHttp.update(category.id, formData);
    http
      .then((response) => {
        snackbar.enqueueSnackbar(
          'Categoria salva com sucesso',
          {variant: 'success'}
        )
        setTimeout(() => {
          event
            ? (
              category
                ? history.replace(`/categories/${response.data.id}/edit`)
                : history.push(`/categories/${response.data.id}/edit`)
            )
            : history.push('/categories')
        });
      })
      .catch((error) => {
        console.log(error);
        snackbar.enqueueSnackbar(
          'Não foi possível salvar a categoria',
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
        inputRef={register}
        disabled={loading}
        //error={errors.name !== undefined}
        //helperText={errors.name && errors.name.message}
        InputLabelProps={{ shrink: true }}

      />
      <TextField
        name="description"
        label="Descrição"
        multiline
        rows="4"
        fullWidth
        variant={"outlined"}
        margin={"normal"}
        inputRef={register}
        disabled={loading}
        InputLabelProps={{ shrink: true }}
      />
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
        <Button {...buttonProps} type="submit">Salvar e continur editando</Button>
      </Box>
    </form>
  )
}