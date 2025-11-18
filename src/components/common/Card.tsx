import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-700 bg-slate-800 shadow-lg",
        "transition-all duration-300 ease-in-out hover:shadow-xl hover:border-amber-500/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;