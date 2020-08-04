import * as React from 'react';
import { FormControl, FormControlProps, Button } from '@material-ui/core';
import InputFile, { InputFileComponent } from '../../../components/InputFile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useRef } from 'react';


interface UploadFieldProps {
    accept: string;
    label: string;    
    setValue: (value) => void;
    error?: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps
}

export const UploadField: React.FC<UploadFieldProps> = (props) => {
    const fileRef = useRef() as React.MutableRefObject<InputFileComponent>;
    const {accept, label, setValue, error, disabled} = props;
    return (
        <FormControl
            margin={"normal"}
            error={error!==undefined}
            disabled={disabled=== true} 
            fullWidth
            {...props.FormControlProps}       
        >
            <InputFile
            ref={fileRef}
            TextFieldProps={{
                label: label,
                InputLabelProps: {shrink: true}                
            }}
            InputFileProps={{
                accept,
                onChange(event){
                    event.target.files?.length && setValue(event.target.files[0])
                }
            }
            }
            ButtonFile={
                <Button
                    endIcon={<CloudUploadIcon/>}
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => fileRef.current.openWindow()}
                >
                    Adicionar
                </Button>
            }
            />
       </FormControl>

    )
}