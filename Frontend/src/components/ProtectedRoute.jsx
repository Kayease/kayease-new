import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireAdmin = false, allowedRoles = [] }) => {
  const { user, loading, hasRole, hasAnyRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required admin role
  if (requireAdmin && !hasRole('ADMIN')) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  // Check if user has any of the allowed roles
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    // Redirect to home if user doesn't have required roles
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;