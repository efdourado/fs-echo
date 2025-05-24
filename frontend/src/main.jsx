import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; //
import { AuthProvider } from './context/AuthContext';
import './styles/main.css'; //

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);