import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shaghalni.example';

export const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

export function getBaseUrl(): string {
  return SITE_URL.replace(/\/$/, '');
}

export function constructMetadata({
  locale,
  path = '',
  title,
  description,
}: {
  locale: 'ar' | 'en';
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const baseUrl = getBaseUrl();
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const canonicalUrl = `${baseUrl}/${locale}${normalizedPath}`;
  const arUrl = `${baseUrl}/ar${normalizedPath}`;
  const enUrl = `${baseUrl}/en${normalizedPath}`;

  const siteName = locale === 'ar' ? 'شغلني' : 'Shaghalni';

  return {
    title: {
      default: title,
      template: locale === 'ar' ? `%s | شغلني` : `%s | Shaghalni`,
    },
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: arUrl,
        en: enUrl,
        'x-default': arUrl,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_AR' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_AR'],
      siteName,
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: isProduction
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
        },
  };
}

export function generateOrganizationSchema(locale: 'ar' | 'en') {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: locale === 'ar' ? 'شغلني' : 'Shaghalni',
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@shaghalni.example',
      contactType: 'customer support',
      availableLanguage: ['Arabic', 'English'],
    },
  };
}

export function generateWebSiteSchema(locale: 'ar' | 'en') {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'ar' ? 'شغلني' : 'Shaghalni',
    url: baseUrl,
    inLanguage: locale === 'ar' ? 'ar' : 'en',
  };
}

export function generateSoftwareApplicationSchema(locale: 'ar' | 'en') {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: locale === 'ar' ? 'شغلني' : 'Shaghalni',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'WhatsApp, Telegram, Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      locale === 'ar'
        ? 'مساعد ذكي داخل واتساب وتيليجرام يساعدك على تجهيز السيرة الذاتية ورسائل التقديم للوظائف'
        : 'AI assistant inside WhatsApp and Telegram that helps you prepare your CV and job applications',
    url: baseUrl,
  };
}

export function generateFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
