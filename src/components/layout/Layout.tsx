import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { MadeWithDyad } from '@/components/made-with-dyad'; // Ensure correct import path

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 flex-col md:ml-64"> {/* Adjust margin for desktop sidebar */}
        <Header onMenuToggle={toggleSidebar} />
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Layout;