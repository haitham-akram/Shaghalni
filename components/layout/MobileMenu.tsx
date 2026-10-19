'use client';

import { useEffect, useCallback } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ChannelButton } from '@/components/ui/ChannelButton';
import { whatsappUrl, telegramUrl } from '@/lib/links';
import { track } from '@/lib/analytics';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'ar' | 'en';
}

export function MobileMenu({ isOpen, onClose, locale }: MobileMenuProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '';

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
    <div
      className="fixed inset-0 z-50 flex flex-col bg-bg/98 backdrop-blur-md px-6 py-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
    >
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <span className="text-xl font-bold text-ink">{t('common.brandName')}</span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl border border-border text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={closeLabel}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex flex-col py-6 space-y-4 flex-1">
        {navLinks.map((link) => {
          const isAnchor = link.href.startsWith('#');
          if (isAnchor) {
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-lg font-medium text-ink hover:text-primary transition-colors py-2"
              >
                {link.label}
              </a>
            );
          }
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-lg font-medium text-ink hover:text-primary transition-colors py-2"
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-border space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <ChannelButton
            channel="whatsapp"
            href={whatsappUrl(locale)}
            onClick={() => {
              track('cta_whatsapp', { location: 'hero', locale });
              document.body.style.overflow = '';
              onClose();
            }}
          >
            {t('common.startWhatsApp')}
          </ChannelButton>
          <ChannelButton
            channel="telegram"
            href={telegramUrl(locale)}
            onClick={() => {
              track('cta_telegram', { location: 'hero', locale });
              document.body.style.overflow = '';
              onClose();
            }}
          >
            {t('common.startTelegram')}
          </ChannelButton>
        </div>

        <LanguageSwitcher locale={locale} variant="menu" />
      </div>
    </div>
  );
}
