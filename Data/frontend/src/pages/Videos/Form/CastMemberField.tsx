import * as React from 'react';
import useHttpHandled from '../../../hooks/useHttpHandled';
import AsyncAutoComplete, { AsyncAutoCompleteComponent } from '../../../components/AsyncAutoComplete';
import { GridSelected } from '../../../components/Grid/GridSelected';
import { GridSelectedItem } from '../../../components/Grid/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import { FormControlProps, FormControl, FormHelperText, Typography} from '@material-ui/core';
import { castMemberHttp } from '../../../util/http/cast-member-http';
import { useRef, MutableRefObject, useImperativeHandle } from 'react';

interface CastMemberFieldProps {
  castMembers: any, 
  setCastMembers: (castMembers) => void
  error: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

export interface CastMemberFieldComponent{
  clear: () => void
}

const CastMemberField = React.forwardRef<CastMemberFieldComponent, CastMemberFieldProps>((props, ref) => {
  const {castMembers, setCastMembers, error, disabled} = props;     
  const autocompleteHttp = useHttpHandled();
  const {addItem, removeItem} = useCollectionManager(castMembers, setCastMembers);
  const autocompleteRef = useRef() as MutableRefObject<AsyncAutoCompleteComponent>;

  const fetchOptions = (searchText:string) => autocompleteHttp(castMemberHttp.list({
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
        label: 'Elenco',
        error: error !== undefined
      }}
      AutocompleteProps={{
        clearOnEscape: true,
        freeSolo: true,    
        getOptionLabel: option=>option.name,
        getOptionSelected: (options, value) => options.id = value.id,
        onChange:(event, value) => addItem(value),
        disabled: disabled === true
      }}
    />
      <FormControl
        error={error!== undefined}
        disabled={disabled ===true}
        {...props.FormControlProps}
        >
    <GridSelected>
      {
        castMembers.map((castMember, key) => {
          return(
          <GridSelectedItem 
            key={key}
            onDelete={()=>{removeItem(castMember)}} xs={12}>
                <Typography noWrap={true}>
                  {castMember.name}
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
});
export default CastMemberField;