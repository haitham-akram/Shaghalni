import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { MessageSquare, Upload, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function HowItWorks() {
  const t = useTranslations('howItWorks')

  const steps = [
    { num: 1, icon: MessageSquare, title: t('step1Title'), desc: t('step1Desc') },
    { num: 2, icon: Upload, title: t('step2Title'), desc: t('step2Desc') },
    { num: 3, icon: CheckCircle2, title: t('step3Title'), desc: t('step3Desc') },
  ]

  return (
    <Section id="how" className="bg-bg border-t border-border/60">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">{t('title')}</h2>
        <p className="text-base sm:text-lg text-ink-muted">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <Card
              key={step.num}
              className="group relative overflow-hidden flex flex-col items-start text-start p-8 bg-surface border border-border"
              hover
            >
              {/* Background step number */}
              <span
                aria-hidden="true"
                className="pointer-events-none select-none absolute -top-4 end-4 text-[9rem] sm:text-[10rem] font-black leading-none tabular-nums text-amber opacity-20 transition-opacity duration-300 group-hover:opacity-30"
              >
                {String(step.num).padStart(2, '0')}
              </span>

              {/* Content above the number */}
              <div className="relative z-10 flex flex-col items-start">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-night mb-5">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-ink mb-3">{step.title}</h3>

                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">{step.desc}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
