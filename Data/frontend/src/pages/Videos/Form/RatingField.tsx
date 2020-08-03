import * as React from 'react';
import { FormControl, RadioGroup, FormLabel, FormControlLabel, FormHelperText, Radio, FormControlLabelProps } from '@material-ui/core';
import Rating from '../../../components/Rating';

interface RatingFieldProps {
    value: string;
    setValue: (value) => void;
    error: any;
    disabled?: boolean;
}

const ratings: FormControlLabelProps[] = [
    {value: "L", control:<Radio color="primary"/>, label: <Rating rating={'L'}/>, labelPlacement: "top"},
    {value: "10", control:<Radio color="primary"/>, label: <Rating rating={'10'}/>, labelPlacement: "top"},
    {value: "12", control:<Radio color="primary"/>, label: <Rating rating={'12'}/>, labelPlacement: "top"},
    {value: "14", control:<Radio color="primary"/>, label: <Rating rating={'14'}/>, labelPlacement: "top"},
    {value: "16", control:<Radio color="primary"/>, label: <Rating rating={'16'}/>, labelPlacement: "top"},
    {value: "18", control:<Radio color="primary"/>, label: <Rating rating={'18'}/>, labelPlacement: "top"},
];

export const RatingField: React.FC<RatingFieldProps> = (props) => {
    const {value, setValue, error, disabled} = props;
    return (
        <FormControl
            margin={"normal"}
        error={error!==undefined}
            disabled={disabled=== true}        
        >
            <FormLabel component="legend">Classificação</FormLabel>
            <RadioGroup
                name="rating"
                onChange={
                    (e) => setValue(e.target.value)
                }
                value={value}
                row
            >
               {
                   ratings.map(
                       (prop, key)=><FormControlLabel key={key} {...prop}/>
                   )
               }
            </RadioGroup>
            {
                error && <FormHelperText>{error.message}</FormHelperText>
            }
       </FormControl>

    )
}