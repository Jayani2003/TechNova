import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MessagesProvider } from './context/MessagesContext';
import { BookingsProvider } from './context/BookingsContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MessagesProvider>
          <BookingsProvider>
            <App />
          </BookingsProvider>
        </MessagesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

