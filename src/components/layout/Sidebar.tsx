import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Coffee,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Factory,
  Leaf, // Added Leaf icon for Producer
  Warehouse, // Added Warehouse icon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const commonLinks = [
    { label: 'Minha Rede', icon: Users, path: '/partners' },
  ];

  const brandOwnerSpecificLinks = [
    { label: 'Visão Geral', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Meus Lotes', icon: Package, path: '/batches' },
  ];

  const employeePartnerSpecificLinks = [
    { label: 'Minhas Tarefas', icon: ClipboardList, path: '/tasks' },
    { label: 'Meu Perfil Corporativo', icon: Factory, path: '/register-enterprise' },
  ];

  const producerSpecificLinks = [
    { label: 'Minhas Tarefas', icon: ClipboardList, path: '/tasks' },
    { label: 'Meu Perfil Corporativo', icon: Leaf, path: '/register-enterprise' },
  ];

  const warehouseSpecificLinks = [ // New links for warehouse
    { label: 'Minhas Tarefas', icon: ClipboardList, path: '/tasks' },
    { label: 'Meu Perfil Corporativo', icon: Warehouse, path: '/register-enterprise' },
  ];

  const settingsLink = { label: 'Configurações', icon: Settings, path: '/settings' };

  let navigationLinks = [...commonLinks];

  if (user.role === 'brand_owner') {
    navigationLinks = [...brandOwnerSpecificLinks, ...navigationLinks];
  } else if (user.role === 'logistics') {
    navigationLinks = [...navigationLinks, ...employeePartnerSpecificLinks];
  } else if (user.role === 'producer') {
    navigationLinks = [...producerSpecificLinks, ...navigationLinks];
  } else if (user.role === 'warehouse') { // Add warehouse specific links
    navigationLinks = [...warehouseSpecificLinks, ...navigationLinks];
  }

  navigationLinks.push(settingsLink);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar-background transition-all duration-300 ease-in-out",
        {
          "-translate-x-full md:translate-x-0": !isOpen,
        }
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link to="/" className="flex items-center space-x-2 text-sidebar-primary-foreground">
          <Coffee className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">CoffeLedger</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/');
            return (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className={cn(
                    "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-primary/10 text-primary border-r-2 border-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;