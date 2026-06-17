import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

// CSP without nonces — allows 'unsafe-inline' for styles (Tailwind)
// and scripts during dev. In production, inline scripts are hashed by
// Next.js automatically via SRI if enabled.
const cspHeader = `
  default-src 'self';
  script-src 'self'${isDev ? " 'unsafe-eval'" : ''} 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://images.unsplash.com https://*.insforge.app;
  font-src 'self';
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.69.119.17'],
  async redirects() {
    return [
      {
        // Solo corrige la versión con tilde del slug actual hacia la canónica.
        source: '/gestion-x7k2m9/olvide-mi-contraseña',
        destination: '/gestion-x7k2m9/olvide-mi-contrasena',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.insforge.app',
      },
    ],
  },
}

export default nextConfig
