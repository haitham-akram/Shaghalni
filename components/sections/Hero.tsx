'use client';

import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ChannelButton } from '@/components/ui/ChannelButton';
import { ChatScript } from '@/components/chat/ChatScript';
import { whatsappUrl, telegramUrl } from '@/lib/links';
import { track } from '@/lib/analytics';
import { Lock, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslations } from 'next-intl';

interface HeroProps {
  locale: 'ar' | 'en';
}

export function Hero({ locale }: HeroProps) {
  const t = useTranslations();
  const waUrl = whatsappUrl(locale);
  const tgUrl = telegramUrl(locale);

  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Subtle decorative background gradient */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center">
        <div className="w-[800px] h-[500px] bg-primary-soft/40 blur-3xl rounded-full opacity-60 translate-y-[-20%]" />
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Start column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-start space-y-6">
            <Badge variant="primary" className="px-3.5 py-1 text-xs md:text-sm">
              {t('hero.badge')}
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.3] [lang=ar]:leading-[1.35] [lang=en]:leading-[1.1]">
              {t('hero.title')}
            </h1>

            <p className="text-base sm:text-lg text-ink-muted max-w-prose leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <ChannelButton
                channel="whatsapp"
                size="lg"
                href={waUrl}
                onClick={() => track('cta_whatsapp', { location: 'hero', locale })}
              >
                {t('common.startWhatsApp')}
              </ChannelButton>
              <ChannelButton
                channel="telegram"
                size="lg"
                href={tgUrl}
                onClick={() => track('cta_telegram', { location: 'hero', locale })}
              >
                {t('common.startTelegram')}
              </ChannelButton>
            </div>

            {/* Trigger point for mobile sticky CTA bar */}
            <div id="hero-cta-trigger" className="h-1 w-full pointer-events-none" />

            {/* Reassurance line */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-ink-muted pt-1">
              <Lock className="h-4 w-4 text-accent shrink-0" />
              <span>{t('hero.reassurance')}</span>
            </div>

            {/* Desktop QR code card */}
            <div className="hidden md:flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border shadow-sm mt-4">
              <div className="p-2 bg-white rounded-xl border border-border shrink-0">
                <QRCodeSVG value={waUrl} size={64} level="M" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-semibold text-ink flex items-center gap-1.5">
                  <QrCode className="h-4 w-4 text-primary" />
                  {t('common.scanQrCode')}
                </p>
                <p className="text-ink-muted">
                  {t('hero.qrText')}
                </p>
              </div>
            </div>
          </div>

          {/* End column: Interactive Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <ChatScript locale={locale} showReplayButton={false} />
          </div>
        </div>
      </Container>
    </section>
  );
}
