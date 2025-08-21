import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Get the token from our Redux auth state
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // If there is no token, redirect to the login page
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]); // This effect runs whenever the token or navigate function changes

  // If there is a token, render the child components (the protected page)
  // Otherwise, render nothing while the redirect happens.
  return token ? children : null;
};

export default ProtectedRoute;