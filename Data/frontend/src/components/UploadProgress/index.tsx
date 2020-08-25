import * as React from 'react';
import { CircularProgress, makeStyles, Theme, Fade } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

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
}
 
const UploadProgress: React.FC<UploadProgressProps> = (props) => {
    const {size} = props;
    const classes = useStyles();
    return (  
        <Fade in={true} timeout={{enter:100, exit: 3000}}>
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
                    value={10}
                    size={size}
                />
            </div>
        </Fade>
    );
}
 
export default UploadProgress;