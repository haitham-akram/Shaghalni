// import { Section } from '@/components/ui/Section';
// import { ChatScript } from '@/components/chat/ChatScript';
// import { CheckCircle2 } from 'lucide-react';
// import { useTranslations } from 'next-intl';

// interface DemoProps {
//   locale: 'ar' | 'en';
// }

// export function Demo({ locale }: DemoProps) {
//   const t = useTranslations('demo');

//   const bullets = [
//     {
//       title: t('point1Title'),
//       desc: t('point1Desc'),
//     },
//     {
//       title: t('point2Title'),
//       desc: t('point2Desc'),
//     },
//     {
//       title: t('point3Title'),
//       desc: t('point3Desc'),
//     },
//   ];

//   return (
//     <Section id="demo" className="bg-night text-paper border-t border-paper/10">
//       <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-paper">
//           {t('title')}
//         </h2>
//         <p className="text-base sm:text-lg text-paper/80">
//           {t('subtitle')}
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
//         {/* Phone demo column */}
//         <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
//           <ChatScript locale={locale} showReplayButton={true} />
//         </div>

//         {/* Bullet explanation column */}
//         <div className="lg:col-span-6 space-y-8 order-1 lg:order-2 text-start">
//           <div className="space-y-6">
//             {bullets.map((bullet, idx) => (
//               <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-paper/10 shadow-sm">
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary font-bold">
//                   <CheckCircle2 className="h-6 w-6 text-primary" />
//                 </div>
//                 <div className="space-y-1">
//                   <h3 className="text-base sm:text-lg font-bold text-paper">
//                     {bullet.title}
//                   </h3>
//                   <p className="text-sm sm:text-base text-paper/70 leading-relaxed">
//                     {bullet.desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Section>
//   );
// }
'use client'

import { useState } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { ChatScript } from '@/components/chat/ChatScript'
import { useTranslations } from 'next-intl'

interface DemoProps {
  locale: 'ar' | 'en'
  onStageChange?: (stage: number) => void
}

/** Circle + check that draws itself when `drawn` becomes true. */
function AnimatedCheck({ drawn }: { drawn: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" opacity={0.5} />
      <motion.path
        d="M7.5 12.5l3 3 6-6.5"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </svg>
  )
}

export function Demo({ locale }: DemoProps) {
  const t = useTranslations('demo')

  // null  = chat isn't reporting progress -> cards stay static and fully lit
  // -1    = chat just (re)started, nothing reached yet
  // 0..2  = current stage of the chat
  const [stage, setStage] = useState<number | null>(null)

  const bullets = [
    {
      title: t('point1Title'),
      desc: t('point1Desc'),
    },
    {
      title: t('point2Title'),
      desc: t('point2Desc'),
    },
    {
      title: t('point3Title'),
      desc: t('point3Desc'),
    },
  ]

  return (
    <MotionConfig reducedMotion="user">
      <Section id="demo" className="bg-night text-paper border-t border-paper/10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-paper">{t('title')}</h2>
          <p className="text-base sm:text-lg text-paper/80">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Phone demo column */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <ChatScript locale={locale} showReplayButton={true} onStageChange={setStage} />
          </div>

          {/* Bullet explanation column */}
          <div className="lg:col-span-6 space-y-8 order-1 lg:order-2 text-start">
            <div className="space-y-6">
              {bullets.map((bullet, idx) => {
                const synced = stage !== null
                const active = synced && stage === idx
                const done = !synced || (stage as number) >= idx // reached (or no sync): check drawn
                const upcoming = synced && (stage as number) < idx

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                    className="relative"
                  >
                    <div
                      className={[
                        'flex items-start gap-4 p-5 rounded-2xl border transition-all duration-500',
                        active
                          ? 'bg-primary/10 border-primary/60 shadow-lg shadow-primary/20'
                          : 'bg-white/5 border-paper/10 shadow-sm',
                        upcoming ? 'opacity-50' : 'opacity-100',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-500',
                          active ? 'bg-primary/25' : 'bg-primary/15',
                        ].join(' ')}
                      >
                        <AnimatedCheck drawn={done} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-paper">{bullet.title}</h3>
                        <p className="text-sm sm:text-base text-paper/70 leading-relaxed">{bullet.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </Section>
    </MotionConfig>
  )
}
