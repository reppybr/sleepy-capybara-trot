import React from 'react';
import { Badge as ShadcnBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'concluido' | 'emandamento' | 'criado' | 'bloqueado' | 'default';
}

const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const variantClasses = {
    concluido: "bg-green-600 text-white hover:bg-green-700",
    emandamento: "bg-amber-500 text-black hover:bg-amber-600",
    criado: "bg-blue-600 text-white hover:bg-blue-700",
    bloqueado: "bg-red-600 text-white hover:bg-red-700",
    default: "bg-muted text-muted-foreground hover:bg-muted/80",
  };

  return (
    <ShadcnBadge className={cn(variantClasses[variant], className)} {...props} />
  );
};

export default Badge;