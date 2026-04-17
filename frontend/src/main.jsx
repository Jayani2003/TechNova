import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MessagesProvider } from './context/MessagesContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MessagesProvider>
          <App />
        </MessagesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

