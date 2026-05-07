import { createContext, useState, useEffect, useContext } from 'react';
 
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
 
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
 
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
 
  // Restore session on page load
  useEffect(() => {
    const token = localStorage.getItem('cbt_token');
    const saved = localStorage.getItem('cbt_user');
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch { _clearSession(); }
    }
    setLoading(false);
  }, []);
 
  const _saveSession = (token, userData) => {
    localStorage.setItem('cbt_token', token);
    localStorage.setItem('cbt_user', JSON.stringify(userData));
    setUser(userData);
  };
 
  const _clearSession = () => {
    localStorage.removeItem('cbt_token');
    localStorage.removeItem('cbt_user');
    setUser(null);
  };
 
  // ── login(email, password, role?) ─────────────────────────────────────────
  const login = async (email, password, role = 'customer') => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed.');
    _saveSession(data.token, data.user);
    return data.user;
  };
 
  // ── register(name, email, password) ───────────────────────────────────────
  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed.');
    _saveSession(data.token, data.user);
    return data.user;
  };
 
  const logout = () => _clearSession();
 
  const getToken = () => localStorage.getItem('cbt_token');
 
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}