'use client';

import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { ChannelButton } from '@/components/ui/ChannelButton';
import { whatsappUrl, telegramUrl } from '@/lib/links';
import { track } from '@/lib/analytics';
import { useTranslations } from 'next-intl';

interface StickyCtaBarProps {
  locale: 'ar' | 'en';
}

export function StickyCtaBar({ locale }: StickyCtaBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isContact = pathname.includes('/contact');
  const t = useTranslations('common');

  useEffect(() => {
    if (isContact) return;

    const trigger = document.getElementById('hero-cta-trigger');
    if (!trigger) {
      // Fallback: show after 400px scroll
      const handleScroll = () => {
        setIsVisible(window.scrollY > 400);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If trigger is NOT intersecting and is above the viewport, show sticky bar
        setIsVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [isContact]);

  if (!isVisible || isContact) {
    return null;
  }

  return (
    <div
      className="md:hidden fixed bottom-0 start-0 end-0 z-30 bg-surface/95 backdrop-blur-md border-t border-border px-4 py-3 shadow-lg transition-transform duration-300 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
      role="region"
      aria-label={locale === 'ar' ? 'روابط سريعة للمحادثة' : 'Quick chat channels'}
    >
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <ChannelButton
          channel="whatsapp"
          size="sm"
          href={whatsappUrl(locale)}
          onClick={() => track('cta_whatsapp', { location: 'sticky', locale })}
          className="w-full text-xs"
        >
          {t('startWhatsApp')}
        </ChannelButton>
        <ChannelButton
          channel="telegram"
          size="sm"
          href={telegramUrl(locale)}
          onClick={() => track('cta_telegram', { location: 'sticky', locale })}
          className="w-full text-xs"
        >
          {t('startTelegram')}
        </ChannelButton>
      </div>
    </div>
  );
}
