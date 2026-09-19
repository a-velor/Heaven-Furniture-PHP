import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { EcommerceProvider } from './context/EcommerceContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <EcommerceProvider>
        <App />
      </EcommerceProvider>
    </ThemeProvider>
  </StrictMode>,
);
