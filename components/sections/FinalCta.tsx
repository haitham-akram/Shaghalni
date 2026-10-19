'use client';

import { Container } from '@/components/ui/Container';
import { ChannelButton } from '@/components/ui/ChannelButton';
import { whatsappUrl, telegramUrl } from '@/lib/links';
import { track } from '@/lib/analytics';
import { useTranslations } from 'next-intl';

interface FinalCtaProps {
  locale: 'ar' | 'en';
}

export function FinalCta({ locale }: FinalCtaProps) {
  const t = useTranslations();
  const waUrl = whatsappUrl(locale);
  const tgUrl = telegramUrl(locale);

  return (
    <section className="py-20 md:py-28 bg-primary text-white relative overflow-hidden">
      {/* Subtle decorative circles */}
      <div className="absolute -top-24 -start-24 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -end-24 w-96 h-96 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

      <Container className="relative z-10 text-center max-w-3xl space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.3] [lang=ar]:leading-[1.4] [lang=en]:leading-[1.15]">
            {t('finalCta.title')}
          </h2>
          <p className="text-base sm:text-lg text-primary-soft/90 max-w-xl mx-auto leading-relaxed">
            {t('finalCta.subtitle')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <ChannelButton
            channel="whatsapp"
            size="lg"
            href={waUrl}
            onClick={() => track('cta_whatsapp', { location: 'final', locale })}
            className="w-full sm:w-auto"
          >
            {t('common.startWhatsApp')}
          </ChannelButton>
          <ChannelButton
            channel="telegram"
            size="lg"
            href={tgUrl}
            onClick={() => track('cta_telegram', { location: 'final', locale })}
            className="w-full sm:w-auto"
          >
            {t('common.startTelegram')}
          </ChannelButton>
        </div>

        <p className="text-xs text-primary-soft/75 pt-2">
          {t('common.noAppNeededBadge')}
        </p>
      </Container>
    </section>
  );
}
