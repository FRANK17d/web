'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

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

  return (
    <select
      aria-label={label}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={`input-field max-w-[200px] ${isPending ? 'opacity-70' : ''}`}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
