declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: {
        props?: Record<string, string | number | boolean>;
      }
    ) => void;
  }
}

export type CtaLocation = 'hero' | 'sticky' | 'footer' | 'final' | 'contact';

export type AnalyticsEvent =
  | { name: 'cta_whatsapp'; props: { location: CtaLocation; locale: string } }
  | { name: 'cta_telegram'; props: { location: CtaLocation; locale: string } }
  | { name: 'lang_switch'; props: { from: string; to: string } }
  | { name: 'contact_submit'; props: { topic: string } }
  | { name: 'faq_open'; props: { id: string } }
  | { name: 'demo_replay'; props?: Record<string, never> };

export function track<T extends AnalyticsEvent['name']>(
  name: T,
  props?: Extract<AnalyticsEvent, { name: T }> extends { props: infer P } ? P : never
): void {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    try {
      window.plausible(name, props ? { props } : undefined);
    } catch {
      // Ignore analytics errors silently
    }
  }
}
