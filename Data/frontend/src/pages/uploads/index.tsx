import * as React from 'react';
import { Theme, makeStyles, CardContent, Card, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, List, Divider } from '@material-ui/core';
import { Page } from '../../components/Page';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UploadItem from './UploadItem';
import { useSelector } from 'react-redux';
import { UploadModule, Upload } from '../../store/upload/types';
import { VideoFileFieldsMap } from '../../util/models';


const useStyles = makeStyles((theme: Theme) => {
    return ({
        panelSummary: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
        },
        expandedIcon: {
            color: theme.palette.primary.contrastText
        }
    })
})

interface UploadsProps {
    
}
 
export const Uploads: React.FC<UploadsProps> = () => {
    const classes = useStyles();
    const uploads = useSelector<UploadModule, Upload[]>(
        (state: UploadModule) => state.upload.uploads
    );
    return ( 
        <Page title={'Uploads'}>
            { 
                uploads.map((upload, key) => (
                    <Card elevation={5}>
                        <CardContent>
                            <UploadItem uploadOrFile={upload}>
                                {upload.video.title}
                            </UploadItem>
                            <ExpansionPanelSummary
                                className={classes.panelSummary}
                                expandIcon={
                                    <ExpandMoreIcon className={classes.expandedIcon}/>
                                }
                            >                    
                                <Typography> Ver Detalhes</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding:'0px'}}>
                                <Grid item xs={12}>
                                    <List dense={true} style={{padding:'0px'}}>
                                        { upload.files.map((file, key) => (
                                            <React.Fragment key={key}>
                                                <Divider/>
                                                <UploadItem uploadOrFile={file}>
                                                    {`${VideoFileFieldsMap[file.fileField]} - ${file.filename}`}
                                                </UploadItem>
                                            </React.Fragment>
                                        ))
                                        }
                                    </List>
                                </Grid>
                            </ExpansionPanelDetails>
                        </CardContent>
                    </Card>
                ))
            }
        </Page>
     );
}