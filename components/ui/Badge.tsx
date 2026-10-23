import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'primary' | 'success' | 'danger';
}

const variants = {
  default: 'bg-night/10 text-night',
  accent: 'bg-amber/15 text-night font-semibold',
  primary: 'bg-primary text-night font-semibold',
  success: 'bg-forest/15 text-forest font-semibold',
  danger: 'bg-amber/20 text-night font-semibold',
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