'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import PercentileBar from '@/components/ui/PercentileBar'
import BarComparativo from '@/components/charts/BarComparativo'
import StackedBar100 from '@/components/charts/StackedBar100'
import { getClub, getSegmentoStats, getAllSegmentoClubs, hasEnoughPeers } from '@/lib/data'
import { getSemaforoColor, isHigherBetter, formatNumber, formatPercent } from '@/lib/benchmark'
import { anonymizeClubsForDisplay } from '@/lib/anonymize'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function IngresosPage() {
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

  function comparativo(key: keyof Club) {
    const stats = getSegmentoStats(clubId, key)
    if (!stats || !enough) return undefined
    const val = club![key] as number
    const diff = stats.promedio ? ((val - stats.promedio) / stats.promedio * 100) : 0
    return `${diff >= 0 ? '▲' : '▼'} ${Math.abs(diff).toFixed(1)}% vs promedio`
  }

  // ARPU bar comparativo
  const allClubs = getAllSegmentoClubs(clubId)
  const anon = anonymizeClubsForDisplay(allClubs, clubId)
  const arpuBar = anon
    .map(a => ({ name: a.isOwn ? 'Tu club ★' : a.label, value: a.club.KPI_arpu_mensual_COP_miles, isOwn: a.isOwn }))
    .sort((a, b) => b.value - a.value)
  const arpuStats = getSegmentoStats(clubId, 'KPI_arpu_mensual_COP_miles')

  // Composición ingresos (stacked 100%)
  const composicionData = anon.map(a => ({
    name: a.isOwn ? 'Tu club' : a.label,
    cuotas: a.club.F02_ingresos_cuotas_COP_MM,
    ab: a.club.F03_ingresos_ab_COP_MM,
    deportivos: a.club.F05_ingresos_deportivos_COP_MM,
    eventos: a.club.F06_ingresos_eventos_COP_MM,
    torneos: a.club.F07_ingresos_torneos_COP_MM,
    derechos: a.club.F08_ingresos_derechos_COP_MM,
  }))

  // Percentile churn
  const churnStats = getSegmentoStats(clubId, 'KPI_churn_rate_pct')

  // % participación derechos en ingresos totales (CAP2 §2.4)
  const pctDerechos = club.F01_ingresos_totales_COP_MM > 0
    ? (club.F08_ingresos_derechos_COP_MM / club.F01_ingresos_totales_COP_MM) * 100
    : 0

  const kpis: { label: string; key: keyof Club; unit: string; format: (v: number) => string }[] = [
    { label: 'ARPU Mensual', key: 'KPI_arpu_mensual_COP_miles', unit: 'K COP', format: v => formatNumber(v, 0) },
    { label: 'Churn Rate', key: 'KPI_churn_rate_pct', unit: '%', format: formatPercent },
    { label: 'Depend. Cuotas', key: 'KPI_depend_cuotas_pct', unit: '%', format: formatPercent },
    { label: 'Yield Transferencia', key: 'KPI_yield_transferencia_pct', unit: '%', format: formatPercent },
    { label: 'Ratio Depend. Cuotas', key: 'KPI_ratio_depend_cuotas', unit: 'x', format: v => formatNumber(v, 2) },
    { label: 'Valor Acción', key: 'P06_valor_accion_COP_miles', unit: 'K COP', format: v => `$${formatNumber(v, 0)}` },
  ]

  return (
    <div>
      <PageHeader title="Ingresos y Membresías" description="Modelo de ingresos, monetización y salud de la membresía" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {kpis.map(k => (
          <KPICard
            key={k.key}
            label={k.label}
            value={k.format(club[k.key] as number)}
            unit={k.unit}
            comparativo={comparativo(k.key)}
            semaforo={kpiSem(k.key)}
            tooltip={getKpiTooltip(k.key)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <BarComparativo
          data={arpuBar}
          title="ARPU Mensual — Ranking del Segmento (K COP)"
          unit="K COP"
          promedio={arpuStats?.promedio}
        />
        <StackedBar100
          data={composicionData}
          keys={['cuotas', 'ab', 'deportivos', 'eventos', 'torneos', 'derechos']}
          labels={{ cuotas: 'Cuotas', ab: 'A&B', deportivos: 'Deportivos', eventos: 'Eventos', torneos: 'Torneos', derechos: 'Derechos' }}
          title="Composición de Ingresos por Fuente (%)"
        />
      </div>

      {/* Percentile bars */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Posición en el Segmento</h3>
        {enough && churnStats && (
          <PercentileBar
            label="Churn Rate Anual"
            value={club.KPI_churn_rate_pct}
            p25={churnStats.p25}
            p50={churnStats.p50}
            p75={churnStats.p75}
            min={churnStats.min}
            max={churnStats.max}
            unit="%"
            semaforo={kpiSem('KPI_churn_rate_pct')}
          />
        )}
        {enough && arpuStats && (
          <PercentileBar
            label="ARPU Mensual"
            value={club.KPI_arpu_mensual_COP_miles}
            p25={arpuStats.p25}
            p50={arpuStats.p50}
            p75={arpuStats.p75}
            min={arpuStats.min}
            max={arpuStats.max}
            unit="K COP"
            semaforo={kpiSem('KPI_arpu_mensual_COP_miles')}
          />
        )}
        <div className="mt-4 p-3 bg-fondo-suave rounded-lg">
          <p className="text-xs text-texto-secundario">
            <strong>Ref sector:</strong> Churn &lt;3% = óptimo · &lt;5% = aceptable · &gt;5% = alerta crítica. ARPU &gt;$5M COP/mes = eficiente para club campestre.
          </p>
        </div>
      </div>

      {/* % Venta de Derechos en Ingresos (CAP2 §2.4) */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5 mt-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Venta de Derechos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-fondo-suave rounded-lg p-4">
            <p className="text-xs text-texto-secundario uppercase tracking-wide font-bold mb-1">Ingresos Derechos (MM COP)</p>
            <p className="text-3xl font-bold text-brand-azul">{formatNumber(club.F08_ingresos_derechos_COP_MM, 1)}</p>
          </div>
          <div className="bg-fondo-suave rounded-lg p-4">
            <p className="text-xs text-texto-secundario uppercase tracking-wide font-bold mb-1">% Participación en Ingresos Totales</p>
            <p className={`text-3xl font-bold ${pctDerechos > 20 ? 'text-semaforo-ambar' : 'text-brand-azul'}`}>
              {formatPercent(pctDerechos)}
            </p>
            <p className="text-[10px] text-texto-secundario mt-1">Alerta si &gt;20% (dependencia de transferencias)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
