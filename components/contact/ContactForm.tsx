'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { contactSchema, ContactFormData } from '@/lib/contact-schema';
import { track } from '@/lib/analytics';
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react';

type ContactErrorKey =
  | 'nameMin'
  | 'nameMax'
  | 'emailInvalid'
  | 'topicRequired'
  | 'messageMin'
  | 'messageMax'
  | 'consentRequired';

interface ContactFormProps {
  contactEmail: string;
}

export function ContactForm({ contactEmail }: ContactFormProps) {
  const t = useTranslations('contact');

  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: '',
    email: '',
    topic: 'support',
    message: '',
    consent: false as unknown as true,
    website: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // 1. Client-side validation with Zod
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        throw new Error('Server returned an error');
      }

      setIsSuccess(true);
      track('contact_submit', { topic: result.data.topic });
    } catch {
      setServerError(t('errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      topic: 'support',
      message: '',
      consent: false as unknown as true,
      website: '',
    });
    setErrors({});
    setIsSuccess(false);
    setServerError(null);
  };

  if (isSuccess) {
    return (
      <div
        className="rounded-2xl bg-surface border border-border p-8 text-center space-y-5 shadow-sm"
        role="alert"
        aria-live="polite"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/15 text-forest mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-ink">{t('successTitle')}</h3>
          <p className="text-ink-muted text-sm max-w-md mx-auto leading-relaxed">
            {t('successMessage')}
          </p>
        </div>
        <div>
          <Button variant="secondary" onClick={resetForm}>
            {t('sendAnother')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6 shadow-sm"
    >
      <h3 className="text-xl font-bold text-ink">{t('formTitle')}</h3>

      {serverError && (
        <div
          className="rounded-xl bg-amber/15 border border-amber/30 p-4 text-sm text-night space-y-2"
          role="alert"
        >
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber" />
            <span>{t('errorTitle')}</span>
          </div>
          <p>{serverError}</p>
          <p className="font-medium text-ink">
            <a
              href={`mailto:${contactEmail}`}
              className="text-forest hover:underline inline-flex items-center gap-1.5"
              dir="ltr"
            >
              <Mail className="h-4 w-4" />
              <span>{contactEmail}</span>
            </a>
          </p>
        </div>
      )}

      {/* Honeypot field (hidden from real users) */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website || ''}
          onChange={handleChange}
        />
      </div>

      {/* Name Field */}
      <div className="space-y-1.5 text-start">
        <label htmlFor="name" className="block text-sm font-semibold text-ink">
          {t('nameLabel')} <span className="text-forest">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder={t('namePlaceholder')}
          value={formData.name || ''}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="w-full h-12 px-4 rounded-xl border border-border bg-bg text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest text-sm transition-colors"
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-forest font-semibold">
            {t(errors.name as ContactErrorKey)}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-1.5 text-start">
        <label htmlFor="email" className="block text-sm font-semibold text-ink">
          {t('emailLabel')} <span className="text-forest">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          dir="ltr"
          placeholder={t('emailPlaceholder')}
          value={formData.email || ''}
          onChange={handleChange}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="w-full h-12 px-4 rounded-xl border border-border bg-bg text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest text-sm transition-colors"
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-forest font-semibold">
            {t(errors.email as ContactErrorKey)}
          </p>
        )}
      </div>

      {/* Topic Field */}
      <div className="space-y-1.5 text-start">
        <label htmlFor="topic" className="block text-sm font-semibold text-ink">
          {t('topicLabel')} <span className="text-forest">*</span>
        </label>
        <select
          id="topic"
          name="topic"
          value={formData.topic || 'support'}
          onChange={handleChange}
          className="w-full h-12 px-4 rounded-xl border border-border bg-bg text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest text-sm transition-colors"
        >
          <option value="support">{t('topicSupport')}</option>
          <option value="partnership">{t('topicPartnership')}</option>
          <option value="feedback">{t('topicFeedback')}</option>
          <option value="other">{t('topicOther')}</option>
        </select>
      </div>

      {/* Message Field */}
      <div className="space-y-1.5 text-start">
        <label htmlFor="message" className="block text-sm font-semibold text-ink">
          {t('messageLabel')} <span className="text-forest">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={t('messagePlaceholder')}
          value={formData.message || ''}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className="w-full p-4 rounded-xl border border-border bg-bg text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest text-sm transition-colors resize-y"
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-forest font-semibold">
            {t(errors.message as ContactErrorKey)}
          </p>
        )}
      </div>

      {/* Consent Checkbox */}
      <div className="space-y-1 text-start">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="consent"
            checked={!!formData.consent}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-border text-forest focus:ring-forest"
          />
          <span className="text-xs text-ink-muted leading-relaxed">
            {t('consentLabel')}{' '}
            <Link href="/privacy" className="text-forest font-semibold hover:underline">
              {t('consentLink')}
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-forest font-semibold">
            {t(errors.consent as ContactErrorKey)}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? t('submitting') : t('submitButton')}
      </Button>
    </form>
  );
}
