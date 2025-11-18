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
  const userName = "John Doe";
  const userInitials = userName.split(' ').map(n => n[0]).join('');

  // Determine current section title based on route
  const getSectionTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/batches':
        return 'My Batches';
      case '/partners':
        return 'My Network';
      case '/settings':
        return 'Settings';
      case '/management':
        return 'Management';
      case '/tasks':
        return 'My Tasks';
      default:
        return 'CoffeLedger';
    }
  };

  const currentTitle = getSectionTitle(location.pathname);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm md:ml-64">
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