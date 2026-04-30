import type { ReactNode } from 'react'

export type Column<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

type DataTableProps<T> = {
  columns: Column<T>[]
  rows: T[]
  keyExtractor: (row: T) => string
  emptyMessage?: string
}

export function DataTable<T>({
  columns,
  rows,
  keyExtractor,
  emptyMessage = 'Sin datos',
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-hero border border-slate/10 bg-white px-8 py-16 text-center shadow-card">
        <p className="text-sm text-slate">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-hero border border-slate/10 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate/10 bg-canvas">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-6 py-3 text-xs font-bold uppercase tracking-eyebrow text-slate ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate/5">
            {rows.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="transition-colors duration-100 hover:bg-canvas/50"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-6 py-4 text-ink ${col.className ?? ''}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
