'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import BenchmarkTable from '@/components/ui/BenchmarkTable'
import PercentileBar from '@/components/ui/PercentileBar'
import BarComparativo from '@/components/charts/BarComparativo'
import { getClub, getSegmentoStats, getAllSegmentoClubs, hasEnoughPeers } from '@/lib/data'
import { getSemaforoColor, getSemaforoAbsoluto, isHigherBetter, formatNumber, formatPercent } from '@/lib/benchmark'
import { anonymizeClubsForDisplay } from '@/lib/anonymize'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function TarifasPage() {
  const [club, setClub] = useState<Club | null>(null)
  const [clubId, setClubId] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('clubmetrics_club') ?? 'CLB-005'
    setClubId(id)
    setClub(getClub(id) ?? null)
  }, [])

  if (!club) return null
  const enough = hasEnoughPeers(clubId)

  function kpiSem(key: keyof Club) {
    const stats = getSegmentoStats(clubId, key)
    if (!stats) return 'gris' as const
    return getSemaforoColor(club![key] as number, stats.p25, stats.p75, isHigherBetter(key))
  }

  // Márgenes de contribución
  const margenes = [
    { label: 'Mg. Restaurante', key: 'KPI_margen_contribucion_restaurante_pct' as keyof Club, ref: 'Ref >25%. <20% = revisar' },
    { label: 'Mg. Eventos', key: 'KPI_margen_contribucion_eventos_pct' as keyof Club, ref: 'Ref >35%' },
    { label: 'Mg. Deportes', key: 'KPI_margen_contribucion_deportes_pct' as keyof Club, ref: 'Margen por línea deportiva' },
  ]

  // Barra comparativa márgenes
  const allClubs = getAllSegmentoClubs(clubId)
  const anon = anonymizeClubsForDisplay(allClubs, clubId)
  const margenRestBar = anon.map(a => ({
    name: a.isOwn ? 'Tu club ★' : a.label,
    value: a.club.KPI_margen_contribucion_restaurante_pct,
    isOwn: a.isOwn,
  }))
  const margenRestStats = getSegmentoStats(clubId, 'KPI_margen_contribucion_restaurante_pct')

  // Tabla comparativa de tarifas
  const tarifaKeys: { label: string; key: keyof Club }[] = [
    { label: 'Cuota Sostenimiento', key: 'T01_cuota_sostenimiento_COP_miles' },
    { label: 'Green Fee F/S', key: 'T03_green_fee_fs_COP_miles' },
    { label: 'Green Fee Sem', key: 'T04_green_fee_sem_COP_miles' },
    { label: 'Tenis Privada', key: 'T05_clase_tenis_priv_COP_miles' },
    { label: 'Gimnasio', key: 'T07_uso_gym_COP_miles' },
    { label: 'Invitado', key: 'T02_tarifa_invitado_COP_miles' },
  ]

  const tableRows = anon.map(a => ({
    label: a.isOwn ? 'Tu club ★' : a.label,
    values: tarifaKeys.map(t => {
      const v = a.club[t.key] as number
      return v ? `$${formatNumber(v, 0)} K` : 'N/D'
    }),
    isOwn: a.isOwn,
  }))

  const dsoStats = getSegmentoStats(clubId, 'K01_dso_dias')
  const accionStats = getSegmentoStats(clubId, 'P06_valor_accion_COP_miles')

  return (
    <div>
      <PageHeader title="Tarifas, Márgenes y Servicios" description="Posicionamiento tarifario y rentabilidad por línea de servicio" />

      {/* Márgenes de contribución */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {margenes.map(m => (
          <KPICard
            key={m.key}
            label={m.label}
            value={formatPercent(club[m.key] as number)}
            semaforo={getSemaforoAbsoluto(m.key, club[m.key] as number)}
            comparativo={m.ref}
            tooltip={getKpiTooltip(m.key)}
          />
        ))}
      </div>

      {/* KPIs tarifas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <KPICard
          label="DSO (Días Cartera)"
          value={formatNumber(club.K01_dso_dias, 0)}
          unit="días"
          semaforo={getSemaforoAbsoluto('K01_dso_dias', club.K01_dso_dias)}
          comparativo={dsoStats && enough ? `Promedio segmento: ${formatNumber(dsoStats.promedio, 0)} días` : undefined}
          tooltip={getKpiTooltip('K01_dso_dias')}
        />
        <KPICard
          label="Valor Acción"
          value={`$${formatNumber(club.P06_valor_accion_COP_miles, 0)}`}
          unit="K COP"
          semaforo={accionStats ? getSemaforoColor(club.P06_valor_accion_COP_miles, accionStats.p25, accionStats.p75, true) : 'gris'}
          comparativo={accionStats && enough ? `Promedio segmento: $${formatNumber(accionStats.promedio, 0)} K` : undefined}
          tooltip={getKpiTooltip('P06_valor_accion_COP_miles')}
        />
        <KPICard
          label="Servicios / Comunidad"
          value={formatNumber(club.KPI_servicios_por_comunidad, 3)}
          semaforo={kpiSem('KPI_servicios_por_comunidad')}
          comparativo="Amplitud de oferta"
          tooltip={getKpiTooltip('KPI_servicios_por_comunidad')}
        />
      </div>

      {/* Gráfica márgenes */}
      <div className="mb-8">
        <BarComparativo
          data={margenRestBar}
          title="Margen Contribución Restaurante vs Segmento (%)"
          unit="%"
          promedio={margenRestStats?.promedio}
        />
      </div>

      {/* Tabla de tarifas */}
      <div className="mb-8">
        <BenchmarkTable
          title="Comparativo de Tarifas (K COP)"
          headers={['Club', ...tarifaKeys.map(t => t.label)]}
          rows={tableRows}
        />
      </div>

      {/* Percentile bars */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Posición vs Segmento</h3>
        {dsoStats && (
          <PercentileBar
            label="DSO — Días de Cartera"
            value={club.K01_dso_dias}
            p25={dsoStats.p25}
            p50={dsoStats.p50}
            p75={dsoStats.p75}
            min={dsoStats.min}
            max={dsoStats.max}
            unit="días"
            semaforo={kpiSem('K01_dso_dias')}
          />
        )}
        {margenes.map(m => {
          const stats = getSegmentoStats(clubId, m.key)
          if (!stats) return null
          return (
            <PercentileBar
              key={m.key}
              label={m.label}
              value={club[m.key] as number}
              p25={stats.p25}
              p50={stats.p50}
              p75={stats.p75}
              min={stats.min}
              max={stats.max}
              unit="%"
              semaforo={kpiSem(m.key)}
            />
          )
        })}
      </div>
    </div>
  )
}
