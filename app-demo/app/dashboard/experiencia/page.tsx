'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import BarComparativo from '@/components/charts/BarComparativo'
import StackedBar100 from '@/components/charts/StackedBar100'
import PercentileBar from '@/components/ui/PercentileBar'
import { getClub, getSegmentoStats, getAllSegmentoClubs } from '@/lib/data'
import { getSemaforoColor, getSemaforoAbsoluto, isHigherBetter, formatNumber, formatPercent } from '@/lib/benchmark'
import { anonymizeClubsForDisplay } from '@/lib/anonymize'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function ExperienciaPage() {
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

  // NPS bar comparativo
  const allClubs = getAllSegmentoClubs(clubId)
  const anon = anonymizeClubsForDisplay(allClubs, clubId)
  const npsBar = anon
    .map(a => ({ name: a.isOwn ? 'Tu club ★' : a.label, value: a.club.KPI_nps, isOwn: a.isOwn }))
    .sort((a, b) => b.value - a.value)
  const npsStats = getSegmentoStats(clubId, 'KPI_nps')

  // Stacked: activos / dormidos / en riesgo
  const segmentacionData = anon.map(a => ({
    name: a.isOwn ? 'Tu club' : a.label,
    activos: a.club.KPI_pct_socios_activos ?? 0,
    dormidos: a.club.KPI_pct_socios_dormidos ?? 0,
    enRiesgo: a.club.KPI_pct_socios_en_riesgo ?? 0,
  }))

  const kpis: { label: string; key: keyof Club; unit: string; format: (v: number) => string; ref: string }[] = [
    { label: 'NPS', key: 'KPI_nps', unit: 'pts', format: v => formatNumber(v, 0), ref: '>40 excelente · <20 alerta crítica' },
    { label: 'Tasa Retención Anual', key: 'KPI_tasa_retencion_anual_pct', unit: '%', format: formatPercent, ref: 'Ref >95%' },
    { label: 'Visitas Promedio/Mes', key: 'KPI_visitas_promedio_mes', unit: 'vis/mes', format: v => formatNumber(v, 1), ref: 'Mayor = mayor engagement' },
    { label: '% Socios Activos', key: 'KPI_pct_socios_activos', unit: '%', format: formatPercent, ref: 'Ref >65% activos' },
    { label: '% Socios Dormidos', key: 'KPI_pct_socios_dormidos', unit: '%', format: formatPercent, ref: 'Ref <25%. >30% = espiral baja' },
    { label: '% Socios en Riesgo', key: 'KPI_pct_socios_en_riesgo', unit: '%', format: formatPercent, ref: 'Ref <10%' },
    { label: '% Acciones en Alquiler', key: 'KPI_pct_acciones_alquiler', unit: '%', format: formatPercent, ref: 'Ref <8%' },
    { label: 'Índice Activación Nuevos', key: 'KPI_indice_activacion_nuevos_pct', unit: '%', format: formatPercent, ref: '% con >2 visitas en primer mes' },
  ]

  return (
    <div>
      <PageHeader title="Experiencia del Socio" description="Satisfacción, fidelización y patrones de uso" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.slice(0, 4).map(k => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <BarComparativo
          data={npsBar}
          title="NPS — Ranking del Segmento"
          promedio={npsStats?.promedio}
        />
        <StackedBar100
          data={segmentacionData}
          keys={['activos', 'dormidos', 'enRiesgo']}
          labels={{ activos: 'Activos', dormidos: 'Dormidos', enRiesgo: 'En Riesgo' }}
          title="Segmentación Socios (%)"
        />
      </div>

      {/* Percentile bars */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Posición en el Segmento</h3>
        {kpis.slice(4).map(k => {
          const stats = getSegmentoStats(clubId, k.key)
          if (!stats) return null
          return (
            <div key={k.key} className="mb-4">
              <PercentileBar
                label={k.label}
                value={club[k.key] as number}
                p25={stats.p25}
                p50={stats.p50}
                p75={stats.p75}
                min={stats.min}
                max={stats.max}
                unit={k.unit}
                semaforo={kpiSem(k.key)}
              />
              <p className="text-[10px] text-texto-secundario/70 mt-0.5">{k.ref}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
