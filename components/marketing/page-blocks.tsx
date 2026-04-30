import type { ReactNode } from 'react'

export function MarketingSubpageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="relative overflow-hidden bg-[#FFF7F5] pt-36 pb-20 sm:pt-40 lg:pt-44 lg:pb-24">
      <div className="pointer-events-none absolute -right-24 top-24 h-[30rem] w-[30rem] rounded-full bg-[#EE7070]/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D94F4F]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-5xl font-black leading-[0.98] tracking-tight text-neutral-900 sm:text-6xl lg:text-[78px]">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}

export function MarketingCtaBand({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="bg-[#D94F4F] py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  )
}
