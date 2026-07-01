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

  const [first, ...rest] = columns

  return (
    <>
      {/* ── Tabla en escritorio (md+) ── */}
      <div className="hidden overflow-hidden rounded-hero border border-slate/10 bg-white shadow-card md:block">
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

      {/* ── Tarjetas en móvil / pantallas pequeñas (< md) ── */}
      <div className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <div
            key={keyExtractor(row)}
            className="rounded-[1.35rem] border border-slate/10 bg-white p-4 shadow-card ring-1 ring-black/[0.01]"
          >
            {/* La primera columna actúa de "título" de la tarjeta */}
            {first && <div className="min-w-0 text-ink">{first.render(row)}</div>}

            {rest.length > 0 && (
              <dl className="mt-3 grid gap-2 border-t border-slate/10 pt-3">
                {rest.map((col) =>
                  col.header ? (
                    <div
                      key={col.key}
                      className="rounded-xl bg-canvas/60 px-3 py-2"
                    >
                      <dt className="text-[10px] font-bold uppercase tracking-eyebrow text-slate">
                        {col.header}
                      </dt>
                      <dd className="mt-1 min-w-0 break-words text-sm text-ink">
                        {col.render(row)}
                      </dd>
                    </div>
                  ) : (
                    // Columnas sin encabezado (p.ej. acciones): fila a lo ancho.
                    <div key={col.key} className="overflow-x-auto rounded-xl bg-canvas/60 p-2">
                      {col.render(row)}
                    </div>
                  ),
                )}
              </dl>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
