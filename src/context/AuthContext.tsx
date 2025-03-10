// src/contexts/AuthContext.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';
import { AuthContextType } from '@/types/auth';
import { AuthContext } from './authContextBase';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component that wraps the application.
 * Provides authentication state and methods to all child components.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set loading state based on auth status
    if (auth.isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [auth.isLoading]);

  const login = () => {
    auth.signinRedirect();
  };

  const logout = () => {
    auth.removeUser();
  };

  // Construct the auth context value
  const value: AuthContextType = {
    isAuthenticated: auth.isAuthenticated,
    isLoading,
    user: auth.user,
    login,
    logout,
    error: auth.error || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};