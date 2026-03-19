'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'

interface BarDataItem {
  name: string
  value: number
  isOwn: boolean
}

export default function BarComparativo({
  data,
  title,
  unit,
  promedio,
}: {
  data: BarDataItem[]
  title: string
  unit?: string
  promedio?: number
}) {
  return (
    <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
      <h3 className="text-lg font-semibold text-texto-principal mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#D1D9E0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#4A5568' }}
            axisLine={{ stroke: '#D1D9E0' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#4A5568' }}
            axisLine={{ stroke: '#D1D9E0' }}
          />
          <Tooltip
            formatter={(v) => [`${Number(v).toLocaleString('es-CO')} ${unit ?? ''}`, '']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #D1D9E0' }}
          />
          {promedio != null && (
            <ReferenceLine
              y={promedio}
              stroke="#3DC99A"
              strokeDasharray="5 5"
              label={{ value: 'Promedio', fontSize: 10, fill: '#3DC99A', position: 'right' }}
            />
          )}
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isOwn ? '#1464A0' : '#D1D9E0'}
                fillOpacity={entry.isOwn ? 1 : 0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
