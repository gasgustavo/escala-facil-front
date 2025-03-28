'use client';

import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/config/authConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { instance } = useMsal();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First handle any redirects
        await instance.handleRedirectPromise();
        
        // Check localStorage first
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        // If no token in localStorage, get it from MSAL
        const accounts = instance.getAllAccounts();
        if (accounts.length > 0) {
          try {
            const response = await instance.acquireTokenSilent({
              ...loginRequest,
              account: accounts[0]
            });
            
            if (response.accessToken) {
              localStorage.setItem('accessToken', response.accessToken);
              setIsAuthenticated(true);
            }
          } catch (silentError) {
            // If silent token acquisition fails, try redirect
            instance.loginRedirect(loginRequest);
          }
        } else {
          // No accounts found, redirect to login
          instance.loginRedirect(loginRequest);
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [instance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return <div key={isAuthenticated.toString()}>{children}</div>;
} 