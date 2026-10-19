import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getBaseUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const routes = ['', '/contact', '/privacy', '/terms'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of routing.locales) {
      const url = `${baseUrl}/${locale}${route}`;

      const languages: Record<string, string> = {};
      for (const altLocale of routing.locales) {
        languages[altLocale] = `${baseUrl}/${altLocale}${route}`;
      }
      languages['x-default'] = `${baseUrl}/ar${route}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1.0 : 0.7,
        alternates: {
          languages,
        },
      });
    }
  }

  return sitemapEntries;
}
