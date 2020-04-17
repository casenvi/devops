import * as React from 'react';
import { TextField, Checkbox, Box, Button, ButtonProps } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { categoryHttp } from '../../util/http/category-http';


const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

export const Form = () => {

  const classes = useStyles();

  const buttonProps: ButtonProps = {
    variant: "outlined",
    className: classes.submit
  }

  const { register, getValues } = useForm({
    defaultValues: {
      is_active: true
    }
  });

  function onSubmit(formData, event) {
    categoryHttp
      .create(formData)
      .then((response) => console.log(response));
  }

  return (
    <form>
      <TextField
        name="name"
        label="Nome"
        fullWidth
        variant={"outlined"}
        margin={"normal"}
        inputRef={register}
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
      />
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