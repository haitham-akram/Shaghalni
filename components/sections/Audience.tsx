import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { GraduationCap, ArrowLeftRight, Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Audience() {
  const t = useTranslations('audience');

  const groups = [
    {
      icon: GraduationCap,
      title: t('gradTitle'),
      desc: t('gradDesc'),
    },
    {
      icon: ArrowLeftRight,
      title: t('switcherTitle'),
      desc: t('switcherDesc'),
    },
    {
      icon: Plane,
      title: t('abroadTitle'),
      desc: t('abroadDesc'),
    },
  ];

  return (
    <Section id="audience" className="bg-surface/50 border-t border-border/60">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
          {t('title')}
        </h2>
        <p className="text-base sm:text-lg text-ink-muted">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((group, idx) => {
          const Icon = group.icon;
          return (
            <Card
              key={idx}
              className="p-8 flex flex-col items-start text-start bg-surface border border-border"
              hover
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent mb-6">
                <Icon className="h-6 w-6 text-accent" />
              </div>

              <h3 className="text-xl font-bold text-ink mb-3">
                {group.title}
              </h3>

              <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                {group.desc}
              </p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
