import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const location = useLocation();

  // Mock user data
  const userName = "João Silva"; // Changed to Portuguese name
  const userInitials = userName.split(' ').map(n => n[0]).join('');

  // Determine current section title based on route
  const getSectionTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return 'Visão Geral'; // Changed to Portuguese
      case '/batches':
        return 'Meus Lotes'; // Changed to Portuguese
      case '/partners':
        return 'Minha Rede de Parceiros'; // Changed to Portuguese
      case '/settings':
        return 'Configurações'; // Changed to Portuguese
      case '/management':
        return 'Gerenciamento'; // Changed to Portuguese
      case '/tasks':
        return 'Minhas Tarefas'; // Changed to Portuguese
      default:
        return 'CoffeLedger';
    }
  };

  const currentTitle = getSectionTitle(location.pathname);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-background p-4 sm:p-6 lg:p-8 shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="mr-4 md:hidden text-foreground hover:bg-muted"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{currentTitle}</h1>
      </div>
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground hidden sm:block">{userName}</span>
      </div>
    </header>
  );
};

export default Header;