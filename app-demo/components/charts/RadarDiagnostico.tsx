'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface RadarDataItem {
  indicador: string
  club: number
  segmento: number
}

export default function RadarDiagnostico({ data }: { data: RadarDataItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
      <h3 className="text-lg font-semibold text-texto-principal mb-4">
        Diagnóstico Integral
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="#D1D9E0" />
          <PolarAngleAxis
            dataKey="indicador"
            tick={{ fontSize: 11, fill: '#4A5568' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#A0AEC0' }}
          />
          <Radar
            name="Tu club"
            dataKey="club"
            stroke="#1464A0"
            fill="#1464A0"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Radar
            name="Promedio segmento"
            dataKey="segmento"
            stroke="#3DC99A"
            fill="#3DC99A"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
