'use client'

import { motion, MotionConfig } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { GraduationCap, ArrowLeftRight, Plane } from 'lucide-react'
import { useTranslations } from 'next-intl'

const SLOT = 2 // seconds each card keeps the light (same as Features)

export function Audience() {
  const t = useTranslations('audience')

  const groups = [
    {
      icon: GraduationCap,
      title: t('gradTitle'),
      desc: t('gradDesc'),
    },
    {
      icon: ArrowLeftRight,
      title: t('switcherTitle'),
      desc: t('switcherDesc'),
    },
    {
      icon: Plane,
      title: t('abroadTitle'),
      desc: t('abroadDesc'),
    },
  ]

  const cycle = groups.length * SLOT // 6s: the light visits all three cards

  return (
    <MotionConfig reducedMotion="user">
      <Section id="audience" className="bg-bg border-t border-border/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">{t('title')}</h2>
          <p className="text-base sm:text-lg text-ink-muted">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map((group, idx) => {
            const Icon = group.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl bg-border p-px shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-night/10"
              >
                {/* Traveling light: one card at a time (same effect as Features) */}
                <span
                  aria-hidden="true"
                  className="feat-light feat-light--three pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[220%] opacity-0"
                  style={
                    {
                      '--delay': `${idx * SLOT}s`,
                      '--cycle': `${cycle}s`,
                    } as React.CSSProperties
                  }
                />

                {/* Replaces <Card>: the 1px wrapper padding lets the light show as a border */}
                <div className="relative h-full flex flex-col items-start text-start rounded-[calc(1rem-1px)] bg-surface p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-night mb-6 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-night group-hover:text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold text-ink mb-3">{group.title}</h3>

                  <p className="text-sm sm:text-base text-ink-muted leading-relaxed">{group.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Section>
    </MotionConfig>
  )
}
