import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';

// Find the root element in your HTML
const container = document.getElementById('root');

// Create a root for React 18
const root = createRoot(container);

// Use the root to render your app
root.render(
  <React.StrictMode>
    <App />
    <NotificationContainer />
  </React.StrictMode>
);
