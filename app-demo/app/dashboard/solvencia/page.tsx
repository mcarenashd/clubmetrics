'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import RadarDiagnostico from '@/components/charts/RadarDiagnostico'
import PercentileBar from '@/components/ui/PercentileBar'
import { getClub, getSegmentoStats } from '@/lib/data'
import { getSemaforoColor, getSemaforoAbsoluto, isHigherBetter, formatNumber, formatPercent } from '@/lib/benchmark'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function SolvenciaPage() {
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

  const kpis: { label: string; key: keyof Club; unit: string; format: (v: number) => string; ref: string }[] = [
    { label: 'EBITDA', key: 'F04_ebitda_COP_MM', unit: 'MM COP', format: v => formatNumber(v, 1), ref: '' },
    { label: 'Margen EBITDA', key: 'KPI_ebitda_margen_pct', unit: '%', format: formatPercent, ref: 'Ref 8-18%. >25% con alojamiento' },
    { label: 'Liquidez Corriente', key: 'KPI_razon_liquidez_corriente', unit: 'x', format: v => formatNumber(v, 2), ref: 'Ref >1.2x. <1.0 = riesgo iliquidez' },
    { label: 'Prueba Ácida', key: 'KPI_prueba_acida', unit: 'x', format: v => formatNumber(v, 2), ref: 'Ref >0.8x' },
    { label: 'Endeudamiento Total', key: 'KPI_indice_endeudamiento_pct', unit: '%', format: formatPercent, ref: 'Ref <50%' },
    { label: 'Cobertura Intereses', key: 'KPI_cobertura_intereses', unit: 'x', format: v => formatNumber(v, 1), ref: 'Ref >3x. <2x = estrés financiero' },
    { label: 'Deuda Neta / EBITDA', key: 'KPI_deuda_neta_ebitda', unit: 'x', format: v => formatNumber(v, 2), ref: 'Ref <3x. >3.5x = insostenible' },
    { label: 'DSO (Cartera)', key: 'K01_dso_dias', unit: 'días', format: v => formatNumber(v, 0), ref: 'Ref <45 días' },
  ]

  // Radar de salud financiera: normalizar cada eje a 0-100 usando umbrales de referencia
  function normalizarRadar(key: keyof Club, refMin: number, refMax: number, higher = true): number {
    const val = club![key] as number
    if (val == null || isNaN(val)) return 50
    const pct = Math.max(0, Math.min(100, ((val - refMin) / (refMax - refMin)) * 100))
    return higher ? Math.round(pct) : Math.round(100 - pct)
  }

  const radarData = [
    { indicador: 'Liquidez', club: normalizarRadar('KPI_razon_liquidez_corriente', 0.5, 3, true), segmento: 60 },
    { indicador: 'EBITDA %', club: normalizarRadar('KPI_ebitda_margen_pct', 0, 25, true), segmento: 55 },
    { indicador: 'Endeudamiento', club: normalizarRadar('KPI_indice_endeudamiento_pct', 0, 80, false), segmento: 50 },
    { indicador: 'Cob. Intereses', club: normalizarRadar('KPI_cobertura_intereses', 0, 8, true), segmento: 50 },
    { indicador: 'Rotación Cartera', club: normalizarRadar('K01_dso_dias', 0, 90, false), segmento: 55 },
    { indicador: 'Reserve Funding', club: normalizarRadar('KPI_reserve_funding_ratio_pct', 0, 100, true), segmento: 50 },
  ]

  return (
    <div>
      <PageHeader title="Solvencia y Salud Financiera" description="Liquidez, endeudamiento y sostenibilidad financiera del club" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.slice(0, 4).map(k => (
          <KPICard
            key={k.key}
            label={k.label}
            value={k.format(club[k.key] as number)}
            unit={k.unit}
            semaforo={getSemaforoAbsoluto(k.key, club[k.key] as number)}
            comparativo={k.ref || undefined}
            tooltip={getKpiTooltip(k.key)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <RadarDiagnostico data={radarData} />

        <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
          <h3 className="text-lg font-semibold text-texto-principal mb-4">Ratios de Solvencia</h3>
          {kpis.slice(4).map(k => {
            const stats = getSegmentoStats(clubId, k.key)
            if (!stats) return (
              <div key={k.key} className="flex justify-between items-center py-3 border-b border-bordes/50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-texto-principal">{k.label}</p>
                  <p className="text-[10px] text-texto-secundario">{k.ref}</p>
                </div>
                <span className="text-xl font-bold text-brand-azul">{k.format(club[k.key] as number)} <span className="text-sm font-normal text-texto-secundario">{k.unit}</span></span>
              </div>
            )
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
                <p className="text-[10px] text-texto-secundario/70">{k.ref}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Balances */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Estructura del Balance (MM COP)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Activo Corriente', value: club.CAP9_activo_corriente_COP_MM, color: 'text-semaforo-verde' },
            { label: 'Pasivo Corriente', value: club.CAP9_pasivo_corriente_COP_MM, color: 'text-semaforo-rojo' },
            { label: 'Activos Totales', value: club.CAP9_activos_totales_COP_MM, color: 'text-brand-azul' },
            { label: 'Gastos Financieros', value: club.CAP9_gastos_financieros_COP_MM, color: 'text-semaforo-ambar' },
          ].map(item => (
            <div key={item.label} className="text-center bg-fondo-suave rounded-lg p-3">
              <p className="text-xs text-texto-secundario mb-1">{item.label}</p>
              <p className={`text-xl font-bold ${item.color}`}>{formatNumber(item.value, 1)} MM</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
