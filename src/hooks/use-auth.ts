export interface User {
  id: string;
  name: string;
  email: string;
  role: 'brand_owner' | 'employee_partner';
  public_key: string;
}

export const useAuth = () => {
  // Mock brand owner data
  const user: User = {
    id: 'user-brand-owner-1',
    name: 'João Silva',
    email: 'joao.silva@coffeledger.com',
    role: 'brand_owner',
    public_key: '0xbrandownerkey123'
  };
  return {
    user,
    isAuthenticated: true,
  };
};