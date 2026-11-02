'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export function AccordionItem({
  id,
  title,
  children,
  defaultOpen = false,
  onToggle,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    onToggle?.(nextState);
  };

  return (
    <details
      open={isOpen}
      className="group border border-border rounded-xl bg-surface overflow-hidden transition-colors"
    >
      <summary
        className={cn(
          'flex items-center justify-between w-full px-6 py-4 text-start',
          'list-none cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-surface'
        )}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        onClick={(e) => {
          e.preventDefault();
          handleToggle();
        }}
      >
        <span className="text-base sm:text-lg font-semibold text-ink pe-4 leading-snug">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-ink-muted flex-shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </summary>
      <div
        id={`${id}-content`}
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 pb-6 text-ink-muted text-sm sm:text-base leading-relaxed">
          {children}
        </div>
      </div>
    </details>
  );
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className = '' }: AccordionProps) {
  return <div className={cn('space-y-3', className)}>{children}</div>;
}