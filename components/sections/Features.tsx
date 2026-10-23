import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import {
  FileText,
  Mail,
  Search,
  MessagesSquare,
  Languages,
  Smartphone,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Features() {
  const t = useTranslations('features');

  const featuresList = [
    {
      icon: FileText,
      title: t('item1Title'),
      desc: t('item1Desc'),
    },
    {
      icon: Mail,
      title: t('item2Title'),
      desc: t('item2Desc'),
    },
    {
      icon: Search,
      title: t('item3Title'),
      desc: t('item3Desc'),
    },
    {
      icon: MessagesSquare,
      title: t('item4Title'),
      desc: t('item4Desc'),
    },
    {
      icon: Languages,
      title: t('item5Title'),
      desc: t('item5Desc'),
    },
    {
      icon: Smartphone,
      title: t('item6Title'),
      desc: t('item6Desc'),
    },
  ];

  return (
    <Section id="features" className="bg-bg border-t border-border/60">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
          {t('title')}
        </h2>
        <p className="text-base sm:text-lg text-ink-muted">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresList.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <Card
              key={idx}
              className="p-6 sm:p-8 flex flex-col items-start text-start bg-surface border border-border"
              hover
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-night mb-5">
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-ink mb-2">
                {feature.title}
              </h3>

              <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                {feature.desc}
              </p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
