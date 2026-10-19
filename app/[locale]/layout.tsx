import type { Metadata, Viewport } from 'next';
import { arabicFont, latinFont } from '@/lib/fonts';
import '@/app/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyCtaBar } from '@/components/layout/StickyCtaBar';
import { routing } from '@/i18n/routing';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#5E56FA',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://shaghalni.example'),
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${arabicFont.variable} ${latinFont.variable}`}
    >
      <head>
        {plausibleDomain && (
          <script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-ink selection:bg-primary-soft selection:text-primary">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main-content" className="skip-link">
            {locale === 'ar' ? 'تخطَّ إلى المحتوى' : 'Skip to content'}
          </a>

          <Header locale={locale} />

          <main id="main-content" className="flex-1 focus:outline-none">
            {children}
          </main>

          <Footer locale={locale} />
          <StickyCtaBar locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}