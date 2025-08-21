import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

const Body = () => {
  return (
    <div>
      {/* The Outlet component will render the matched child route: */}
      {/* Either LoginPage, RegisterPage, or DashboardPage will be displayed here */}
      
      <Outlet />
    </div>
  );
};

export default Body;