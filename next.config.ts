import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* Extensible config — InsForge SDK handles all API communication */
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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
