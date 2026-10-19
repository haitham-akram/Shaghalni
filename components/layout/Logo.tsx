import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

export function Logo({ className = '', isDark = false }: LogoProps) {
  const t = useTranslations('common');
  const brandName = t('brandName');

  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-1 text-2xl font-bold tracking-normal',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg',
        isDark ? 'text-white' : 'text-ink',
        className
      )}
      aria-label={`${brandName} — ${t('brandTagline')}`}
    >
      <span className="font-bold">{brandName}</span>
      <span className="h-2 w-2 rounded-full bg-accent inline-block transition-transform duration-200 group-hover:scale-125" />
    </Link>
  );
}
