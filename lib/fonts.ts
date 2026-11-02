import { Cairo } from 'next/font/google';

export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '800'],
  variable: '--font-cairo',
  display: 'swap',
});