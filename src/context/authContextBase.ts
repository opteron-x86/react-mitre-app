// src/contexts/authContextBase.ts
import { createContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Create the context with undefined as default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);