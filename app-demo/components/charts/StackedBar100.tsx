'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#1464A0', '#3DC99A', '#F39C12', '#E74C3C', '#4A5568', '#9B59B6']

interface StackedBar100Props {
  data: Record<string, string | number>[]
  keys: string[]
  labels?: Record<string, string>
  title: string
  xKey?: string
}

export default function StackedBar100({
  data,
  keys,
  labels,
  title,
  xKey = 'name',
}: StackedBar100Props) {
  // Normaliza cada fila a 100%
  const normalized = data.map(row => {
    const total = keys.reduce((sum, k) => sum + (Number(row[k]) || 0), 0)
    const out: Record<string, string | number> = { [xKey]: row[xKey] }
    keys.forEach(k => {
      out[k] = total > 0 ? Math.round((Number(row[k]) / total) * 100) : 0
    })
    return out
  })

  return (
    <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
      <h3 className="text-lg font-semibold text-texto-principal mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={normalized} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#D1D9E0" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: '#4A5568' }}
            axisLine={{ stroke: '#D1D9E0' }}
          />
          <YAxis
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 11, fill: '#4A5568' }}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(v, name) => [
              `${Number(v)}%`,
              labels?.[String(name)] ?? String(name),
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #D1D9E0' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value: string) => labels?.[value] ?? value}
          />
          {keys.map((k, i) => (
            <Bar
              key={k}
              dataKey={k}
              stackId="a"
              fill={COLORS[i % COLORS.length]}
              radius={i === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
