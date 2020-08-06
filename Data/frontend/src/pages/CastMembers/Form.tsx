import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField, Checkbox, Box, Button, ButtonProps } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core';
import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { castMemberHttp } from '../../util/http/cast-member-http';
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
    className: classes.submit
  }
  const [typeValue, setTypeValue] = React.useState('1');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeValue((event.target as HTMLInputElement).value);
  }

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    errors,
    watch } = useForm<{
      name: string, 
      is_active: boolean,
    }>({
      validationSchema,
      defaultValues: {
        is_active: true
      }
    });

  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams();

  const [castMember, setcastMember] = useState<{ id: string } | null>(null);

  useEffect(() => {
    register({ name: 'is_active' })
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    castMemberHttp
      .get(id)
      .then(
        ({ data }) => {
          setcastMember(data.data)
          reset(data.data)
        }
      )
      .finally(
        () => setLoading(false)
      );
  }, []);

  function onSubmit(formData: any, event: any) {
    setLoading(true);
    formData['type'] = typeValue;
    const http = !castMember
      ? castMemberHttp.create(formData)
      : castMemberHttp.update(castMember.id, formData);
    http
      .then((response) => {
        snackbar.enqueueSnackbar(
          'Elenco salvo com sucesso',
          { variant: 'success' }
        )
        setTimeout(() => {
          event
            ? (
              castMember
                ? history.replace(`/castMember/${response.data.id}/edit`)
                : history.push(`/castMember/${response.data.id}/edit`)
            )
            : history.push('/castMember')
        });
      })
      .catch((error) => {
        console.log(error);
        snackbar.enqueueSnackbar(
          'Não foi possível salvar o elenco',
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
      />
      Tipo
      <RadioGroup
        aria-label="Tipo"
        name="type"
        value={typeValue}
        onChange={handleChange}>
        <FormControlLabel value="1" control={<Radio />} label="Diretor" />
        <FormControlLabel value="2" control={<Radio />} label="Ator" />
      </RadioGroup>
      <Checkbox
        name="is_active"
        inputRef={register}
        onChange={
          () => setValue('is_active', !getValues()['is_active'])
        }
        checked={watch('is_active')}
      />
      Ativo?
      <Box dir="rtl">
        <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
        <Button {...buttonProps} type="submit">Salvar e continur editando</Button>
      </Box>
    </form>
  );
}