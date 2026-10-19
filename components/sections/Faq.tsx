'use client';

import { Section } from '@/components/ui/Section';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Link } from '@/i18n/navigation';
import { generateFaqSchema } from '@/lib/seo';
import { track } from '@/lib/analytics';
import { useTranslations } from 'next-intl';

export function Faq() {
  const t = useTranslations('faq');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');

  const faqItems = [
    {
      id: 'q1',
      question: t('q1'),
      answer: t('a1'),
    },
    {
      id: 'q2',
      question: t('q2'),
      answer: t('a2'),
    },
    {
      id: 'q3',
      question: t('q3'),
      answer: t('a3'),
    },
    {
      id: 'q4',
      question: t('q4'),
      answer: t('a4'),
    },
    {
      id: 'q5',
      question: t('q5'),
      answer: t('a5'),
      link: { href: '/privacy', text: tCommon('readPrivacy') },
    },
    {
      id: 'q6',
      question: t('q6'),
      answer: t('a6'),
    },
    {
      id: 'q7',
      question: t('q7'),
      answer: t('a7'),
    },
    {
      id: 'q8',
      question: t('q8'),
      answer: t('a8'),
      link: { href: '#contact', text: tNav('contact') },
    },
  ];

  const jsonLd = generateFaqSchema(faqItems);

  return (
    <Section id="faq" className="bg-surface/50 border-t border-border/60">
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
          {t('title')}
        </h2>
        <p className="text-base sm:text-lg text-ink-muted">
          {t('subtitle')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion>
          {faqItems.map((item, idx) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              title={item.question}
              defaultOpen={idx === 0}
              onToggle={(isOpen) => {
                if (isOpen) {
                  track('faq_open', { id: item.id });
                }
              }}
            >
              <div className="space-y-3">
                <p className="leading-relaxed">{item.answer}</p>
                {item.id === 'q5' && (
                  <p className="pt-1">
                    <Link
                      href="/privacy"
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1.5 text-sm"
                    >
                      <span>{tCommon('readPrivacy')}</span>
                      <span aria-hidden="true" className="rtl:rotate-180 inline-block transition-transform">→</span>
                    </Link>
                  </p>
                )}
                {item.id === 'q8' && (
                  <p className="pt-1">
                    <a
                      href="#contact"
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1.5 text-sm"
                    >
                      <span>{tNav('contact')}</span>
                      <span aria-hidden="true" className="rtl:rotate-180 inline-block transition-transform">→</span>
                    </a>
                  </p>
                )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
