import * as React from 'react';
import { Tooltip, IconButton, makeStyles } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll'

const useStyles = makeStyles(theme => ({
  iconButton: (theme as any).overrides.MUIDataTableToolbar.icon
}));

interface FilterResetButtonProps {
  handleClick: () => void
}

export const FilterResetButton: React.FC<FilterResetButtonProps> = (props) => {
  const classes = useStyles();
  return (
    <Tooltip title={'Limpar Busca'}>
      <IconButton className={classes.iconButton} onClick={props.handleClick}>
        <ClearAllIcon />
      </IconButton>
    </Tooltip>
  );
};