import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'IN_TRANSIT' | 'PROCESSING' | 'FINALIZED' | 'CREATED' | 'BLOCKED' | 'PENDING';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  let badgeClasses = '';
  let label = '';

  switch (status) {
    case 'IN_TRANSIT':
      label = 'Em Trânsito';
      badgeClasses = 'bg-blue-500/20 text-blue-400 border-blue-500/20 animate-pulse';
      break;
    case 'PROCESSING':
      label = 'Em Processamento';
      badgeClasses = 'bg-amber-500/20 text-amber-400 border-amber-500/20 animate-pulse';
      break;
    case 'FINALIZED':
      label = 'Finalizado';
      badgeClasses = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      break;
    case 'CREATED':
      label = 'Criado';
      badgeClasses = 'bg-slate-500/20 text-slate-400 border-slate-500/20';
      break;
    case 'BLOCKED':
      label = 'Bloqueado';
      badgeClasses = 'bg-red-500/20 text-red-400 border-red-500/20 animate-pulse';
      break;
    case 'PENDING':
      label = 'Pendente';
      badgeClasses = 'bg-purple-500/20 text-purple-400 border-purple-500/20 animate-pulse';
      break;
    default:
      label = 'Desconhecido';
      badgeClasses = 'bg-muted/20 text-muted-foreground border-muted/20';
  }

  return (
    <span className={cn("px-3 py-1 rounded-full text-sm font-semibold border", badgeClasses, className)}>
      {label}
    </span>
  );
};

export default StatusBadge;