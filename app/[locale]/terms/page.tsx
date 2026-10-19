import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { constructMetadata } from '@/lib/seo';
import { FileText, AlertTriangle } from 'lucide-react';

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TermsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'seo' });

  return constructMetadata({
    locale,
    path: '/terms',
    title: t('termsTitle'),
    description: t('termsDescription'),
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'termsPage' });

  const sections = [
    { title: t('sec1Title'), content: t('sec1Content') },
    { title: t('sec2Title'), content: t('sec2Content') },
    { title: t('sec3Title'), content: t('sec3Content') },
    { title: t('sec4Title'), content: t('sec4Content') },
  ];

  return (
    <div className="py-12 md:py-20">
      <Container>
        <article className="max-w-3xl mx-auto space-y-10 text-start">
          <header className="space-y-4 pb-8 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-ink">
                  {t('title')}
                </h1>
                <p className="text-sm text-ink-muted mt-1">{t('lastUpdated')}</p>
              </div>
            </div>

            {/* Legal draft notice badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{t('draftNotice')}</span>
            </div>
          </header>

          <div className="space-y-8">
            {sections.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-xl font-bold text-ink">{sec.title}</h2>
                <p className="text-base text-ink-muted leading-relaxed">
                  {sec.content}
                </p>
              </section>
            ))}
          </div>
        </article>
      </Container>
    </div>
  );
}
