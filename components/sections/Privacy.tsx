import { Section } from '@/components/ui/Section';
import { ShieldCheck, UserCheck, Trash2, Lock, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function Privacy() {
  const t = useTranslations('privacySection');

  const points = [
    {
      icon: UserCheck,
      title: t('point1Title'),
      desc: t('point1Desc'),
    },
    {
      icon: ShieldCheck,
      title: t('point2Title'),
      desc: t('point2Desc'),
    },
    {
      icon: Trash2,
      title: t('point3Title'),
      desc: t('point3Desc'),
    },
    {
      icon: Lock,
      title: t('point4Title'),
      desc: t('point4Desc'),
    },
  ];

  return (
    <Section id="privacy" className="bg-bg border-t border-border/60">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
          {t('title')}
        </h2>
        <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
          {t('intro')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {points.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-[0_8px_24px_rgba(14,42,43,0.08)] flex items-start gap-5 text-start"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-night">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-ink">
                  {pt.title}
                </h3>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Link
          href="/privacy"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface hover:bg-paper/80 text-ink font-semibold text-sm transition-colors border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
        >
          <span>{t('ctaButton')}</span>
          <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
        </Link>
      </div>
    </Section>
  );
}
