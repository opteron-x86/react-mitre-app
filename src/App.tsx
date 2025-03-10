// src/App.tsx
import React from 'react';
import ThemeProvider from '@/components/ThemeProvider';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/Auth/AuthGuard';

/**
 * Main application component.
 * Wraps the application with necessary providers including authentication.
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthGuard>
        <ThemeProvider>
          <Layout>
            <Home />
          </Layout>
        </ThemeProvider>
      </AuthGuard>
    </AuthProvider>
  );
};

export default App;