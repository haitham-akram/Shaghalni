import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { ChannelButton } from '@/components/ui/ChannelButton';
import { ContactForm } from '@/components/contact/ContactForm';
import { whatsappUrl, telegramUrl } from '@/lib/links';
import { constructMetadata } from '@/lib/seo';
import { Mail, Clock, MessageSquareQuote } from 'lucide-react';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'seo' });

  return constructMetadata({
    locale,
    path: '/contact',
    title: t('contactTitle'),
    description: t('contactDescription'),
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact' });
  const common = await getTranslations({ locale, namespace: 'common' });

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@shaghalni.example';
  const waUrl = whatsappUrl(locale);
  const tgUrl = telegramUrl(locale);

  return (
    <div className="py-12 md:py-20">
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink">
            {t('pageTitle')}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            {t('pageSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <ContactForm contactEmail={contactEmail} />
          </div>

          {/* Direct Channels Column */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6 bg-surface border border-border">
              <div className="space-y-1 text-start">
                <h2 className="text-xl font-bold text-ink">
                  {t('channelsTitle')}
                </h2>
                <p className="text-sm text-ink-muted">
                  {t('channelsSubtitle')}
                </p>
              </div>

              <div className="space-y-3">
                <ChannelButton
                  channel="whatsapp"
                  size="md"
                  href={waUrl}
                  className="w-full justify-start"
                >
                  {common('startWhatsApp')}
                </ChannelButton>
                <ChannelButton
                  channel="telegram"
                  size="md"
                  href={tgUrl}
                  className="w-full justify-start"
                >
                  {common('startTelegram')}
                </ChannelButton>
              </div>

              <div className="pt-4 border-t border-border space-y-3 text-start">
                <div className="flex items-center gap-3 text-sm text-ink">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-night shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-ink-muted">{t('emailLabel')}</p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="font-medium text-forest hover:underline"
                      dir="ltr"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-ink">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber/15 text-night shrink-0">
                    <Clock className="h-4 w-4 text-forest" />
                  </div>
                  <div>
                    <p className="text-xs text-ink-muted">
                      {t('responseTimeNote')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Note card */}
            <div className="p-6 rounded-2xl bg-surface border border-border text-start space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-forest font-semibold text-sm">
                <MessageSquareQuote className="h-4 w-4" />
                <span>{common('brandName')}</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                {common('brandTagline')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
