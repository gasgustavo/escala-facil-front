'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, login } = useAuth();

  useEffect(() => {
    // If not loading and not authenticated, redirect to Azure AD login
    if (!loading && !isAuthenticated) {
      window.location.href = '/.auth/login/aad';
    }
  }, [loading, isAuthenticated]);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authenticated, show the protected content
  return isAuthenticated ? <>{children}</> : null;
} 