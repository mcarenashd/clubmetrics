'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#1464A0', '#3DC99A', '#F39C12', '#E74C3C', '#4A5568', '#9B59B6']

interface DonutItem {
  name: string
  value: number
}

export default function DonutDistribucion({
  data,
  title,
}: {
  data: DonutItem[]
  title: string
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
      <h3 className="text-lg font-semibold text-texto-principal mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => {
              const n = Number(v)
              return [`${n.toLocaleString('es-CO')} (${total > 0 ? ((n / total) * 100).toFixed(1) : 0}%)`, '']
            }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #D1D9E0' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value: string) => <span className="text-texto-secundario">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
