import * as React from 'react';
import useHttpHandled from '../../../hooks/useHttpHandled';
import { genreHttp } from '../../../util/http/genre-http';
import AsyncAutoComplete, { AsyncAutoCompleteComponent } from '../../../components/AsyncAutoComplete';
import { GridSelected } from '../../../components/Grid/GridSelected';
import { GridSelectedItem } from '../../../components/Grid/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import { Typography, FormControlProps, FormControl, FormHelperText } from '@material-ui/core';
import { getGenresFromCategory } from '../../../util/model-filter';
import { useRef, MutableRefObject, useImperativeHandle } from 'react';


interface GenreFieldProps {
  genres: any[];
  setGenres: (genres) => void;
  categories: any[];
  setCategories: (categories) => void;
  error: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

export interface GenreFieldComponent{
  clear: () => void
}
const GenreField = React.forwardRef<GenreFieldComponent, GenreFieldProps>((props, ref) => {
    const {genres, setGenres, error, disabled, categories, setCategories} = props; 
    const autocompleteHttp = useHttpHandled();
    const {addItem, removeItem} = useCollectionManager(genres, setGenres);
    const {removeItem: removeCategory} = useCollectionManager(categories, setCategories);
    const autocompleteRef = useRef() as MutableRefObject<AsyncAutoCompleteComponent>;

    const fetchOptions = (searchText:string) => autocompleteHttp(genreHttp.list({
    queryParams: {
      search: searchText, 
      all:""    
    }
  })).then((data)=> data.data);
  useImperativeHandle(ref, () => ({
    clear: () => autocompleteRef.current.clear()
  }));  
  return (
        <>
        <AsyncAutoComplete
        ref={autocompleteRef}

        fetchOptions={fetchOptions}
        TextFieldProps={{
          label: 'Gêneros',
          error: error !== undefined
        }}
        AutocompleteProps={{
          clearOnEscape: true,
          freeSolo: true,    
          getOptionLabel: option=>option.name,
          getOptionSelected: (options, value) => options.id = value.id,
          onChange: (_event, value) => addItem(value),    
          disabled                        
        }}
      />
      <FormControl
          error={error!== undefined}
          disabled={disabled ===true}
          {...props.FormControlProps}
          >
        <GridSelected>
            {genres.map((genre, key) => (
              <GridSelectedItem 
                key={key} 
                onDelete={()=>{
                  const categoriesWithOneGenre = categories
                  .filter(category => {
                    const genresFromCategory = getGenresFromCategory(genres, category);
                    return genresFromCategory.length === 1 && genres[0].id === genre.id
                  });
                  categoriesWithOneGenre.forEach(cat => removeCategory(cat));
                  removeItem(genre);

                }} 
                xs={12}>
            <Typography noWrap={true}>{genre.name}</Typography>
            </GridSelectedItem>
            ))}
          
        </GridSelected>
        {
          error && <FormHelperText>{error.message}</FormHelperText>
        }
      </FormControl>
      </>
    );
});
export default GenreField;