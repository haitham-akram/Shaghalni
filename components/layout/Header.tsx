'use client';

import { useState } from 'react';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { Link, usePathname } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface HeaderProps {
  locale: 'ar' | 'en';
}

export function Header({ locale }: HeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '';

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

  const menuButtonLabel = locale === 'ar' ? 'فتح القائمة' : 'Open menu';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-bg/85 backdrop-blur-md transition-all">
        <Container className="flex h-16 md:h-20 items-center justify-between">
          {/* Start: Logo */}
          <div className="flex items-center gap-6">
            <Logo />
          </div>

          {/* Center/Nav Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-ink-muted">
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith('#');
              if (isAnchor) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="hover:text-primary transition-colors py-1"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-primary transition-colors py-1"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* End Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher locale={locale} />
            <a
              href={isHomePage ? '#hero' : `/${locale}#hero`}
              className="inline-flex items-center justify-center font-semibold rounded-xl transition-colors bg-primary text-white hover:bg-primary-hover h-10 px-5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('common.getStarted')}
            </a>
          </div>

          {/* End Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher locale={locale} />
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl border border-border text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={menuButtonLabel}
              aria-expanded={isMobileOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        locale={locale}
      />
    </>
  );
}
