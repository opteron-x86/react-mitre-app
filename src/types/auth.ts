// src/types/auth.ts
import { User as OidcUser } from 'oidc-client-ts';

// We'll use the OidcUser type directly instead of extending it
// This avoids TypeScript errors with incompatible types

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: OidcUser | null;
  login: () => void;
  logout: () => void;
  error: Error | null;
}