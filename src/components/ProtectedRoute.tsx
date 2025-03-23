'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, login } = useAuth();

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Only redirect if we're sure we're not authenticated
      if (!loading && !isAuthenticated) {
        login();
      }
    };

    checkAndRedirect();
  }, [loading, isAuthenticated, login]);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not loading and authenticated, show the protected content
  if (!loading && isAuthenticated) {
    return <>{children}</>;
  }

  // If not loading and not authenticated, show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
} 