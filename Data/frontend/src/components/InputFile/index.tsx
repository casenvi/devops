import * as React from 'react';
import { TextField, Button, InputAdornment, TextFieldProps } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useRef, MutableRefObject, useState, useImperativeHandle } from 'react';

export interface InputFileProps {
    ButtonFile: React.ReactNode;
    InputFileProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>,HTMLInputElement>;
    TextFieldProps?: TextFieldProps;
}

export interface InputFileComponent{
    openWindow: () => void
}
const InputFile = React.forwardRef<InputFileComponent, InputFileProps>((props, ref) => {
    const fileRef = useRef() as MutableRefObject<HTMLInputElement>;
    const [filename, setFilename] = useState("");

    const textFieldProps: TextFieldProps = {
        variant: 'outlined',
        ...props.TextFieldProps,
        InputProps: {
            readOnly: true,
            ...(
                props.TextFieldProps && props.TextFieldProps.InputProps &&
                {...props.TextFieldProps.InputProps}
                ),
            endAdornment:(
                <InputAdornment position={"end"}>
                    {props.ButtonFile}
                </InputAdornment>
            )
        },
        value: filename
        };

        const inputFileProps = {
            ...props.InputFileProps,
            hidden: true,
            ref: fileRef,
            onChange(event: React.ChangeEvent<HTMLInputElement>){
                const files = event.target.files;
                if (files && files.length) {
                    setFilename(
                        Array.from(files).map((file: any) => file.name).join(', ')
                    );
                }
                if (props.InputFileProps && props.InputFileProps.onChange){
                    props.InputFileProps.onChange(event)
                }
            }
        };
    useImperativeHandle(ref, () => ({
        openWindow: () => fileRef.current.click() //não esta chegando aqui
    }));
    return (
        <>
            <input type="file" {...inputFileProps}/>
            <TextField {...textFieldProps}/>
        </>
    )
});

export default InputFile;