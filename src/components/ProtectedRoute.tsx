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
        // Only proceed if no interaction is in progress
        if (inProgress !== InteractionStatus.None) {
          return;
        }

        await instance.handleRedirectPromise();
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
            // Only redirect if we're not already in the process
            if (inProgress === InteractionStatus.None) {
              await instance.loginRedirect(loginRequest);
            }
          }
        } else {
          // Only redirect if we're not already in the process
          if (inProgress === InteractionStatus.None) {
            await instance.loginRedirect(loginRequest);
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
      } finally {
        // Only set loading to false if we're authenticated
        if (isAuthenticated) {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [instance, inProgress, isAuthenticated]);

  const loadingSpinner = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (loading || !isAuthenticated || inProgress !== InteractionStatus.None) {
    return loadingSpinner;
  }

  return <>{children}</>;
} 