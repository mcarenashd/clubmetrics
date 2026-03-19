'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import PercentileBar from '@/components/ui/PercentileBar'
import BarComparativo from '@/components/charts/BarComparativo'
import { getClub, getSegmentoStats, getAllSegmentoClubs } from '@/lib/data'
import { getSemaforoColor, isHigherBetter, formatNumber } from '@/lib/benchmark'
import { anonymizeClubsForDisplay } from '@/lib/anonymize'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function DeportesPage() {
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

  // Barra ocupación tenis comparativo
  const allClubs = getAllSegmentoClubs(clubId)
  const anon = anonymizeClubsForDisplay(allClubs, clubId)
  const tenisBar = anon.map(a => ({
    name: a.isOwn ? 'Tu club ★' : a.label,
    value: a.club.S05_ocupacion_tenis_pct,
    isOwn: a.isOwn,
  }))
  const tenisStats = getSegmentoStats(clubId, 'S05_ocupacion_tenis_pct')

  const ocupacionKpis: { label: string; key: keyof Club; ref: string }[] = [
    { label: 'Ocupación Tenis', key: 'S05_ocupacion_tenis_pct', ref: '>65% óptimo, <40% subutilizado' },
    { label: 'Ocupación Golf', key: 'S43_ocupacion_golf_pct', ref: '>60% para clubs campestres' },
    { label: 'Ocupación Piscina', key: 'S12_ocupacion_piscina_pct', ref: 'Mayor uso = mayor retención' },
  ]

  return (
    <div>
      <PageHeader title="Deportes, Fitness y Recreación" description="Ocupación de escenarios, torneos y eficiencia deportiva" />

      {/* Inventario escenarios */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Canchas Tenis', value: club.S04_canchas_tenis },
          { label: 'Canchas Pádel', value: club.S07_canchas_padel },
          { label: 'Hoyos Golf', value: club.S33_hoyos_golf },
          { label: 'Piscinas', value: club.S11_piscinas },
          { label: 'Máquinas Gym', value: club.S42_maquinas_gym },
          { label: 'Sillas A&B', value: club.S10_sillas_ab },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-bordes p-3 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-texto-secundario mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-brand-azul">{item.value || '—'}</p>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <KPICard
          label="Torneos / Eventos Totales"
          value={club.S37_torneos_eventos_total}
          unit="/año"
          semaforo="gris"
          comparativo="Mayor actividad = mayor retención"
          tooltip={getKpiTooltip('S37_torneos_eventos_total')}
        />
        <KPICard
          label="Ratio Máquinas/Socio"
          value={club.KPI_ratio_maquinas_socio?.toFixed(3) ?? 'N/D'}
          semaforo={kpiSem('KPI_ratio_maquinas_socio')}
          comparativo="Ref: 1 máquina por 80-120 socios"
          tooltip={getKpiTooltip('KPI_ratio_maquinas_socio')}
        />
        <KPICard
          label="Socios / Cancha Tenis"
          value={formatNumber(club.KPI_socios_por_cancha_tenis, 0)}
          semaforo={kpiSem('KPI_socios_por_cancha_tenis')}
          comparativo={`Rounds/mes: ${formatNumber(club.S02_rounds_mes, 0)}`}
          tooltip={getKpiTooltip('KPI_socios_por_cancha_tenis')}
        />
      </div>

      {/* Gráfica ocupación tenis */}
      <div className="mb-8">
        <BarComparativo
          data={tenisBar}
          title="Ocupación Tenis vs Segmento (%)"
          unit="%"
          promedio={tenisStats?.promedio}
        />
      </div>

      {/* Percentile bars ocupación */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Ocupación de Escenarios — Posición en el Segmento</h3>
        {ocupacionKpis.map(o => {
          const stats = getSegmentoStats(clubId, o.key)
          if (!stats) return null
          const val = club[o.key] as number
          return (
            <div key={o.key}>
              <PercentileBar
                label={o.label}
                value={val}
                p25={stats.p25}
                p50={stats.p50}
                p75={stats.p75}
                min={stats.min}
                max={stats.max}
                unit="%"
                semaforo={kpiSem(o.key)}
              />
              <p className="text-[10px] text-texto-secundario/70 mb-3">{o.ref}</p>
            </div>
          )
        })}

        {/* Torneos por disciplina */}
        <h4 className="text-sm font-semibold text-texto-principal mt-4 mb-3">Torneos por Disciplina</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Golf', value: club.S03_torneos_golf },
            { label: 'Tenis', value: club.S06_torneos_tenis },
            { label: 'Natación', value: club.S13_torneos_natacion },
            { label: 'Billar (mesas)', value: club.S34_mesas_billar },
          ].map(t => (
            <div key={t.label} className="text-center bg-fondo-suave rounded-lg p-3">
              <p className="text-xl font-bold text-brand-azul">{t.value ?? '—'}</p>
              <p className="text-xs text-texto-secundario">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
