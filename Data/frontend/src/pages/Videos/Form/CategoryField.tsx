import * as React from 'react';
import useHttpHandled from '../../../hooks/useHttpHandled';
import AsyncAutoComplete from '../../../components/AsyncAutoComplete';
import { GridSelected } from '../../../components/Grid/GridSelected';
import { GridSelectedItem } from '../../../components/Grid/GridSelectedItem';
import { categoryHttp } from '../../../util/http/category-http';
import useCollectionManager from '../../../hooks/useCollectionManager';
import { Genre } from '../../../util/models';
import { FormControlProps, FormControl, FormHelperText, Typography, makeStyles, Theme } from '@material-ui/core';
import { getGenresFromCategory } from '../../../util/model-filter';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>( {
  genresSubtitle:{
    fontSize: '0.8rem',
    color: grey[800]
  }
}));

interface CategoryFieldProps {
  categories: any, 
  setCategories: (categories) => void
  genres: Genre[];
  error: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const CategoryField: React.FC<CategoryFieldProps> = (props) =>{
  const classes = useStyles();
  const {categories, setCategories, genres,  error, disabled} = props;     
  const autocompleteHttp = useHttpHandled();
  const {addItem, removeItem} = useCollectionManager(categories, setCategories);
  const fetchOptions = (searchText:string) => autocompleteHttp(categoryHttp.list({
    queryParams: {
      search: searchText, 
      genres: genres.map(genre => genre.id).join(','),
      all:""    
    }
  })).then((data)=> data.data);
    return (
        <>
        <AsyncAutoComplete
        fetchOptions={fetchOptions}
        TextFieldProps={{
          label: 'Categorias',
          error: error !== undefined
        }}
        AutocompleteProps={{
          clearOnEscape: true,
          freeSolo: true,    
          getOptionLabel: option=>option.name,
          getOptionSelected: (options, value) => options.id = value.id,
          onChange:(event, value) => addItem(value),
          disabled: disabled === true || !genres.length,
        }}
      />
       <FormControl
          error={error!== undefined}
          disabled={disabled ===true}
          {...props.FormControlProps}
          >
      <GridSelected>
        {
          categories.map((category, key) => {
          const genresFromCategory = getGenresFromCategory(genres,category)
              .map(genre => genre.name) 
              .join(',');
            return(
            <GridSelectedItem 
              key={key}
              onDelete={()=>{removeItem(category)}} xs={12}>
                  <Typography noWrap={true}>
                    {category.name}
                  </Typography>
                  <Typography noWrap={true} className={classes.genresSubtitle}>
                    Gêneros: {genresFromCategory} 
                    </Typography>
              </GridSelectedItem>
          )})
          }
      </GridSelected>
      {
          error && <FormHelperText>{error.message}</FormHelperText>
        }
      </FormControl>
      </>
    );
};
export default CategoryField;