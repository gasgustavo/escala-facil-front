'use client';

import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from '@/config/authConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { instance, inProgress } = useMsal();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Handle redirect promise first
        const result = await instance.handleRedirectPromise();
        if (result?.accessToken) {
          localStorage.setItem('accessToken', result.accessToken);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        const accounts = instance.getAllAccounts();
        if (accounts.length > 0) {
          try {
            const response = await instance.acquireTokenSilent({
              ...loginRequest,
              account: accounts[0]
            });
            
            if (response?.accessToken) {
              localStorage.setItem('accessToken', response.accessToken);
              setIsAuthenticated(true);
            }
          } catch (silentError) {
            console.error('Silent token acquisition failed:', silentError);
            instance.loginRedirect(loginRequest);
          }
        } else {
          instance.loginRedirect(loginRequest);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
      } finally {
        if (!localStorage.getItem('accessToken')) {
          setLoading(true);
        } else {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [instance]);

  const loadingSpinner = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (loading || !isAuthenticated || inProgress !== InteractionStatus.None || !localStorage.getItem('accessToken')) {
    return loadingSpinner;
  }

  return <>{children}</>;
} 