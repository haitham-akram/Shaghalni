import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Features } from '@/components/sections/Features';
import { Demo } from '@/components/sections/Demo';
import { Audience } from '@/components/sections/Audience';
import { Privacy } from '@/components/sections/Privacy';
import { About } from '@/components/sections/About';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { FinalCta } from '@/components/sections/FinalCta';
import {
  constructMetadata,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateSoftwareApplicationSchema,
} from '@/lib/seo';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'seo' });

  return constructMetadata({
    locale,
    path: '',
    title: t('homeTitle'),
    description: t('homeDescription'),
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  setRequestLocale(locale);

  const orgSchema = generateOrganizationSchema(locale);
  const webSiteSchema = generateWebSiteSchema(locale);
  const appSchema = generateSoftwareApplicationSchema(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <Hero locale={locale} />
      <HowItWorks />
      <Features />
      <Demo locale={locale} />
      <Audience />
      <Privacy />
      <About locale={locale} />
      <Faq />
      <Contact locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
