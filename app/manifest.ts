import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'شغلني | Shaghalni',
    short_name: 'شغلني',
    description: 'مساعدك الذكي للتقديم على الوظائف عبر واتساب وتيليجرام',
    start_url: '/ar',
    display: 'standalone',
    background_color: '#FAF9FD',
    theme_color: '#5E56FA',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
