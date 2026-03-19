'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import ScatterPositioning from '@/components/charts/ScatterPositioning'
import BenchmarkTable from '@/components/ui/BenchmarkTable'
import { getClub, getAllSegmentoClubs, getSegmentoStats } from '@/lib/data'
import { formatNumber, formatPercent } from '@/lib/benchmark'
import { anonymizeClubsForDisplay } from '@/lib/anonymize'
import { Club } from '@/types/club'

export default function PosicionamientoPage() {
  const [club, setClub] = useState<Club | null>(null)
  const [clubId, setClubId] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('clubmetrics_club') ?? 'CLB-005'
    setClubId(id)
    setClub(getClub(id) ?? null)
  }, [])

  if (!club) return null

  const allClubs = getAllSegmentoClubs(clubId)
  const anon = anonymizeClubsForDisplay(allClubs, clubId)

  // Scatter: ARPU vs Churn
  const scatterData = anon.map(a => ({
    x: a.club.KPI_arpu_mensual_COP_miles,
    y: a.club.KPI_churn_rate_pct,
    label: a.isOwn ? 'Tu club ★' : a.label,
    isOwn: a.isOwn,
  }))

  // Ranking tabla
  const rankingKeys: { label: string; key: keyof Club; format: (v: number) => string }[] = [
    { label: 'ARPU (K COP)', key: 'KPI_arpu_mensual_COP_miles', format: (v) => formatNumber(v, 0) },
    { label: 'EBITDA %', key: 'KPI_ebitda_margen_pct', format: formatPercent },
    { label: 'Churn %', key: 'KPI_churn_rate_pct', format: formatPercent },
    { label: 'NPS', key: 'KPI_nps', format: (v) => formatNumber(v, 0) },
    { label: 'DSO', key: 'K01_dso_dias', format: (v) => formatNumber(v, 0) },
  ]

  // Sort by ARPU descending for ranking
  const sorted = [...anon].sort(
    (a, b) => b.club.KPI_arpu_mensual_COP_miles - a.club.KPI_arpu_mensual_COP_miles
  )

  const rankingRows = sorted.map((a, i) => ({
    label: a.isOwn ? 'Tu club ★' : a.label,
    values: [
      `#${i + 1}`,
      ...rankingKeys.map(k => k.format(a.club[k.key] as number)),
    ],
    isOwn: a.isOwn,
  }))

  // Cuadrante de posicionamiento
  const arpuStats = getSegmentoStats(clubId, 'KPI_arpu_mensual_COP_miles')
  const churnStats = getSegmentoStats(clubId, 'KPI_churn_rate_pct')
  const arpuAboveMedian = club.KPI_arpu_mensual_COP_miles >= (arpuStats?.p50 ?? 0)
  const churnBelowMedian = club.KPI_churn_rate_pct <= (churnStats?.p50 ?? 999)

  let cuadrante = ''
  let cuadranteColor = ''
  if (arpuAboveMedian && churnBelowMedian) {
    cuadrante = 'Líder — Alto ingreso, baja deserción'
    cuadranteColor = 'text-semaforo-verde'
  } else if (arpuAboveMedian && !churnBelowMedian) {
    cuadrante = 'Rentable en riesgo — Alto ingreso, alta deserción'
    cuadranteColor = 'text-semaforo-ambar'
  } else if (!arpuAboveMedian && churnBelowMedian) {
    cuadrante = 'Estable pero sub-monetizado — Bajo ingreso, baja deserción'
    cuadranteColor = 'text-semaforo-ambar'
  } else {
    cuadrante = 'Zona crítica — Bajo ingreso, alta deserción'
    cuadranteColor = 'text-semaforo-rojo'
  }

  return (
    <div>
      <PageHeader title="Posicionamiento Competitivo" description="Tu posición relativa dentro del segmento" />

      {/* Cuadrante estratégico */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5 mb-8">
        <h3 className="text-lg font-semibold text-texto-principal mb-2">Cuadrante Estratégico</h3>
        <p className={`text-xl font-bold ${cuadranteColor}`}>{cuadrante}</p>
        <p className="text-sm text-texto-secundario mt-1">
          Basado en ARPU mensual (P50: ${formatNumber(arpuStats?.p50 ?? 0, 0)} K) y Churn Rate (P50: {formatPercent(churnStats?.p50 ?? 0)})
        </p>
      </div>

      {/* Scatter plot */}
      <div className="mb-8">
        <ScatterPositioning
          data={scatterData}
          xLabel="ARPU Mensual (K COP)"
          yLabel="Churn Rate (%)"
          title="ARPU vs Churn — Mapa del Segmento"
        />
      </div>

      {/* Ranking */}
      <BenchmarkTable
        title="Ranking del Segmento"
        headers={['Club', 'Posición', ...rankingKeys.map(k => k.label)]}
        rows={rankingRows}
      />
    </div>
  )
}
