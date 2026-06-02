import type { MetadataRoute } from 'next'

const BASE_URL = 'https://tokeplus.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const marketingPages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/servicios', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/nosotros', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/ayuda', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/terminos', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/privacidad', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  return marketingPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
