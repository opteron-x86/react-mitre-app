// src/hooks/useAuthContext.ts
import { useContext } from 'react';
import { AuthContext } from '@/context/authContextBase';
import { AuthContextType } from '@/types/auth';

/**
 * Custom hook to use the auth context.
 * Must be used within an AuthProvider component.
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};