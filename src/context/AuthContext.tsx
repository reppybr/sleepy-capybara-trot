import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'brand_owner' | 'employee_partner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  public_key: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Initially no user

  const login = (role: UserRole) => {
    if (role === 'brand_owner') {
      setUser({
        id: 'user-brand-owner-1',
        name: 'João Silva',
        email: 'joao.silva@coffeledger.com',
        role: 'brand_owner',
        public_key: '0xbrandownerkey123'
      });
    } else if (role === 'employee_partner') {
      setUser({
        id: 'user-logistics-1',
        name: 'TransCafé Express',
        email: 'ops@transcafe.com.br',
        role: 'employee_partner',
        public_key: 'WORKER-WALLET-456'
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};