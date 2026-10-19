import { ReactNode } from 'react';
import { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  ariaLabel?: string;
}

export function Section({ children, id, className = '', ariaLabel }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`py-16 md:py-24 ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}