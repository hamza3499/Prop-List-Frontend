import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('proplist_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@proplist.com' && credentials.password === 'password123') {
          const userData = { id: 1, name: 'Admin User', email: credentials.email };
          setUser(userData);
          localStorage.setItem('proplist_user', JSON.stringify(userData));
          localStorage.setItem('proplist_token', 'mock_token_12345');
          resolve(userData);
        } else if (credentials.email && credentials.password) {
           // Basic success for any credentials to allow exploration
           const userData = { id: Date.now(), name: credentials.name || 'New User', email: credentials.email };
           setUser(userData);
           localStorage.setItem('proplist_user', JSON.stringify(userData));
           localStorage.setItem('proplist_token', 'mock_token_' + Date.now());
           resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('proplist_user');
    localStorage.removeItem('proplist_token');
  };

  const signup = async (data) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = { id: Date.now(), name: data.name, email: data.email };
        setUser(userData);
        localStorage.setItem('proplist_user', JSON.stringify(userData));
        localStorage.setItem('proplist_token', 'mock_token_' + Date.now());
        resolve(userData);
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
