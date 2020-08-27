import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField, Checkbox, Box, Button, ButtonProps, FormControlLabel } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { categoryHttp } from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
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
    className: classes.submit,
    disabled: loading
  }
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams();
  const [category, setCategory] = useState<{ id: string } | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    errors,
    reset,
    setValue,
    triggerValidation,
    watch,
    formState } = useForm<{
      name: string, 
      is_active: boolean,
    }>({
      validationSchema,
      defaultValues: {
        is_active: true
      }
    });
   useSnackbarFormError(formState.submitCount, errors);
  
  
  useEffect(() => {
    register({ name: 'is_active' })
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    categoryHttp
      .get(id)
      .then(
        ({ data }) => {
          setCategory(data.data)
          reset(data.data)
        }
      );
  }, [id, reset]);

  function onSubmit(formData: any, event: any) {
    const http = !category
      ? categoryHttp.create(formData)
      : categoryHttp.update(category.id, formData);
    http
      .then((response) => {
        snackbar.enqueueSnackbar(
          'Categoria salva com sucesso',
          { variant: 'success' }
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
      });
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name={"name"}
        label="Nome"
        fullWidth
        variant={"outlined"}
        margin={"normal"}
        inputRef={register}
        disabled={loading}
        InputLabelProps={{ shrink: true }}                
        error={errors.name !== undefined}
        helperText={errors.name && errors.name.message}
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
        <Button 
          {...buttonProps} 
          onClick={() => triggerValidation().then(isValid => {
            isValid && onSubmit(getValues(), null)
            })
          }
          >Salvar</Button>
        <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
      </Box>
    </form>
  )
}