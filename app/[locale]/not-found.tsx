import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { ChannelButton } from '@/components/ui/ChannelButton';
import { whatsappUrl, telegramUrl } from '@/lib/links';
import { Home } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('notFound');
  const common = useTranslations('common');
  const locale = useLocale() as 'ar' | 'en';

  const waUrl = whatsappUrl(locale);
  const tgUrl = telegramUrl(locale);

  return (
    <div className="py-20 md:py-32 flex items-center justify-center text-center">
      <Container className="max-w-md space-y-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-soft text-primary font-bold text-3xl mx-auto shadow-sm">
          404
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">
            {t('title')}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="pt-2 flex flex-col items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors bg-primary text-night hover:bg-primary-hover h-12 px-6 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
          >
            <Home className="h-5 w-5" />
            <span>{t('homeButton')}</span>
          </Link>

          <p className="text-xs text-ink-muted pt-4">
            {t('orChat')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <ChannelButton
              channel="whatsapp"
              size="md"
              href={waUrl}
            >
              {common('startWhatsApp')}
            </ChannelButton>
            <ChannelButton
              channel="telegram"
              size="md"
              href={tgUrl}
            >
              {common('startTelegram')}
            </ChannelButton>
          </div>
        </div>
      </Container>
    </div>
  );
}
