// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from 'react-oidc-context';

// Cognito OAuth configuration
const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_0JekqY5jI",
  client_id: "51516dmsbr23furik1dv3bd91j",
  redirect_uri: "http://localhost:5173",  // Use dynamic origin instead of hardcoded URL
  response_type: "code",
  scope: "phone openid email",
  automaticSilentRenew: true,
  loadUserInfo: true,
};

// Create the root element and render the app.
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Wrap the application with AuthProvider from react-oidc-context
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);