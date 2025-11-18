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
  Factory, // Example for brand_owner
  ClipboardList, // Example for partner tasks
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  // Mock user role for demonstration
  const userRole = 'producer'; // Can be 'producer', 'brand_owner', 'logistics', etc.

  const commonLinks = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'My Batches', icon: Package, path: '/batches' },
    { label: 'My Network', icon: Users, path: '/partners' },
  ];

  const producerLinks = [
    // Specific links for producers
  ];

  const brandOwnerLinks = [
    { label: 'Management', icon: Factory, path: '/management' },
  ];

  const partnerLinks = [ // For roles like producer, logistics, etc.
    { label: 'My Tasks', icon: ClipboardList, path: '/tasks' },
  ];

  const settingsLink = { label: 'Settings', icon: Settings, path: '/settings' };

  let navigationLinks = [...commonLinks];

  if (userRole === 'brand_owner') {
    navigationLinks = [...navigationLinks, ...brandOwnerLinks];
  } else if (['producer', 'logistics'].includes(userRole)) { // Example partners
    navigationLinks = [...navigationLinks, ...partnerLinks, ...producerLinks];
  }

  navigationLinks.push(settingsLink); // Settings is always available

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
            const isActive = location.pathname === link.path;
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