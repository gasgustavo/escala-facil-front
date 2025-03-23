'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: () => void;
  logout: () => void;
  getAuthToken: () => Promise<string | null>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  getAuthToken: async () => null,
  loading: true,
});

export async function getAuthToken() {
  try {
    const response = await fetch('/.auth/me');
    const data = await response.json();
    
    if (data.clientPrincipal) {
      return data.clientPrincipal.accessToken;
    }
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
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
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getAuthToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 