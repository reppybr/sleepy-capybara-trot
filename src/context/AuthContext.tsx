import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  isLoading: boolean; // New loading state
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true, as we're loading from localStorage

  useEffect(() => {
    // Load user from localStorage on initial mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
    setIsLoading(false); // Finished loading
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
        id: 'user-logistics-1',
        name: 'TransCafé Express',
        email: 'ops@transcafe.com.br',
        role: 'employee_partner',
        public_key: 'WORKER-WALLET-456'
      };
    }
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser)); // Persist user
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear user from persistence
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