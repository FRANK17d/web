/**
 * Genera un string CSV con escapado correcto de campos.
 */
export function generateCsv(headers: string[], rows: string[][]): string {
  function escapeField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
      return `"${field.replace(/"/g, '""')}"`
    }
    return field
  }

  const headerLine = headers.map(escapeField).join(',')
  const dataLines = rows.map((row) => row.map(escapeField).join(','))

  return [headerLine, ...dataLines].join('\r\n')
}
