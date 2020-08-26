import * as React from 'react';
import { CircularProgress, makeStyles, Theme, Fade } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Upload, FileUpload } from '../../store/upload/types';
import { hasError } from '../../store/upload/getters';

const useStyles = makeStyles((theme: Theme) => ({
    progressContainer: {
        position: 'relative'
    },
    progress: {
        position: 'absolute',
        left: 0
    },
    progressBackground: {
        color: grey['300']
    },
}))

interface UploadProgressProps {
    size: number;
    uploadOrFile: Upload | FileUpload;
}
 
const UploadProgress: React.FC<UploadProgressProps> = (props) => {
    const {size, uploadOrFile} = props;
    const classes = useStyles();
    const error = hasError(uploadOrFile);
    return (  
        <Fade in={uploadOrFile.progress < 1} timeout={{enter:100, exit: 3000}}>
            <div className={classes.progressContainer}>
                <CircularProgress
                    className={classes.progressBackground}
                    value={100}
                    variant="static"
                    size={size}
                    />
                <CircularProgress
                    className={classes.progress}
                    variant="static"
                    value={error? 0 : uploadOrFile.progress * 100}
                    size={size}
                />
            </div>
        </Fade>
    );
}
 
export default UploadProgress;