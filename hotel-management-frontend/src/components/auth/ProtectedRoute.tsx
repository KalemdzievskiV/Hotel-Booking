import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const currentUser = authService.getCurrentUser();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
