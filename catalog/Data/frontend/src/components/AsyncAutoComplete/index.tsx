import * as React from 'react';
import {Autocomplete, AutocompleteProps, UseAutocompleteSingleProps} from '@material-ui/lab';
import {TextFieldProps} from '@material-ui/core/TextField';
import {TextField, CircularProgress} from '@material-ui/core';
import { useState, useEffect, RefAttributes, useImperativeHandle } from 'react';
import { useDebounce } from 'use-debounce/lib';

interface AsyncAutoCompleteProps extends RefAttributes<AsyncAutoCompleteComponent> {
    TextFieldProps?: TextFieldProps
    fetchOptions:(searchText:string) => Promise<any>
    debounceTime?: number;
    AutocompleteProps?: Omit<AutocompleteProps<any>, 'renderInput'> & UseAutocompleteSingleProps<any>;
}
export interface AsyncAutoCompleteComponent{
    clear: () => void
  }
const AsyncAutoComplete = React.forwardRef<AsyncAutoCompleteComponent, AsyncAutoCompleteProps>((props, ref) => {
    const {AutocompleteProps, debounceTime = 300, fetchOptions} = props;  
    const {freesolo, onOpen, onClose, onInputChange} = AutocompleteProps as any;
    const[open, setOpen] = useState(false);
    const[options, setOptions] = useState([]);
    const[loading, setLoading] = useState(false);
    const[searchText, setSearchText] = useState("");
    const [debouncedSearchText] = useDebounce(searchText, debounceTime);    
    const textFieldProps: TextFieldProps = {
        margin: 'normal',
        variant: 'outlined',
        fullWidth: true,
        InputLabelProps: {shrink: true},
        ...(props.TextFieldProps && {...props.TextFieldProps})
    };
    const autocompleteProps: AutocompleteProps<any> = {
        loadingText: 'Carregando...',
        noOptionsText: 'Nenhum Item Encontrado',
        ...(AutocompleteProps && {...AutocompleteProps}), 
        open,
        options,
        loading: loading, 
        inputValue: searchText,       
        onOpen(){
            setOpen(true);
            onOpen && onOpen();
        },
        onClose(){
            setOpen(false);
            onClose && onClose();
        },
        onInputChange(event, value){
            setSearchText(value);
            onInputChange && onInputChange();
        },
        renderInput: params => (
            <TextField 
                {...params} 
                {...textFieldProps}
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                        {loading && <CircularProgress color={"inherit"} size={20}/>}
                        {params.InputProps.endAdornment}
                        </>
                    )
                }
                }
            />
        )        
    }
    useEffect(() => {
        if(!open && !freesolo){
            setOptions([]);
        }
    },[open, freesolo]);

    useEffect( () => {        
        if (!open){
            return;
        }
        if (debouncedSearchText === "" && freesolo){
            return;
        }
        let isSubscribe = true;
        (async () => {
            setLoading(true);
            try{
                const data = await fetchOptions(debouncedSearchText);
                if (isSubscribe){
                    setOptions(data);
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            isSubscribe = false;
        }
    
    },[freesolo, debouncedSearchText, open, fetchOptions]);

    useImperativeHandle(ref, () => ({
        clear: () => {
            setSearchText("");
            setOptions([]);
        }
    }))
    return(
        <Autocomplete{...autocompleteProps}/>
    );
});


export default AsyncAutoComplete;