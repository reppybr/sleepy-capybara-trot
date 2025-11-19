import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'brand_owner' | 'employee_partner' | 'producer' | 'warehouse'; // Added 'warehouse'

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
  isLoading: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (role: UserRole) => {
    let newUser: User | null = null;
    if (role === 'brand_owner') {
      newUser = {
        id: 'user-brand-owner-1',
        name: 'João Silva',
        email: 'joao.silva@coffeledger.com',
        role: 'brand_owner',
        public_key: '0xbrandownerkey123'
      };
    } else if (role === 'employee_partner') {
      newUser = {
        id: 'user-logistics-demo-1',
        name: 'TransCafé Express',
        email: 'ops@transcafe.com.br',
        role: 'logistics',
        public_key: 'WORKER-WALLET-456'
      };
    } else if (role === 'producer') {
      newUser = {
        id: 'user-producer-demo-1',
        name: 'Fazenda Esperança',
        email: 'contato@esperanca.com',
        role: 'producer',
        public_key: '0xesperancakey123'
      };
    } else if (role === 'warehouse') { // New warehouse login option
      newUser = {
        id: 'user-warehouse-demo-1',
        name: 'Armazém Central',
        email: 'contato@armazemcentral.com',
        role: 'warehouse',
        public_key: '0xwarehousekey123'
      };
    }
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
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