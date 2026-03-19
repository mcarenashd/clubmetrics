'use client'

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts'

interface ScatterPoint {
  x: number
  y: number
  label: string
  isOwn: boolean
}

export default function ScatterPositioning({
  data,
  xLabel,
  yLabel,
  title,
}: {
  data: ScatterPoint[]
  xLabel: string
  yLabel: string
  title: string
}) {
  return (
    <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
      <h3 className="text-lg font-semibold text-texto-principal mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#D1D9E0" />
          <XAxis
            type="number"
            dataKey="x"
            tick={{ fontSize: 11, fill: '#4A5568' }}
            axisLine={{ stroke: '#D1D9E0' }}
          >
            <Label value={xLabel} offset={-15} position="insideBottom" style={{ fontSize: 12, fill: '#4A5568' }} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            tick={{ fontSize: 11, fill: '#4A5568' }}
            axisLine={{ stroke: '#D1D9E0' }}
          >
            <Label value={yLabel} angle={-90} position="insideLeft" style={{ fontSize: 12, fill: '#4A5568' }} />
          </YAxis>
          <Tooltip
            content={({ payload }) => {
              if (!payload?.length) return null
              const d = payload[0].payload as ScatterPoint
              return (
                <div className="bg-white border border-bordes rounded-lg px-3 py-2 shadow-md text-xs">
                  <p className="font-semibold text-texto-principal">{d.label}</p>
                  <p className="text-texto-secundario">{xLabel}: {d.x.toFixed(1)}</p>
                  <p className="text-texto-secundario">{yLabel}: {d.y.toFixed(1)}</p>
                </div>
              )
            }}
          />
          <Scatter data={data}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isOwn ? '#1464A0' : '#A0AEC0'}
                r={entry.isOwn ? 8 : 5}
                strokeWidth={entry.isOwn ? 2 : 0}
                stroke={entry.isOwn ? '#0D4A7A' : 'none'}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-texto-secundario text-center mt-2">
        Los clubes del sector aparecen con códigos anónimos. Solo tú conoces tu posición.
      </p>
    </div>
  )
}
