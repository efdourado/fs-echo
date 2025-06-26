import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import { AuthProvider } from './context/AuthContext';
import { SongMenuProvider } from './context/SongMenuContext';

import './styles/main.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SongMenuProvider>
          <App />
        </SongMenuProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);