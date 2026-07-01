'use client'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type MonthlyCount = { month: string; label: string; count: number }
type MonthlyRevenue = { month: string; label: string; amount: number }

export function OrdersChart({ data }: { data: MonthlyCount[] }) {
  return (
    <div className="rounded-hero border border-slate/10 bg-white p-5 shadow-card">
      <h3 className="mb-1 text-sm font-bold text-neutral-800">Pedidos por mes</h3>
      <p className="mb-4 text-xs text-neutral-400">Ultimos 6 meses</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #eee' }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="count" name="Pedidos" fill="#EE7070" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  return (
    <div className="rounded-hero border border-slate/10 bg-white p-5 shadow-card">
      <h3 className="mb-1 text-sm font-bold text-neutral-800">Ingresos por mes (PEN)</h3>
      <p className="mb-4 text-xs text-neutral-400">Pagos aprobados, ultimos 6 meses</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #eee' }}
              labelStyle={{ fontWeight: 600 }}
              formatter={(value) => [`S/ ${Number(value).toFixed(2)}`, 'Ingresos']}
            />
            <Line
              type="monotone"
              dataKey="amount"
              name="Ingresos"
              stroke="#EE7070"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#EE7070' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
