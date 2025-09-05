import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Check government credentials
    if (email === USERS.government.email && password === USERS.government.password) {
      setUser({
        email,
        role: 'government'
      });
      return true;
    }
    
    // Check municipal credentials
    if (email === USERS.municipal.email && password === USERS.municipal.password) {
      setUser({
        email,
        role: 'municipal',
        city: USERS.municipal.city
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};