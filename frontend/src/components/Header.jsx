import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { clearAuth } from '../features/auth/authSlice';
import { AppBar, Toolbar, Typography, Button, Box, Link } from '@mui/material';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CSV Data Processor
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <nav>
            <Link component={RouterLink} to="/" color="inherit" sx={{ mr: 2, textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link component={RouterLink} to="/data" color="inherit" sx={{ textDecoration: 'none' }}>
              View Data
            </Link>
          </nav>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Welcome, {user.name}!</Typography>
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;