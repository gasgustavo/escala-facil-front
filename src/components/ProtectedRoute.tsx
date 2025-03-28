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
        // Wait for MSAL initialization
        await instance.initialize();
        
        // Check localStorage first
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        // If no token in localStorage, get it from MSAL
        const accounts = instance.getAllAccounts();
        const response = await instance.acquireTokenSilent({
          scopes: ["User.Read"],
          account: accounts[0]
        });
        
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth error:', error);
        try {
          // Try login redirect only after ensuring we can handle auth
          await instance.handleRedirectPromise();
          instance.loginRedirect(loginRequest);
        } catch (redirectError) {
          console.error('Redirect error:', redirectError);
        }
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

  return <>{children}</>;
} 