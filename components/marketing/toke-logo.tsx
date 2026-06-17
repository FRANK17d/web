import Image from 'next/image'

interface TokeLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'color' | 'white'
  src?: string
}

const logoAspectRatio = 1500 / 580

const heights: Record<string, number> = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 64,
}

export function TokeLogo({ className = '', size = 'md', variant = 'color', src = '/toke-logo.svg' }: TokeLogoProps) {
  const h = heights[size]
  const w = Math.round(h * logoAspectRatio)

  return (
    <Image
      src={src}
      alt="toke+"
      width={w}
      height={h}
      style={{ width: w, height: 'auto' }}
      className={`${variant === 'white' ? 'brightness-0 invert' : ''} ${className}`}
      unoptimized
      priority
    />
  )
}
