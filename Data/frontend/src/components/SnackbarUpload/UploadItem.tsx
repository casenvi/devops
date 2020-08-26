import * as React from 'react';
import { Theme, makeStyles, ListItem, ListItemIcon, ListItemText, Typography, Divider, Tooltip } from '@material-ui/core';
import MovieIcon from '@material-ui/icons/Movie';
import UploadProgress from '../UploadProgress';
import { Upload } from '../../store/upload/types';
import UploadAction from './UploadAction';
import { hasError } from '../../store/upload/getters';
import { useState } from 'react';
const useStyles = makeStyles((theme: Theme) => ({
    movieIcon: {
        color: theme.palette.error.main,
        minWidth: '40px'
    },
    listItem: {
        paddingTop: '7px', 
        paddingBottom: '7px',
        height: '53px'
    },
    listItemText: {
        marginLeft: '6px',
        marginRight: '24px',
        color: theme.palette.text.secondary
    },
}));
export interface UploadItemProps {
    upload: Upload;
    
}
 
const UploadItem: React.FC<UploadItemProps> = (props) => {
    const classes = useStyles();
    const{upload} = props;
    const error = hasError(upload);
    const [itemHover, setItemHover] = useState(false);
    return ( 
        <>
            <Tooltip
                disableFocusListener
                disableTouchListener
                onMouseOver={() => setItemHover(true)}
                onMouseLeave={() => setItemHover(true)}
                title={error ? "Não foi possível fazer o upload, clique para mais detalhes" : ""}
                placement={'left'}
            >
                <ListItem
                    className={classes.listItem}
                    button
                    >
                        <ListItemIcon className={classes.movieIcon}>
                            <MovieIcon/>
                        </ListItemIcon>
                        <ListItemText
                            className={classes.listItemText}
                            primary={
                                <Typography noWrap={true} variant={'subtitle2'} color={'inherit'}>
                                    {upload.video.title}
                                </Typography>
                            }
                        />
                        <UploadProgress size={30} uploadOrFile={upload}/>
                        <UploadAction upload={upload} hover={itemHover}/>
                </ListItem>
            </Tooltip>
            <Divider component='li'/>
        </>
     );
}
 
export default UploadItem;