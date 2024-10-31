// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export const UserProtectedRoute = ({ children }) => {
  const { isUserLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isUserLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname || '/' }} replace />;
  }

  return children;
};