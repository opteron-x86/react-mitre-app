// src/components/Auth/AuthGuard.tsx
import React, { ReactNode } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import AuthCallback from './AuthCallback';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Guard component that handles authentication state transitions.
 * Shows appropriate UI during authentication processes.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLoading, error } = useAuthContext();

  // Show the callback component when handling OAuth flow or errors
  if (isLoading || error) {
    return <AuthCallback />;
  }

  // Normal app flow when authentication state is settled
  return <>{children}</>;
};

export default AuthGuard;