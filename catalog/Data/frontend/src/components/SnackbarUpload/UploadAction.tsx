import * as React from 'react';
import { makeStyles, Theme, Fade, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@material-ui/icons/Delete';
import { Upload } from '../../store/upload/types';
import { useDispatch } from 'react-redux';
import { Creators } from '../../store/upload';
import { hasError, isFinished } from '../../store/upload/getters';
import { useState } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
   successIcon: {
       color: theme.palette.success.main
   },
   errorIcon: {
       color: theme.palette.error.main
   },
   deleteIcon: {
       color: theme.palette.primary.main
   },
}));

interface UploadActionProps {
    upload: Upload;
    hover: boolean;
}
 
const UploadAction: React.FC<UploadActionProps> = (props) => {
    const classes = useStyles();
    const{upload, hover} = props;
    const error = hasError(upload);
    const dispatch = useDispatch();
    const[show, setShow] = useState(false);
    React.useEffect(() => {
        setShow(isFinished(upload));
    }, [upload]);
    return (        
        <Fade in={show} timeout={{enter:1000}}>
            <ListItemSecondaryAction>
                <span hidden={hover}>
                    {
                        upload.progress === 1 && !error &&(
                            <IconButton className={classes.successIcon} edge={'end'}>
                                <CheckCircleIcon/>
                            </IconButton>
                        )
                    }
                    {
                        error &&(
                        <IconButton className={classes.errorIcon} edge={'end'}>
                            <ErrorIcon/>
                        </IconButton>)
                    }
                </span>
                <span hidden={!hover}>
                    <IconButton 
                        className={classes.deleteIcon} 
                        edge={'end'} 
                        onClick={() => dispatch(Creators.removeUpload({id: upload.video.id}))}
                    >
                        <DeleteIcon/>
                        </IconButton>
                </span>
            </ListItemSecondaryAction>
        </Fade>
    );
}
 
export default UploadAction;