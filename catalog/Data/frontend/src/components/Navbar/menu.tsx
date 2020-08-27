import * as React from 'react';
import { IconButton, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import routes, { MyRouteProp } from '../../routes';
import { Link } from 'react-router-dom';

interface listRoutesInt {
  [selector: string]: string 
}

export const Menu = () => {
  
  
  const listRoutes:listRoutesInt = {
    'dashboard' : 'Dashboard',
    'category.list' : 'Categorias',
    'castmember.list' : 'Membros do Elenco',
    'genre.list': 'Gêneros',
    'video.list': 'Vídeos',
    'uploads': 'Upload'
  };  
  const menuRoutes = routes.filter(route => Object.keys(listRoutes).includes(route.name));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <React.Fragment>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <MenuIcon />
      </IconButton>

      <MuiMenu
        id="menu-appbar"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        getContentAnchorEl={null}
      >
        {
          Object.keys(listRoutes).map(
            (routeName, key) => {
              const route = menuRoutes.find(route => route.name === routeName) as MyRouteProp;
              return (
                <MenuItem
                  key={key}
                  component={Link}
                  to={route.path as string}
                  onClick={handleClose}>
                  {listRoutes[routeName]}
                </MenuItem>
              )
            }
          )
        }

      </MuiMenu>
    </React.Fragment>
  );
};