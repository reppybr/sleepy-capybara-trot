import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  className,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn("sm:max-w-[425px] bg-slate-800 border-slate-700 backdrop-blur-sm", className)}>
        <DialogHeader>
          <DialogTitle className="text-primary-foreground">{title}</DialogTitle>
          {description && <DialogDescription className="text-muted-foreground">{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;