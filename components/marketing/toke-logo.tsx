import Image from 'next/image'

interface TokeLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'color' | 'white'
}

const logoAspectRatio = 1500 / 580

const heights: Record<string, number> = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 64,
}

export function TokeLogo({ className = '', size = 'md', variant = 'color' }: TokeLogoProps) {
  const h = heights[size]
  const w = Math.round(h * logoAspectRatio)

  return (
    <Image
      src="/toke-logo.svg"
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
