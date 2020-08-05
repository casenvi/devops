import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField, Checkbox, Box, Button, ButtonProps, FormControlLabel, Grid, Typography, useMediaQuery, useTheme, Card, CardContent } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core';
import { useForm, ErrorMessage } from 'react-hook-form';
import { videoHttp } from '../../../util/http/video-http';
import * as yup from '../../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import { RatingField } from './RatingField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import InputFile from '../../../components/InputFile';
import { UploadField } from './UploadField';
import theme from '../../../theme';
import { VideoFileFieldsMap } from '../../../util/models';

const useStyles = makeStyles((theme: Theme) => ({
  cardUpload: {
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    margin: theme.spacing(2, 0),    
  },
  submit: {
    margin: theme.spacing(1)
  }
}));

const validationSchema = yup.object().shape({
  name: yup.string()
    .label('Título')
    .max(255)
    .required(),
  description: yup.string()
    .label('Sinopse')
    .required(),
  year_launched: yup.number()
    .label('Ano de lançamento')
    .required(),
  duration: yup.number()
    .label('Duração')
    .required()
    .min(1),
  rating: yup.string()
    .label('Classificação')
    .required(),
  
});

const fileFields = Object.keys(VideoFileFieldsMap);

export const Form = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));

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
    errors,
    watch } = useForm({
      validationSchema,
      defaultValues: {
       
      },
      
    });
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams();

  const [video, setVideo] = useState<{ id: string } | null>(null);

  useEffect(() => {
    register({ name: 'is_active' })
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    videoHttp
      .get(id)
      .then(
        ({ data }) => {
          setVideo(data.data)
          reset(data.data)
        }
      )
      .finally(
        () => setLoading(false)
      );
  }, []);

  useEffect(() => {
    const otherFields = ['rating', 'opened', ...fileFields].forEach(name => register(name));
  }, [register]);

  function onSubmit(formData, event) {
    setLoading(true);
    const http = !video
      ? videoHttp.create(formData)
      : videoHttp.update(video.id, formData);
    http
      .then((response) => {
        snackbar.enqueueSnackbar(
          'Categoria salva com sucesso',
          { variant: 'success' }
        )
        setTimeout(() => {
          event
            ? (
              video
                ? history.replace(`/videos/${response.data.id}/edit`)
                : history.push(`/videos/${response.data.id}/edit`)
            )
            : history.push('/videos')
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
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <TextField
            name="name"
            label="Título"
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
            label="Sinopse"
            multiline
            rows="4"
            fullWidth
            variant={"outlined"}
            margin={"normal"}
            inputRef={register}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
              name="year_launched"
              label="Ano de lançamento"
              type="number"
              margin={"normal"}
              variant={"outlined"}
              fullWidth
              inputRef={register}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
              error={errors.year_launched !== undefined}
              helperText={errors.year_launched && errors.year_launched.message}
            />
            </Grid>
            <Grid item xs={6}>
              <TextField
              name="duration"
              label="Duração"
              type="number"
              margin={"normal"}
              variant={"outlined"}
              fullWidth
              inputRef={register}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
              error={errors.duration !== undefined}
              helperText={errors.duration && errors.duration.message}
            />
            </Grid>
          </Grid>
          Elenco<br/>Gêneros<br/>Categorias
        </Grid>
        <Grid item xs={12} md={6}>
          <RatingField
            value={watch('rating')}
            setValue={(value) => setValue('rating', value, true)}
            error={errors.rating}
            disabled={loading}
            FormControlProps={{
              margin: isGreaterMd ? 'none' : 'normal'
            }}
          />
          <br/>Uploads<br/>
          <Card className={classes.cardUpload}>
            <CardContent>
              <Typography color="primary" variant="h6">
                Imagens
              </Typography>
            </CardContent>
            <UploadField
                accept={'image/*'}
                label={'Thumb'}
                setValue={(value) =>setValue('thumb_file', value)}
              />
            <UploadField
                accept={'image/*'}
                label={'Banner'}
                setValue={(value) =>setValue('banner_file', value)}
              />
          </Card>
          <Card className={classes.cardUpload}>
            <CardContent>
              <Typography color="primary" variant="h6">
                Videos
              </Typography>
            </CardContent>
            <UploadField
              accept={'video/mp4'}
              label={'Trailer'}
              setValue={(value) =>setValue('trailer_file', value)}
            />
            <UploadField
              accept={'video/mp4'}
              label={'Principal'}
              setValue={(value) =>setValue('video_file', value)}
            />     
                   
          </Card>
          <br/>          
          <FormControlLabel
            control={
              <Checkbox
                name="opened"
                color={'primary'}
                onChange={
                  () => setValue('opened', !getValues()['opened'])
                }
                checked={watch('opened')}
                disabled={loading}
                />                
            }
            label={
              <Typography color="primary" variant={"subtitle2"}>
              Quero que este conteúdo apareça na seção de lançamentos
              </Typography>
            }
            labelPlacement="end"
            />
        </Grid>
      </Grid>
      <Box dir="rtl">
        <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
        <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
      </Box>    
    </form>
  )
}