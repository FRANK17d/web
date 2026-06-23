'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { ChevronDown, ListFilter } from 'lucide-react'

type FilterSelectProps = {
  paramName: string
  label: string
  options: { value: string; label: string }[]
  defaultValue?: string
}

export function FilterSelect({
  paramName,
  label,
  options,
  defaultValue = '',
}: FilterSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set(paramName, value)
      } else {
        params.delete(paramName)
      }
      params.delete('page')

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams, paramName],
  )

  const isActive = !!defaultValue

  return (
    <div className="relative inline-flex">
      <ListFilter
        className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
          isActive ? 'text-brand-600' : 'text-slate'
        }`}
      />
      <select
        aria-label={label}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={`w-full min-w-[200px] cursor-pointer appearance-none rounded-pill border bg-white py-2.5 pl-11 pr-11 text-sm font-medium text-ink shadow-nav outline-none transition-colors hover:border-slate/60 focus:border-brand-600 focus:ring-1 focus:ring-brand-600/20 ${
          isActive ? 'border-brand-300' : 'border-slate/40'
        } ${isPending ? 'opacity-70' : ''}`}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
    </div>
  )
}
