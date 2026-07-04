import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MessagesProvider } from './context/MessagesContext';
import { BookingsProvider } from './context/BookingsContext.jsx';
<<<<<<< HEAD

import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
=======
import { WeatherNotificationProvider } from './context/WeatherNotificationContext.jsx';
import './i18n';
>>>>>>> origin/dev

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
<<<<<<< HEAD
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <MessagesProvider>
            <BookingsProvider>
              <App />
            </BookingsProvider>
          </MessagesProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
=======
      <AuthProvider>
        <MessagesProvider>
          <BookingsProvider>
            <WeatherNotificationProvider>
              <App />
            </WeatherNotificationProvider>
          </BookingsProvider>
        </MessagesProvider>
      </AuthProvider>
>>>>>>> origin/dev
    </BrowserRouter>
  </StrictMode>,
)
