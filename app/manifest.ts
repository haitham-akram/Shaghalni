import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'شغلني | Shaghalni',
    short_name: 'شغلني',
    description: 'مساعدك الذكي للتقديم على الوظائف عبر واتساب وتيليجرام',
    start_url: '/ar',
    display: 'standalone',
    background_color: '#F6F4EE',
    theme_color: '#0E2A2B',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
