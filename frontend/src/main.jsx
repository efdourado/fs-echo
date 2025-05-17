import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { ThemeProvider } from './context/ThemeContext';
import './styles/main.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    {/* <ThemeProvider> */}
      <App />
    {/* </ThemeProvider> */}
  </StrictMode>
);