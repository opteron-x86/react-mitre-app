// src/components/RouterProvider.tsx
import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Props for the RouterProvider component
 */
interface RouterProviderProps {
  children: ReactNode;
}

/**
 * Provides a Router context for components that might be rendered
 * outside the main Router context in the app.
 * 
 * This is particularly useful for dialog content or components
 * that need to use Link components but might be rendered
 * in portals or other contexts that break the Router context.
 */
const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  // This is a wrapper component to provide Router context when needed
  return <BrowserRouter>{children}</BrowserRouter>;
};

export default RouterProvider;