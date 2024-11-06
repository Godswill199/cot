// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export const PublicRoute = ({ children }) => {
  const { isUserLoggedIn, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isUserLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};