'use client'

import { generateCsv } from '@/lib/admin-data/csv-export'
import { Download } from 'lucide-react'

export function ExportCsvButton({
  headers,
  rows,
  filename = 'export.csv',
}: {
  headers: string[]
  rows: string[][]
  filename?: string
}) {
  function handleExport() {
    const csv = generateCsv(headers, rows)
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      title="Descargar CSV"
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate/15 px-3.5 py-2 text-xs font-semibold text-slate transition-colors hover:bg-white hover:text-ink hover:shadow-sm"
    >
      <Download className="h-3.5 w-3.5" />
      Descargar CSV
    </button>
  )
}
