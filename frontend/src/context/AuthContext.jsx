import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Fetch watchlist when user logs in
  useEffect(() => {
    if (token) {
      fetchWatchlist();
    }
  }, [token]);

  const fetchWatchlist = async () => {
    if (!token) return;
    try {
      const res = await api.get('/watchlist');
      setWatchlist(res.data.watchList || []);
    } catch {
      // Backend endpoint may not exist yet
    }
  };

  const addToWatchlist = async (symbol) => {
    try {
      await api.post('/watchlist', { symbol });
      setWatchlist((prev) => [...new Set([...prev, symbol])]);
    } catch (err) {
      throw err;
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {
      await api.delete(`/watchlist/${symbol}`);
      setWatchlist((prev) => prev.filter((s) => s !== symbol));
    } catch (err) {
      throw err;
    }
  };

  const isInWatchlist = (symbol) => watchlist.includes(symbol);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: jwt, userData } = res.data;
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return res.data;
  };

  const signup = async (firstName, lastName, email, password) => {
    const res = await api.post('/auth/signup', { firstName, lastName, email, password });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setWatchlist([]);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, watchlist,
      login, signup, logout,
      addToWatchlist, removeFromWatchlist, isInWatchlist, fetchWatchlist,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
