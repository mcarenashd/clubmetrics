'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import ScatterPositioning from '@/components/charts/ScatterPositioning'
import PercentileBar from '@/components/ui/PercentileBar'
import { getClub, getSegmentoStats, getAllSegmentoClubs } from '@/lib/data'
import { getSemaforoColor, getSemaforoAbsoluto, isHigherBetter, formatNumber, formatPercent } from '@/lib/benchmark'
import { anonymizeClubsForDisplay } from '@/lib/anonymize'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function CapexPage() {
  const [club, setClub] = useState<Club | null>(null)
  const [clubId, setClubId] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('clubmetrics_club') ?? 'CLB-005'
    setClubId(id)
    setClub(getClub(id) ?? null)
  }, [])

  if (!club) return null

  function kpiSem(key: keyof Club) {
    const stats = getSegmentoStats(clubId, key)
    if (!stats) return 'gris' as const
    return getSemaforoColor(club![key] as number, stats.p25, stats.p75, isHigherBetter(key))
  }

  // Scatter: días reserva vs reserve funding ratio
  const allClubs = getAllSegmentoClubs(clubId)
  const anon = anonymizeClubsForDisplay(allClubs, clubId)
  const scatterData = anon.map(a => ({
    x: a.club.KPI_dias_reserva_capital ?? 0,
    y: a.club.KPI_reserve_funding_ratio_pct ?? 0,
    label: a.isOwn ? 'Tu club ★' : a.label,
    isOwn: a.isOwn,
  }))

  const kpis: { label: string; key: keyof Club; unit: string; format: (v: number) => string; ref: string }[] = [
    { label: '% CAPEX / Ingresos', key: 'KPI_reinversion_capex_pct', unit: '%', format: formatPercent, ref: 'Ref >5%. <3% = deuda invisible de infra' },
    { label: 'Reserve Funding Ratio', key: 'KPI_reserve_funding_ratio_pct', unit: '%', format: formatPercent, ref: 'Ref >70%. <50% = consume patrimonio' },
    { label: 'Días de Reserva', key: 'KPI_dias_reserva_capital', unit: 'días', format: v => formatNumber(v, 0), ref: 'Ref >60 días mínimo operativo' },
    { label: 'Reserva / Deuda', key: 'KPI_relacion_reserva_deuda', unit: 'x', format: v => formatNumber(v, 2), ref: 'Ref >0.5x' },
    { label: 'Tasa Reinversión CAPEX', key: 'KPI_tasa_reinversion_capex', unit: 'x', format: v => formatNumber(v, 2), ref: 'Ref 0.3-0.5x (CAPEX / EBITDA)' },
    { label: '% Cuota a Reserva', key: 'KPI_pct_cuota_reserva', unit: '%', format: formatPercent, ref: 'Ref >5%' },
  ]

  // Montos absolutos
  const capexMM = club.I01_capex_COP_MM
  const fondoReservaMM = club.CAP6_fondo_reserva_COP_MM
  const deudaMM = club.CAP6_deuda_total_COP_MM
  const efectivoMM = club.CAP6_efectivo_COP_MM

  return (
    <div>
      <PageHeader title="CAPEX y Reservas" description="Reinversión en infraestructura, reservas y sostenibilidad de largo plazo" />

      {/* Montos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'CAPEX Ejecutado', value: capexMM, color: 'text-brand-azul' },
          { label: 'Fondo de Reserva', value: fondoReservaMM, color: 'text-semaforo-verde' },
          { label: 'Deuda Total', value: deudaMM, color: 'text-semaforo-rojo' },
          { label: 'Efectivo', value: efectivoMM, color: 'text-semaforo-ambar' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-bordes shadow-sm p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-texto-secundario mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>{formatNumber(item.value, 1)} MM</p>
            <p className="text-xs text-texto-secundario">COP</p>
          </div>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {kpis.map(k => (
          <KPICard
            key={k.key}
            label={k.label}
            value={k.format(club[k.key] as number)}
            unit={k.unit}
            semaforo={getSemaforoAbsoluto(k.key, club[k.key] as number)}
            comparativo={k.ref}
            tooltip={getKpiTooltip(k.key)}
          />
        ))}
      </div>

      {/* Scatter */}
      <div className="mb-8">
        <ScatterPositioning
          data={scatterData}
          xLabel="Días de Reserva"
          yLabel="Reserve Funding Ratio (%)"
          title="Resiliencia Financiera — Posición en el Segmento"
        />
      </div>

      {/* Percentile bars */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Posición vs Segmento</h3>
        {['KPI_reinversion_capex_pct', 'KPI_reserve_funding_ratio_pct'].map(k => {
          const key = k as keyof Club
          const stats = getSegmentoStats(clubId, key)
          if (!stats) return null
          return (
            <PercentileBar
              key={k}
              label={kpis.find(x => x.key === key)?.label ?? k}
              value={club[key] as number}
              p25={stats.p25}
              p50={stats.p50}
              p75={stats.p75}
              min={stats.min}
              max={stats.max}
              unit="%"
              semaforo={kpiSem(key)}
            />
          )
        })}
      </div>
    </div>
  )
}
