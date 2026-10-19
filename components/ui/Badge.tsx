import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'primary' | 'success' | 'danger';
}

const variants = {
  default: 'bg-gray-100 text-ink',
  accent: 'bg-accent/15 text-accent font-semibold',
  primary: 'bg-primary-soft text-primary font-semibold',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
};

export function Badge({ children, className = '', variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}