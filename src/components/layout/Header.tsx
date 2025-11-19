import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user data
  const userName = "João Silva";
  const userInitials = userName.split(' ').map(n => n[0]).join('');

  // Determine current section title based on route
  const getSectionTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Visão Geral';
      case '/batches':
        return 'Meus Lotes';
      case '/partners':
        return 'Minha Rede de Parceiros';
      case '/settings':
        return 'Configurações';
      case '/management':
        return 'Gerenciamento';
      case '/tasks':
        return 'Minhas Tarefas';
      default:
        return 'CoffeLedger';
    }
  };

  const currentTitle = getSectionTitle(location.pathname);

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-background p-4 sm:p-6 lg:p-8 shadow-sm">
      <div className="flex items-center">
        {location.pathname !== '/' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="mr-4 md:hidden text-foreground hover:bg-muted"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <h1 
          className={`text-xl font-semibold text-foreground ${location.pathname !== '/' ? 'cursor-pointer hover:text-primary' : ''}`}
          onClick={handleLogoClick}
        >
          {currentTitle}
        </h1>
      </div>
      {location.pathname !== '/' && (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground hidden sm:block">{userName}</span>
        </div>
      )}
    </header>
  );
};

export default Header;