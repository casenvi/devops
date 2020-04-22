import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField, Checkbox, Box, Button, ButtonProps } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core';
import { InputLabel, MenuItem } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { genreHttp } from '../../util/http/genre-http';
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
    variant: 'contained',
    color: 'secondary',
    className: classes.submit
  }
  const [categories, setCategories] = useState<any[]>([]);
  const { register, getValues, setValue, watch } = useForm();

  useEffect(() => {
    register({ name: "categories_id" })
  }, [register]);

  useEffect(() => {
    categoryHttp
      .list()
      .then(({ data }) => setCategories(data.data))
  }, []);

  function onSubmit(formData, event) {
    genreHttp
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