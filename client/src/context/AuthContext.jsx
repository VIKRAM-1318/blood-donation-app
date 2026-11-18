import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        setUser(res.data.data || res.data.user || res.data);
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  // Axios interceptor for Authorization header
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    const data = res.data;
    const newToken = data.token;
    const newUser = data.data || data.user || data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authService.register(userData);
    const data = res.data;
    const newToken = data.token;
    const newUser = data.data || data.user || data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
