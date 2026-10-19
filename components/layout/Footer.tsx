import { Logo } from './Logo';
import { Container } from '@/components/ui/Container';
import { ChannelButton } from '@/components/ui/ChannelButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Link } from '@/i18n/navigation';
import { whatsappUrl, telegramUrl } from '@/lib/links';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: 'ar' | 'en';
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-night text-white pt-16 pb-24 md:pb-16 border-t border-white/10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Logo & description */}
          <div className="md:col-span-5 space-y-4">
            <Logo isDark />
            <p className="text-gray-300 text-sm max-w-sm leading-relaxed">
              {t('common.brandTagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider">
              {t('nav.about')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t('nav.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t('nav.terms')}
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Channel buttons & Switcher */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-200">
              {t('finalCta.title')}
            </h3>
            <div className="flex flex-wrap gap-3">
              <ChannelButton
                channel="whatsapp"
                size="sm"
                href={whatsappUrl(locale)}
              >
                {t('common.startWhatsApp')}
              </ChannelButton>
              <ChannelButton
                channel="telegram"
                size="sm"
                href={telegramUrl(locale)}
              >
                {t('common.startTelegram')}
              </ChannelButton>
            </div>
            <div>
              <LanguageSwitcher locale={locale} className="bg-night text-white border-white/20 hover:bg-white/10" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>{t('common.copyright', { year: currentYear })}</p>
          <p className="text-gray-400">
            {t('common.noAppNeededBadge')}
          </p>
        </div>
      </Container>
    </footer>
  );
}
