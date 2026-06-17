import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // No listamos la ruta del panel: publicarla en robots.txt revelaría
        // el slug oculto. Las páginas del panel ya envían noindex por metadata.
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://tokeplus.app/sitemap.xml',
  }
}
