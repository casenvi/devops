import * as React from 'react';
import {Autocomplete, AutocompleteProps} from '@material-ui/lab';
import {TextFieldProps} from '@material-ui/core/TextField';
import {TextField, CircularProgress} from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

interface AsyncAutoCompleteProps {
    TextFieldProps?: TextFieldProps
    fetchOptions:(searchText:string) => Promise<any>
    AutocompleteProps?: Omit<AutocompleteProps<any>, 'renderInput'>
}

const AsyncAutoComplete: React.FC<AsyncAutoCompleteProps> = (props) => {
    const {AutocompleteProps} = props;  
    const {freesolo, onOpen, onClose, onInputChange} = AutocompleteProps as any;
    const[open, setOpen] = useState(false);
    const[options, setOptions] = useState([]);
    const[loading, setLoading] = useState(false);
    const[searchText, setSearchText] = useState("");
    const snackbar = useSnackbar();
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
        freeSolo: freesolo,       
        open,
        options,
        loading: loading,        
        onOpen(event){
            setOpen(true);
            onOpen && onOpen(event);
        },
        onClose(event){
            setOpen(false);
           onClose && onClose(event);
        },
        onInputChange(event, value){
            setSearchText(value);
            onInputChange && onInputChange(event, value);
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
    },[open]);

    useEffect( () => {
        if (!open || searchText ==="" && freesolo){
            return;
        }
        let isSubscribe = true;
        (async () => {
            setLoading(true);
            try{
                const data = await props.fetchOptions(searchText);
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
    
    },[freesolo ? searchText : open]);

    return(
        <Autocomplete{...autocompleteProps}/>
    );
};


export default AsyncAutoComplete;