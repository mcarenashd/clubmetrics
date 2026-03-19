'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import PercentileBar from '@/components/ui/PercentileBar'
import DonutDistribucion from '@/components/charts/DonutDistribucion'
import BarComparativo from '@/components/charts/BarComparativo'
import { getClub, getSegmentoStats, getAllSegmentoClubs, hasEnoughPeers } from '@/lib/data'
import { getSemaforoColor, isHigherBetter, formatNumber, formatPercent } from '@/lib/benchmark'
import { anonymizeClubsForDisplay } from '@/lib/anonymize'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function FinancieroPage() {
  const [club, setClub] = useState<Club | null>(null)
  const [clubId, setClubId] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('clubmetrics_club') ?? 'CLB-005'
    setClubId(id)
    setClub(getClub(id) ?? null)
  }, [])

  if (!club) return null

  const enough = hasEnoughPeers(clubId)

  // Donut: desglose ingresos
  const ingresosData = [
    { name: 'Cuotas', value: club.F02_ingresos_cuotas_COP_MM },
    { name: 'A&B', value: club.F03_ingresos_ab_COP_MM },
    { name: 'Deportivos', value: club.F05_ingresos_deportivos_COP_MM },
    { name: 'Eventos', value: club.F06_ingresos_eventos_COP_MM },
    { name: 'Torneos', value: club.F07_ingresos_torneos_COP_MM },
    { name: 'Derechos', value: club.F08_ingresos_derechos_COP_MM },
  ].filter(d => d.value > 0)

  // Barra comparativa EBITDA
  const allClubs = getAllSegmentoClubs(clubId)
  const anon = anonymizeClubsForDisplay(allClubs, clubId)
  const ebitdaBarData = anon.map(a => ({
    name: a.isOwn ? 'Tu club ★' : a.label,
    value: a.club.KPI_ebitda_margen_pct,
    isOwn: a.isOwn,
  }))
  const ebitdaStats = getSegmentoStats(clubId, 'KPI_ebitda_margen_pct')

  // KPIs financieros
  const financialKpis: { label: string; key: keyof Club; unit: string; format: (v: number) => string }[] = [
    { label: 'Ingresos Totales', key: 'F01_ingresos_totales_COP_MM', unit: 'MM COP', format: (v) => formatNumber(v, 0) },
    { label: 'Margen EBITDA', key: 'KPI_ebitda_margen_pct', unit: '%', format: formatPercent },
    { label: 'Dependencia Cuotas', key: 'KPI_depend_cuotas_pct', unit: '%', format: formatPercent },
    { label: 'Margen A&B', key: 'KPI_margen_ab_pct', unit: '%', format: formatPercent },
    { label: 'Reinversión CAPEX', key: 'KPI_reinversion_capex_pct', unit: '%', format: formatPercent },
    { label: 'DSO (Cartera)', key: 'K01_dso_dias', unit: 'días', format: (v) => formatNumber(v, 0) },
  ]

  // Percentile bars for gastos
  const gastoKpis: { label: string; key: keyof Club; unit: string }[] = [
    { label: 'Gasto Serv. Públicos / m²', key: 'KPI_gasto_sp_m2_COP', unit: 'COP' },
    { label: 'Costo Mantenimiento / m²', key: 'KPI_costo_mant_m2_COP', unit: 'COP' },
  ]

  return (
    <div>
      <PageHeader title="Benchmark Financiero" description="Ingresos, márgenes y estructura de gastos vs tu segmento" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {financialKpis.map(k => {
          const value = club[k.key] as number
          const stats = getSegmentoStats(clubId, k.key)
          const higher = isHigherBetter(k.key)
          const semaforo = (enough && stats) ? getSemaforoColor(value, stats.p25, stats.p75, higher) : 'gris'
          const diff = stats?.promedio ? ((value - stats.promedio) / stats.promedio * 100) : 0
          const arrow = diff >= 0 ? '▲' : '▼'
          return (
            <KPICard
              key={k.key}
              label={k.label}
              value={k.format(value)}
              unit={k.unit}
              comparativo={enough ? `${arrow} ${Math.abs(diff).toFixed(1)}% vs promedio` : undefined}
              semaforo={semaforo}
              tooltip={getKpiTooltip(k.key)}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <DonutDistribucion data={ingresosData} title="Desglose de Ingresos (MM COP)" />
        <BarComparativo
          data={ebitdaBarData}
          title="Margen EBITDA vs Segmento"
          unit="%"
          promedio={ebitdaStats?.promedio}
        />
      </div>

      {/* Percentile bars */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Gastos Operativos — Posición en el Segmento</h3>
        {gastoKpis.map(k => {
          const value = club[k.key] as number
          const stats = getSegmentoStats(clubId, k.key)
          if (!stats) return null
          const higher = isHigherBetter(k.key)
          const semaforo = enough ? getSemaforoColor(value, stats.p25, stats.p75, higher) : 'gris'
          return (
            <PercentileBar
              key={k.key}
              label={k.label}
              value={value}
              p25={stats.p25}
              p50={stats.p50}
              p75={stats.p75}
              min={stats.min}
              max={stats.max}
              unit={k.unit}
              semaforo={semaforo}
            />
          )
        })}
      </div>
    </div>
  )
}
