const DEFAULT_WHATSAPP_NUMBER = '000000000000';
const DEFAULT_PREFILL_AR = 'مرحبا شغلني، أريد مساعدتي بالتقديم على وظيفة';
const DEFAULT_PREFILL_EN = 'Hi Shaghalni, I want help applying for a job';
const DEFAULT_TELEGRAM_BOT = 'shaghalni_bot';

export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
}

export function getWhatsAppPrefill(locale: 'ar' | 'en'): string {
  if (locale === 'ar') {
    return process.env.NEXT_PUBLIC_WHATSAPP_PREFILL_AR || DEFAULT_PREFILL_AR;
  }
  return process.env.NEXT_PUBLIC_WHATSAPP_PREFILL_EN || DEFAULT_PREFILL_EN;
}

export function getTelegramBotUsername(): string {
  return process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || DEFAULT_TELEGRAM_BOT;
}

export function whatsappUrl(locale: 'ar' | 'en'): string {
  const number = getWhatsAppNumber();
  const prefill = getWhatsAppPrefill(locale);
  return `https://wa.me/${number}?text=${encodeURIComponent(prefill)}`;
}

export function telegramUrl(locale: 'ar' | 'en'): string {
  const bot = getTelegramBotUsername();
  const startParam = locale === 'ar' ? 'web_ar' : 'web_en';
  return `https://t.me/${bot}?start=${startParam}`;
}
