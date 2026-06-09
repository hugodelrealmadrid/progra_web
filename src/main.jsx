import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContenidoProvider } from './context/ContenidoContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ContenidoProvider>
          <App />
        </ContenidoProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
