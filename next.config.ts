import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

// CSP without nonces — allows 'unsafe-inline' for styles (Tailwind)
// and scripts during dev. In production, inline scripts are hashed by
// Next.js automatically via SRI if enabled.
const cspHeader = `
  default-src 'self';
  script-src 'self'${isDev ? " 'unsafe-eval'" : ''} 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://images.unsplash.com;
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
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: '/administracion/olvide-mi-contraseña',
        destination: '/administracion/olvide-mi-contrasena',
        permanent: true,
      },
      {
        source: '/admin/login',
        destination: '/administracion/iniciar-sesion',
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: '/administracion/:path*',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/administracion',
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
    qualities: [75, 90, 95, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
