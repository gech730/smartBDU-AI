import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      if (token) {
        try {
          const res = await authAPI.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.error('Auth init error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, universityId) => {
    const credentials = universityId 
      ? { universityId, password }
      : { email, password };
    
    const res = await authAPI.login(credentials);
    
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('user', JSON.stringify(res.user));
    }
    
    return res;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('user', JSON.stringify(res.user));
    }
    
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = async (data) => {
    const res = await authAPI.updateProfile(data);
    
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('user', JSON.stringify(res.user));
    }
    
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
