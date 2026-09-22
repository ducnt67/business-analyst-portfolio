import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/dang-nhap" replace />;
};

export default PrivateRoute;
