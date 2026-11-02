'use client';

import { motion, MotionConfig } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import {
  FileText,
  Mail,
  Search,
  MessagesSquare,
  Languages,
  Smartphone,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const CYCLE = 12; // seconds for the light to visit every card (must match feat-slot in CSS)

export function Features() {
  const t = useTranslations('features');

  const featuresList = [
    {
      icon: FileText,
      title: t('item1Title'),
      desc: t('item1Desc'),
    },
    {
      icon: Mail,
      title: t('item2Title'),
      desc: t('item2Desc'),
    },
    {
      icon: Search,
      title: t('item3Title'),
      desc: t('item3Desc'),
    },
    {
      icon: MessagesSquare,
      title: t('item4Title'),
      desc: t('item4Desc'),
    },
    {
      icon: Languages,
      title: t('item5Title'),
      desc: t('item5Desc'),
    },
    {
      icon: Smartphone,
      title: t('item6Title'),
      desc: t('item6Desc'),
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <Section id="features" className="bg-bg border-t border-border/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg text-ink-muted">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl bg-border p-px shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-night/10"
              >
                {/* Traveling light: only one card shows it at a time */}
                <span
                  aria-hidden="true"
                  className="feat-light pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[220%] opacity-0"
                  style={
                    {
                      '--delay': `${idx * (CYCLE / featuresList.length)}s`,
                      '--cycle': `${CYCLE}s`,
                    } as React.CSSProperties
                  }
                />

                {/* Replaces <Card>: the 1px wrapper padding is what lets the light show as a border */}
                <div className="relative h-full flex flex-col items-start text-start rounded-[calc(1rem-1px)] bg-surface p-6 sm:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-night mb-5 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-night group-hover:text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-ink mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>
    </MotionConfig>
  );
}