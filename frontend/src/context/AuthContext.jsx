import React, { createContext, useState, useEffect, useContext } from 'react';
 
export const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 
  useEffect(() => {
    // Check local storage for the mock session when app mounts
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
  }, []);
 
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
 
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
 
  const isAdmin = () => {
    return user?.role === 'admin';
  };
 
  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
 
// ── useAuth hook ──────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};