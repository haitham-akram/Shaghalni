// import { Section } from '@/components/ui/Section'
// import { Card } from '@/components/ui/Card'
// import { MessageSquare, Upload, CheckCircle2 } from 'lucide-react'
// import { useTranslations } from 'next-intl'

// export function HowItWorks() {
//   const t = useTranslations('howItWorks')

//   const steps = [
//     { num: 1, icon: MessageSquare, title: t('step1Title'), desc: t('step1Desc') },
//     { num: 2, icon: Upload, title: t('step2Title'), desc: t('step2Desc') },
//     { num: 3, icon: CheckCircle2, title: t('step3Title'), desc: t('step3Desc') },
//   ]

//   return (
//     <Section id="how" className="bg-bg border-t border-border/60">
//       <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">{t('title')}</h2>
//         <p className="text-base sm:text-lg text-ink-muted">{t('subtitle')}</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {steps.map((step) => {
//           const Icon = step.icon
//           return (
//             <Card
//               key={step.num}
//               className="group relative overflow-hidden flex flex-col items-start text-start p-8 bg-surface border border-border"
//               hover
//             >
//               {/* Background step number */}
//               <span
//                 aria-hidden="true"
//                 className="pointer-events-none select-none absolute -top-4 end-4 text-[9rem] sm:text-[10rem] font-black leading-none tabular-nums text-amber opacity-20 transition-opacity duration-300 group-hover:opacity-30"
//               >
//                 {String(step.num).padStart(2, '0')}
//               </span>

//               {/* Content above the number */}
//               <div className="relative z-10 flex flex-col items-start">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-night mb-5">
//                   <Icon className="h-7 w-7" />
//                 </div>

//                 <h3 className="text-lg sm:text-xl font-bold text-ink mb-3">{step.title}</h3>

//                 <p className="text-sm sm:text-base text-ink-muted leading-relaxed">{step.desc}</p>
//               </div>
//             </Card>
//           )
//         })}
//       </div>
//     </Section>
//   )
// }
'use client'

import { useRef } from 'react'
import { MotionConfig, motion, useInView } from 'framer-motion'
import { MessageSquare, Upload, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Section } from '@/components/ui/Section'

const STEP_DELAY = 0.8 // seconds between steps
const START = 0.3

export function HowItWorks() {
  const t = useTranslations('howItWorks')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })

  const steps = [
    { icon: MessageSquare, title: t('step1Title'), desc: t('step1Desc') },
    { icon: Upload, title: t('step2Title'), desc: t('step2Desc') },
    { icon: CheckCircle2, title: t('step3Title'), desc: t('step3Desc') },
  ]
  const lineDuration = (steps.length - 1) * STEP_DELAY

  return (
    <MotionConfig reducedMotion="user">
      <Section id="how" className="bg-bg border-t border-border/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">{t('title')}</h2>
          <p className="text-base sm:text-lg text-ink-muted">{t('subtitle')}</p>
        </div>

        <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Desktop connector: draws from the start side (right in RTL) */}
          <div aria-hidden="true" className="pointer-events-none absolute top-7 hidden md:block h-0.5 inset-x-[16.66%]">
            <div className="absolute inset-0 bg-border" />
            <motion.div
              className="absolute inset-0 origin-left rtl:origin-right bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: inView ? 1 : 0 }}
              transition={{ duration: lineDuration, delay: START, ease: 'easeInOut' }}
            />
          </div>

          {/* Mobile connector: vertical */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-7 start-7 w-0.5 -translate-x-1/2 rtl:translate-x-1/2 md:hidden">
            <div className="absolute inset-0 bg-border" />
            <motion.div
              className="absolute inset-0 origin-top bg-primary"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: inView ? 1 : 0 }}
              transition={{ duration: lineDuration, delay: START, ease: 'easeInOut' }}
            />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon
            const at = START + i * STEP_DELAY
            return (
              <div key={i} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
                {/* Node: inactive base + active overlay that fades in when the line arrives */}
                <div className="relative z-10 h-14 w-14 shrink-0">
                  <div className="absolute inset-0 grid place-items-center rounded-full border-2 border-border bg-surface text-ink-muted">
                    <Icon className="h-6 w-6" />
                  </div>
                  <motion.div
                    className="absolute inset-0 grid place-items-center rounded-full border-2 border-primary bg-night text-primary shadow-lg shadow-primary/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: [0.8, 1.12, 1] } : {}}
                    transition={{ delay: at, duration: 0.5 }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.div>
                </div>

                <motion.div
                  className="flex-1 min-w-0 md:mt-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: at + 0.1, duration: 0.5 }}
                >
                  <h3 className="text-lg sm:text-xl font-bold text-ink mb-2">{step.title}</h3>
                  <p className="text-sm sm:text-base text-ink-muted leading-relaxed">{step.desc}</p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </Section>
    </MotionConfig>
  )
}