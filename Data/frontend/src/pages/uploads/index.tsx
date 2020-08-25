import * as React from 'react';
import { Theme, makeStyles, CardContent, Card, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, List, Divider } from '@material-ui/core';
import { Page } from '../../components/Page';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UploadItem from './UploadItem';


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
    return ( 
        <Page title={'Uploads'}>
            <Card elevation={5}>
                <CardContent>
                    <UploadItem>
                        Video e vento levou
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
                                <Divider/>
                                <UploadItem>
                                    Principal - nome do arquivo.mp4
                                </UploadItem>
                            </List>
                        </Grid>
                    </ExpansionPanelDetails>
                </CardContent>
            </Card>
        </Page>
     );
}