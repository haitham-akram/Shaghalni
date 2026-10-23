'use client';

import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { Link, usePathname } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: 'ar' | 'en';
}

export function Header({ locale }: HeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '';

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const isDarkHeader = isHomePage && !isScrolled;

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
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-colors duration-200',
          isDarkHeader
            ? 'bg-night text-paper border-b border-paper/10'
            : 'bg-bg/95 backdrop-blur-md text-ink border-b border-border/80 shadow-xs'
        )}
      >
        <Container className="flex h-16 md:h-20 items-center justify-between">
          {/* Start: Logo */}
          <div className="flex items-center gap-6">
            <Logo isDark={isDarkHeader} />
          </div>

          {/* Center/Nav Desktop */}
          <nav
            className={cn(
              'hidden lg:flex items-center gap-6 text-sm font-semibold',
              isDarkHeader ? 'text-paper/85' : 'text-ink-muted'
            )}
          >
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith('#');
              const linkClasses = isDarkHeader
                ? 'hover:text-primary transition-colors py-1'
                : 'hover:text-forest transition-colors py-1';
              if (isAnchor) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={linkClasses}
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClasses}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* End Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher locale={locale} isDark={isDarkHeader} />
            <a
              href={isHomePage ? '#hero' : `/${locale}#hero`}
              className="inline-flex items-center justify-center font-semibold rounded-xl transition-colors bg-primary text-night hover:bg-primary-hover h-10 px-5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('common.getStarted')}
            </a>
          </div>

          {/* End Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher locale={locale} isDark={isDarkHeader} />
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className={cn(
                'p-2 rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors',
                isDarkHeader
                  ? 'border-paper/20 text-paper hover:bg-white/10'
                  : 'border-border text-ink hover:bg-surface'
              )}
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
