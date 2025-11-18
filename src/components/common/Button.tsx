import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}) => {
  const baseClasses = "transition-all active:scale-95 duration-200 ease-in-out";

  const variantClasses = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground font-bold hover:from-amber-600 hover:to-amber-700", // Changed text-black to text-primary-foreground
    secondary: "border border-slate-600 text-slate-300 bg-transparent hover:bg-slate-700 hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "hover:bg-slate-700 hover:text-white", // Default shadcn ghost
    default: "bg-primary text-primary-foreground hover:bg-primary/90", // Default shadcn primary
  };

  return (
    <ShadcnButton
      className={cn(baseClasses, variantClasses[variant], className)}
      size={size}
      asChild={asChild}
      {...props}
    />
  );
};

export default Button;