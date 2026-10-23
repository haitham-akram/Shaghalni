import { Section } from '@/components/ui/Section';
import { ChatScript } from '@/components/chat/ChatScript';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DemoProps {
  locale: 'ar' | 'en';
}

export function Demo({ locale }: DemoProps) {
  const t = useTranslations('demo');

  const bullets = [
    {
      title: t('point1Title'),
      desc: t('point1Desc'),
    },
    {
      title: t('point2Title'),
      desc: t('point2Desc'),
    },
    {
      title: t('point3Title'),
      desc: t('point3Desc'),
    },
  ];

  return (
    <Section id="demo" className="bg-night text-paper border-t border-paper/10">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-paper">
          {t('title')}
        </h2>
        <p className="text-base sm:text-lg text-paper/80">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Phone demo column */}
        <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
          <ChatScript locale={locale} showReplayButton={true} />
        </div>

        {/* Bullet explanation column */}
        <div className="lg:col-span-6 space-y-8 order-1 lg:order-2 text-start">
          <div className="space-y-6">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-paper/10 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary font-bold">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-paper">
                    {bullet.title}
                  </h3>
                  <p className="text-sm sm:text-base text-paper/70 leading-relaxed">
                    {bullet.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
