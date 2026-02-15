import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setAuthToken, userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [otpPending, setOtpPending] = useState(false);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchUserProfile();
    } else {
      setAuthToken(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await userAPI.getProfile();
      setUser(data);
    } catch (err) {
      console.error("Profile fetch error", err);
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
    setOtpPending(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setOtpPending(false);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      otpPending,
      setOtpPending,
      login, 
      logout, 
      fetchUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
