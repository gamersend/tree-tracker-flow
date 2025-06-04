
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tree-green"></div>
      </div>
    );
  }

  // If not authenticated and not on auth page, redirect to login
  if (!user && !location.pathname.startsWith('/auth')) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated and on auth page, redirect to dashboard
  if (user && location.pathname.startsWith('/auth')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
