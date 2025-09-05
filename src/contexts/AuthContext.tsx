import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User;
  toggleRole: () => void;
  setRole: (role: 'government' | 'municipal') => void;
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
  const [user, setUser] = useState<User>({
    email: 'demo@civic.com',
    role: 'municipal',
    city: 'Pune'
  });

  const toggleRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev.role === 'government' ? 'municipal' : 'government',
      city: prev.role === 'government' ? 'Pune' : undefined
    }));
  };

  const setRole = (role: 'government' | 'municipal') => {
    setUser(prev => ({
      ...prev,
      role,
      city: role === 'municipal' ? 'Pune' : undefined
    }));
  };

  const value = {
    user,
    toggleRole,
    setRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};