'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import RadarDiagnostico from '@/components/charts/RadarDiagnostico'
import { getClub, getSegmentoStats, hasEnoughPeers, getSegmento } from '@/lib/data'
import { getSemaforoColor, isHigherBetter, formatNumber, formatPercent } from '@/lib/benchmark'
import { Club } from '@/types/club'
import { AlertTriangle } from 'lucide-react'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function DashboardPage() {
  const [club, setClub] = useState<Club | null>(null)
  const [clubId, setClubId] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('clubmetrics_club') ?? 'CLB-005'
    setClubId(id)
    setClub(getClub(id) ?? null)
  }, [])

  if (!club) return null

  const enough = hasEnoughPeers(clubId)

  const kpis: {
    label: string
    key: keyof Club
    unit: string
    format: (v: number) => string
  }[] = [
    { label: 'ARPU Mensual', key: 'KPI_arpu_mensual_COP_miles', unit: 'K COP', format: (v) => formatNumber(v, 0) },
    { label: 'Churn Rate', key: 'KPI_churn_rate_pct', unit: '%', format: formatPercent },
    { label: 'Margen EBITDA', key: 'KPI_ebitda_margen_pct', unit: '%', format: formatPercent },
    { label: 'Empleados / Socio', key: 'KPI_ratio_emp_socio', unit: '', format: (v) => formatNumber(v, 2) },
    { label: 'NPS', key: 'KPI_nps', unit: 'pts', format: (v) => formatNumber(v, 0) },
    { label: 'DSO (Cartera)', key: 'K01_dso_dias', unit: 'días', format: (v) => formatNumber(v, 0) },
  ]

  const kpiData = kpis.map(k => {
    const value = club[k.key] as number
    const stats = getSegmentoStats(clubId, k.key)
    const higher = isHigherBetter(k.key)
    const semaforo = (enough && stats) ? getSemaforoColor(value, stats.p25, stats.p75, higher) : 'gris'
    const diff = stats?.promedio ? ((value - stats.promedio) / stats.promedio * 100) : 0
    const arrow = diff >= 0 ? '▲' : '▼'
    const comparativo = enough
      ? `${arrow} ${Math.abs(diff).toFixed(1)}% vs promedio segmento`
      : 'Segmento con pocos participantes'

    return { ...k, value, semaforo, comparativo, stats }
  })

  // Radar: normalizar cada KPI a 0-100 dentro del rango del segmento
  const radarData = kpiData.map(k => {
    const stats = k.stats
    if (!stats) return { indicador: k.label, club: 50, segmento: 50 }
    const range = stats.max - stats.min || 1
    const clubNorm = Math.max(0, Math.min(100, ((k.value - stats.min) / range) * 100))
    const segNorm = Math.max(0, Math.min(100, ((stats.promedio - stats.min) / range) * 100))
    return { indicador: k.label, club: Math.round(clubNorm), segmento: Math.round(segNorm) }
  })

  // Alertas: KPIs en rojo
  const alertas = kpiData.filter(k => k.semaforo === 'rojo')

  return (
    <div>
      <PageHeader
        title="Resumen Ejecutivo"
        description={`${club.nombre_club} · ${getSegmento(club)} · ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {!enough && (
        <div className="mb-6 bg-semaforo-ambar/10 border border-semaforo-ambar/30 text-semaforo-ambar rounded-lg px-4 py-3 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          Tu segmento aún tiene pocos participantes. Te notificamos cuando esté disponible.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {kpiData.map(k => (
          <KPICard
            key={k.key}
            label={k.label}
            value={k.format(k.value)}
            unit={k.unit}
            comparativo={k.comparativo}
            semaforo={k.semaforo}
            tooltip={getKpiTooltip(k.key)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar */}
        <RadarDiagnostico data={radarData} />

        {/* Alertas */}
        <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
          <h3 className="text-lg font-semibold text-texto-principal mb-4">
            Alertas activas
          </h3>
          {alertas.length === 0 ? (
            <div className="text-sm text-texto-secundario py-8 text-center">
              No hay indicadores en zona crítica. ¡Buen trabajo!
            </div>
          ) : (
            <div className="space-y-3">
              {alertas.map(a => (
                <div
                  key={a.key}
                  className="flex items-center justify-between bg-semaforo-rojo/5 border border-semaforo-rojo/20 rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-texto-principal">{a.label}</p>
                    <p className="text-xs text-texto-secundario">{a.comparativo}</p>
                  </div>
                  <span className="text-lg font-bold text-semaforo-rojo">{a.format(a.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
