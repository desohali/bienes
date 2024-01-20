// Layout.js
import React from 'react';
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../features/userSlice';

const Layout = ({ children }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: usuario } = useSelector((state) => state.user);
 
  return (
    <div className="layout-container">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {usuario && (
              <Tooltip title="Cerrar Sesión">
                <IconButton
                  onClick={() => {
                    localStorage.removeItem("newInventariador");
                    dispatch(setUser(null));
                    navigate('/');
                  }}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <PowerSettingsNewIcon />
                </IconButton>
              </Tooltip>
            )}
            <Typography variant="h6" component="div" align='center' sx={{ flexGrow: 1 }}>
              {usuario ? `${usuario?.nombres} ${usuario?.apellidos}` : 'Registro de bienes'}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <div className="content-container">{children}</div>
      {/* Puedes agregar aquí elementos comunes al final de todas las páginas */}
      <AppBar position="static">
        <Toolbar >
          <Typography variant="body1" color="inherit" align='center' style={{
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            Copyright ©2024 | Homero Wilmer Odiaga Vasquez<br />
            Todos los derechos reservados.
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Layout;
