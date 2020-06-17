import * as React from 'react';
import { Box, Container, makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    color: '#999999'
  }
}));

type PageProps = {
  title: string
};

export const Page: React.FC<PageProps> = (props) => {
  const classes = useStyles();
  return (
    <Container>
      <Typography className={classes.title} component="h1" variant="h5">
        {props.title}
      </Typography>
      <Box paddingTop={2}>
        {props.children}
      </Box>

    </Container>
  );
}