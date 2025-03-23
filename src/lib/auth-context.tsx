'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: ClientPrincipal | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<ClientPrincipal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (process.env.NEXT_PUBLIC_IS_LOCAL === 'true') {
        // Mock authenticated user
        setIsAuthenticated(true);
        setUser({
          identityProvider: 'aad',
          userId: 'mock-user-id',
          userDetails: 'mock@user.com',
          userRoles: ['authenticated']
        });
        setLoading(false);
        return;
      }
      const response = await fetch('/.auth/me');
      const data = await response.json();
      
      if (data.clientPrincipal) {
        setIsAuthenticated(true);
        setUser(data.clientPrincipal);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Direct redirect to Azure AD login
    window.location.href = '/.auth/login/aad';
  };

  const logout = async () => {
    try {
      // Call the logout endpoint
      await fetch('/.auth/logout');
      // Clear the auth state
      setIsAuthenticated(false);
      setUser(null);
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 