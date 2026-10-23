import { Section } from '@/components/ui/Section';
import { teamMembers } from '@/lib/team';
import { Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AboutProps {
  locale: 'ar' | 'en';
}

export function About({ locale }: AboutProps) {
  const t = useTranslations('about');

  return (
    <Section id="about" className="bg-night text-paper border-t border-paper/10">
      <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-paper">
          {t('title')}
        </h2>

        {/* Short Story */}
        <p className="text-base sm:text-lg text-paper/80 leading-relaxed">
          {t('story')}
        </p>

        {/* Mission Quote */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-white/5 border border-paper/10 text-center">
          <Quote className="h-8 w-8 text-primary mx-auto mb-3 opacity-80" />
          <blockquote className="text-xl sm:text-2xl font-bold text-primary italic [lang=ar]:not-italic">
            {t('mission')}
          </blockquote>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-paper">
            {t('teamTitle')}
          </h3>
          <p className="text-sm text-paper/70">
            {t('teamSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => {
            const memberName = member.name[locale];
            const memberRole = member.role[locale];
            const initials = memberName.slice(0, 2);

            return (
              <div
                key={member.id}
                className="p-6 flex flex-col items-center text-center bg-white/5 border border-paper/10 rounded-2xl shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Avatar with fallback initials */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-night font-bold text-xl mb-4 shadow-sm">
                  {initials}
                </div>

                <h4 className="text-base sm:text-lg font-bold text-paper mb-1">
                  {memberName}
                </h4>

                <p className="text-xs sm:text-sm text-paper/70 leading-relaxed mb-4">
                  {memberRole}
                </p>

                {member.links && (
                  <div className="flex items-center gap-3 text-paper/60 text-xs">
                    {member.links.linkedin && (
                      <a
                        href={member.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                        aria-label="LinkedIn Profile"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.links.github && (
                      <a
                        href={member.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                        aria-label="GitHub Profile"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
