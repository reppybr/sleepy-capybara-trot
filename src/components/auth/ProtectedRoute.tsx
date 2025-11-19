import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Define which roles can access which routes
  const routeAccessRules: Record<string, string[]> = {
    '/dashboard': ['brand_owner'],
    '/batches': ['brand_owner'],
    '/batches/:id': ['brand_owner'],
    '/partners': ['brand_owner', 'producer', 'logistics', 'warehouse', 'roaster', 'grader', 'packager', 'distributor', 'end_consumer', 'sustainability', 'beneficiamento'], // Added worker roles here
    '/register-enterprise': ['brand_owner', 'producer', 'logistics', 'warehouse'],
    '/tasks': ['producer', 'logistics', 'warehouse', 'roaster', 'grader', 'packager', 'distributor', 'end_consumer', 'sustainability', 'beneficiamento'],
    '/register-stage/:id': ['producer', 'logistics', 'warehouse', 'roaster', 'grader', 'packager', 'distributor', 'end_consumer', 'sustainability', 'beneficiamento'],
    '/settings': ['brand_owner', 'producer', 'logistics', 'warehouse', 'roaster', 'grader', 'packager', 'distributor', 'end_consumer', 'sustainability', 'beneficiamento'],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3">Carregando...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the current route has access rules
  const currentPath = location.pathname;
  const matchingRoute = Object.keys(routeAccessRules).find(route => {
    // Handle dynamic routes like /batches/:id
    if (route.includes(':')) {
      const routeRegex = new RegExp(`^${route.replace(/:[^\s/]+/g, '[^/]+')}$`);
      return routeRegex.test(currentPath);
    }
    return route === currentPath;
  });

  if (matchingRoute) {
    const allowedRoles = routeAccessRules[matchingRoute];
    if (!allowedRoles.includes(user!.role)) {
      // Redirect to appropriate page based on role
      if (user!.role === 'brand_owner') {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/tasks" replace />;
      }
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;