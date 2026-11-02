'use client'

import { motion, MotionConfig } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { ShieldCheck, UserCheck, Trash2, Lock, ArrowUpRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
})

export function Privacy() {
  const t = useTranslations('privacySection')

  // The strongest promise gets the hero card.
  const hero = {
    icon: ShieldCheck,
    title: t('point2Title'),
    desc: t('point2Desc'),
  }

  const secondary = [
    {
      icon: UserCheck,
      title: t('point1Title'),
      desc: t('point1Desc'),
    },
    {
      icon: Trash2,
      title: t('point3Title'),
      desc: t('point3Desc'),
    },
    {
      icon: Lock,
      title: t('point4Title'),
      desc: t('point4Desc'),
    },
  ]

  const HeroIcon = hero.icon

  return (
    <MotionConfig reducedMotion="user">
      <Section id="privacy" className="bg-bg border-t border-border/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">{t('title')}</h2>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed">{t('intro')}</p>
        </div>

        {/* Bento: hero card (3 of 5 columns, full height) + three stacked cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 lg:grid-rows-3 gap-6 mb-12">
          {/* Hero card */}
          <motion.div
            {...reveal(0)}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden md:col-span-3 lg:row-span-3 flex flex-col justify-between gap-12 rounded-3xl bg-night p-8 sm:p-10 lg:p-12 text-start shadow-lg shadow-night/20"
          >
            {/* Oversized watermark, same idea as the big numbers in how-it-works */}
            <HeroIcon
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -end-12 h-72 w-72 sm:h-80 sm:w-80 text-primary opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.12]"
              strokeWidth={1}
            />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <HeroIcon className="h-8 w-8" />
            </div>

            <div className="relative space-y-4 max-w-md">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-paper">{hero.title}</h3>
              <p className="text-base sm:text-lg leading-relaxed text-paper/75">{hero.desc}</p>
            </div>
          </motion.div>

          {/* Secondary cards */}
          {secondary.map((pt, idx) => {
            const Icon = pt.icon
            return (
              <motion.div
                key={idx}
                {...reveal(0.1 + idx * 0.1)}
                whileHover={{ y: -4 }}
                className="group md:col-span-1 lg:col-span-2 flex flex-col lg:flex-row items-start gap-5 rounded-2xl bg-surface border border-border p-6 sm:p-7 text-start shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-night/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-night transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-night group-hover:text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-ink">{pt.title}</h3>
                  <p className="text-sm sm:text-base text-ink-muted leading-relaxed">{pt.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div {...reveal(0.4)} className="flex justify-center">
          <Link
            href="/privacy"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface hover:bg-paper/80 text-ink font-semibold text-sm transition-colors border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
          >
            <span>{t('ctaButton')}</span>
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </motion.div>
      </Section>
    </MotionConfig>
  )
}
