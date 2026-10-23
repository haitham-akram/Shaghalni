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
        'group inline-flex items-center gap-2 text-2xl font-extrabold tracking-normal',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 rounded-lg',
        isDark ? 'text-paper focus-visible:ring-primary' : 'text-ink',
        className
      )}
      aria-label={`${brandName} — ${t('brandTagline')}`}
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-night font-extrabold text-lg shadow-sm shrink-0">
        <span>ش</span>
        <span className={cn('absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-amber ring-2 group-hover:scale-125 transition-transform', isDark ? 'ring-night' : 'ring-surface')} />
      </span>
      <span className="font-extrabold">{brandName}</span>
    </Link>
  );
}
