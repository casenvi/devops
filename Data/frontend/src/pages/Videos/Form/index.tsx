import * as React from 'react';
import { useEffect, useState, useRef, MutableRefObject, createRef } from 'react';
import { TextField, Checkbox, Box, Button, ButtonProps, FormControlLabel, Grid, Typography, useMediaQuery, useTheme, Card, CardContent } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { videoHttp } from '../../../util/http/video-http';
import * as yup from '../../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import { RatingField } from './RatingField';
import { UploadField, UploadFieldComponent } from './UploadField';
import { VideoFileFieldsMap } from '../../../util/models';
import GenreField, { GenreFieldComponent } from './GenreField';
import CategoryField, { CategoryFieldComponent } from './CategoryField';
import CastMemberField, { CastMemberFieldComponent } from './CastMemberField';
import { omit, zipObject } from 'lodash';
import useSnackbarFormError from '../../../hooks/useSnackbarFormError';
import LoadingContext from '../../../components/Loading/LoadingContent';

const useStyles = makeStyles((theme: Theme) => ({
  cardUpload: {
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    margin: theme.spacing(2, 0),    
  },
  cardOpened: {
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
  },
  cardContentOpened: {
    paddingBottom: theme.spacing(2)+'px !important'
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
  genres: yup.array()
  .label('Gêneros')
  .required()
  .test({
    message: 'Cada Gênero deve ter ao menos uma categoria selecionada',
    test(value){
      return value.every(
        v => v.categories.filter(
          cat => this.parent.categories.map(c => c.id).includes(cat.id)
        ).length !==0
      );
    }
  }),
  categories: yup.array()
  .label('Categorias')
  .required(),
  cast_members: yup.array()
  .label('Elenco')
  .required(),
  rating: yup.string()
    .label('Classificação')
    .required(),
  
});

const fileFields = Object.keys(VideoFileFieldsMap);

export const Form = () => {
  

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    errors,
    watch,
    triggerValidation,
    formState } = useForm<{
      name: string, 
      year_launched: string,
      duration: string,
      rating: any,
      genres: any,
      categories: any,
      cast_members: any,
      opened: boolean,
    }>({
      validationSchema,
      defaultValues: {
        rating: null,
        cast_members: [],
        genres: [],
        categories: [],
        opened: false,
      },
      
    });
    useSnackbarFormError(formState.submitCount, errors);
  const classes = useStyles();
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams();
  const [video, setVideo] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));
  const castMemberRef = useRef() as MutableRefObject<CastMemberFieldComponent>;
  const genreRef = useRef() as MutableRefObject<GenreFieldComponent>;
  const categoryRef = useRef() as MutableRefObject<CategoryFieldComponent>;
  const uploadRef = useRef(
    zipObject(fileFields, fileFields.map(() => createRef()))
  ) as MutableRefObject<{[key: string]: MutableRefObject<UploadFieldComponent>}>;
  const buttonProps: ButtonProps = {
    variant: 'contained',
    color: 'secondary',
    className: classes.submit,
    disabled: loading
  }
  const testLoading = React.useContext(LoadingContext);
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
    const otherFields = ['rating', 'cast_members', 'categories', 'genres', 'opened', ...fileFields].forEach(name => register(name));
  }, [register]);

  function onSubmit(formData: any, event: any) {
    setLoading(true);
    const sendData = omit(formData, ['cast_members', 'genres', 'categories']);
    sendData['cast_members_id'] = formData['cast_members'].map(cast_member => cast_member.id);
    sendData['categories_id'] = formData['categories'].map(category => category.id);
    sendData['genres_id'] = formData['genres'].map(genre => genre.id);
    const http = !video
      ? videoHttp.create(sendData)
      : videoHttp.update(video.id, {...sendData, _method:'PUT'}, /* {http: {usePost: true}} */);
    http
      .then((response) => {
        snackbar.enqueueSnackbar(
          'Video salvo com sucesso',
          { variant: 'success' }
        );
        id && resetForm(video);
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
          'Não foi possível salvar o video',
          { variant: 'error' }
        )
      })
      .finally(
        () => setLoading(false)
      );
  }

  function resetForm(data) {
    Object.keys(uploadRef.current).forEach(
      field => uploadRef.current[field].current.clear()
    );
    castMemberRef.current.clear();
    genreRef.current.clear();
    categoryRef.current.clear();
    reset(data);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <TextField
            name="title"
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
            <Grid item md={6} xs={12}>
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
            <Grid item md={6} xs={12}>
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
          <Grid container spacing={2}>
            <Grid item md={12}>
              <CastMemberField
                castMembers = {watch('cast_members')}
                setCastMembers = {(value => setValue('cast_members', value, true))}
                error={errors.cast_members}
                disabled={loading}
                ref={register}
                />
              </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <GenreField
                categories = {watch('categories')}
                setCategories = {(value => setValue('categories', value, true))}
                genres = {watch('genres')}
                setGenres = {(value => setValue('genres', value, true))}
                disabled={loading}
                ref={register}
                error={errors.genres}
              />
            </Grid>
            <Grid item xs={6}>
              <CategoryField
                categories = {watch('categories')}
                setCategories = {(value => setValue('categories', value, true))}
                genres = {watch('genres')}
                error={errors.categories}
                disabled={loading}
                ref={register}
              />
            </Grid>
          </Grid>
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
                ref={uploadRef.current['thumb_file']}
                accept={'image/*'}
                label={'Thumb'}
                setValue={(value) =>setValue('thumb_file', value)}
              />
            <UploadField
                ref={uploadRef.current['banner_file']}
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
              ref={uploadRef.current['trailer_file']}
              accept={'video/mp4'}
              label={'Trailer'}
              setValue={(value) =>setValue('trailer_file', value)}
            />
            <UploadField
              ref={uploadRef.current['video_file']}
              accept={'video/mp4'}
              label={'Principal'}
              setValue={(value) =>setValue('video_file', value)}
            />     
                   
          </Card>
          <Card className={classes.cardOpened}>
            <CardContent className={classes.cardContentOpened}>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box dir="rtl">
        <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
        <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
      </Box>    
    </form>
  )
}