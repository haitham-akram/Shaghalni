'use client';

import { useEffect, useCallback, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ChannelButton } from '@/components/ui/ChannelButton';
import { whatsappUrl, telegramUrl } from '@/lib/links';
import { track } from '@/lib/analytics';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'ar' | 'en';
}

export function MobileMenu({ isOpen, onClose, locale }: MobileMenuProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith('#')) {
        e.preventDefault();
        document.body.style.overflow = '';
        onClose();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', href);
        }
      } else {
        document.body.style.overflow = '';
        onClose();
      }
    },
    [onClose]
  );

  if (!isMounted) return null;
  if (!isOpen) return null;

  const navLinks = [
    { href: isHomePage ? '#how' : `/${locale}#how`, label: t('nav.howItWorks') },
    { href: isHomePage ? '#features' : `/${locale}#features`, label: t('nav.features') },
    { href: isHomePage ? '#demo' : `/${locale}#demo`, label: t('nav.demo') },
    { href: isHomePage ? '#audience' : `/${locale}#audience`, label: t('nav.audience') },
    { href: isHomePage ? '#privacy' : `/${locale}#privacy`, label: t('nav.privacy') },
    { href: isHomePage ? '#about' : `/${locale}#about`, label: t('nav.about') },
    { href: isHomePage ? '#faq' : `/${locale}#faq`, label: t('nav.faq') },
    { href: isHomePage ? '#contact' : `/${locale}#contact`, label: t('nav.contact') },
  ];

  const dialogLabel = locale === 'ar' ? 'القائمة الرئيسية' : 'Main menu';
  const closeLabel = locale === 'ar' ? 'إغلاق القائمة' : 'Close menu';

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-night/60 backdrop-blur-sm transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed inset-y-0 start-0 z-50 w-full max-w-[320px] flex flex-col bg-night text-paper border-end border-paper/10 shadow-xl transform transition-transform duration-300 ease-out',
          locale === 'ar'
            ? isOpen
              ? 'translate-x-0'
              : 'translate-x-full'
            : isOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-paper/10 sticky top-0 bg-night/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-night font-extrabold text-lg shrink-0 shadow-sm">
              <span>ش</span>
              <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-amber ring-2 ring-night" />
            </span>
            <span className="text-xl font-extrabold text-paper">{t('common.brandName')}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-paper/20 text-paper hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 transition-all"
            aria-label={closeLabel}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navLinks.map((link, index) => {
            const isAnchor = link.href.startsWith('#');
            const delay = index * 30;
            return (
              <span
                key={link.href}
                style={{ transitionDelay: `${delay}ms` } as React.CSSProperties}
                className="animate-slide-in"
              >
                {isAnchor ? (
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-lg font-medium text-paper hover:bg-primary/10 hover:text-primary transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-night"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-lg font-medium text-paper hover:bg-primary/10 hover:text-primary transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-night"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                    {link.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        {/* CTA Buttons */}
        <div className="border-t border-paper/10 px-4 py-5 space-y-3 animate-fade-in">
          <ChannelButton
            channel="whatsapp"
            href={whatsappUrl(locale)}
            className="w-full justify-center"
            onClick={() => {
              track('cta_whatsapp', { location: 'mobile_menu', locale });
              document.body.style.overflow = '';
              onClose();
            }}
          >
            {t('common.startWhatsApp')}
          </ChannelButton>
          <ChannelButton
            channel="telegram"
            href={telegramUrl(locale)}
            className="w-full justify-center"
            onClick={() => {
              track('cta_telegram', { location: 'mobile_menu', locale });
              document.body.style.overflow = '';
              onClose();
            }}
          >
            {t('common.startTelegram')}
          </ChannelButton>
        </div>

        {/* Language Switcher */}
        <div className="px-4 pb-6 animate-fade-in">
          <LanguageSwitcher locale={locale} variant="menu" isDark />
        </div>
      </div>
    </>
  );
}
