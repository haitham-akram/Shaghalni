'use client';

import { usePathname, Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';
import { track } from '@/lib/analytics';

interface LanguageSwitcherProps {
  locale: 'ar' | 'en';
  className?: string;
  variant?: 'header' | 'menu';
}

export function LanguageSwitcher({ locale, className = '', variant = 'header' }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const targetLocale = locale === 'ar' ? 'en' : 'ar';
  const label = targetLocale === 'ar' ? 'العربية' : 'English';

  const handleClick = () => {
    track('lang_switch', { from: locale, to: targetLocale });
  };

  return (
    <Link
      href={pathname}
      locale={targetLocale}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors',
        'border border-border text-ink bg-surface hover:bg-gray-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        variant === 'menu' && 'w-full justify-center py-3 text-base',
        className
      )}
      lang={targetLocale}
      aria-label={`Switch to ${targetLocale === 'ar' ? 'Arabic' : 'English'}`}
    >
      <Globe className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
      <span lang={targetLocale}>{label}</span>
    </Link>
  );
}