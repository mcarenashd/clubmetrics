'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import PercentileBar from '@/components/ui/PercentileBar'
import DonutDistribucion from '@/components/charts/DonutDistribucion'
import { getClub, getSegmentoStats, hasEnoughPeers } from '@/lib/data'
import { getSemaforoColor, isHigherBetter, formatNumber, formatPercent } from '@/lib/benchmark'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function OpexPage() {
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

  function comparativoStr(key: keyof Club) {
    const stats = getSegmentoStats(clubId, key)
    if (!stats || !enough) return undefined
    const val = club![key] as number
    const diff = stats.promedio ? ((val - stats.promedio) / stats.promedio * 100) : 0
    return `${diff >= 0 ? '▲' : '▼'} ${Math.abs(diff).toFixed(1)}% vs promedio`
  }

  // Donut distribución OPEX
  const opexDonut = [
    { name: 'Serv. Públicos', value: club.G01_gasto_sp_COP_MM },
    { name: 'Mantenimiento', value: club.G02_gasto_mant_COP_MM },
    { name: 'Predial', value: club.G03_gasto_predial_COP_MM },
    { name: 'Inventarios', value: club.G04_inventarios_COP_MM },
    { name: 'Costo A&B', value: club.G05_costo_directo_ab_COP_MM },
  ].filter(d => d.value > 0)

  const kpis: { label: string; key: keyof Club; unit: string; format: (v: number) => string; ref: string }[] = [
    { label: '% Personal / Ingresos', key: 'KPI_pct_gasto_personal_ingresos', unit: '%', format: formatPercent, ref: 'Ref 40-55%. >55% = sobredotado' },
    { label: '% Serv. Públicos / Ingresos', key: 'KPI_pct_sp_ingresos', unit: '%', format: formatPercent, ref: 'Ref 8-15% según tipo club' },
    { label: '% Predial / Ingresos', key: 'KPI_pct_impuestos_ingresos', unit: '%', format: formatPercent, ref: 'Ref 4-8%' },
    { label: '% Mantenimiento / Ingresos', key: 'KPI_pct_mant_ingresos', unit: '%', format: formatPercent, ref: 'Ref 7-12%' },
    { label: '% Mantenimiento Preventivo', key: 'KPI_pct_mant_preventivo', unit: '%', format: formatPercent, ref: 'Ref >60% preventivo = proactivo' },
    { label: 'DSO (Días Cartera)', key: 'K01_dso_dias', unit: 'días', format: v => formatNumber(v, 0), ref: 'Alerta >45 días' },
    { label: '% Inventarios / Ingresos', key: 'KPI_pct_inventario_ingresos', unit: '%', format: formatPercent, ref: 'Ref 3-6%' },
    { label: 'Costo Mant. / m²', key: 'KPI_costo_mant_m2_COP', unit: 'COP', format: v => formatNumber(v, 0), ref: 'Menor = más eficiente' },
  ]

  // Gasto SP per cápita por socio (CAP5 §5.6)
  const spPerCapita = club.C02_comunidad_total > 0
    ? (club.G01_gasto_sp_COP_MM * 1000) / club.C02_comunidad_total
    : 0

  return (
    <div>
      <PageHeader title="OPEX y Costos" description="Estructura y eficiencia de los principales rubros de gasto operativo" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.slice(0, 4).map(k => (
          <KPICard
            key={k.key}
            label={k.label}
            value={k.format(club[k.key] as number)}
            unit={k.unit}
            comparativo={comparativoStr(k.key)}
            semaforo={kpiSem(k.key)}
            tooltip={getKpiTooltip(k.key)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <DonutDistribucion data={opexDonut} title="Distribución Gastos Operativos (MM COP)" />

        <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
          <h3 className="text-lg font-semibold text-texto-principal mb-4">Indicadores OPEX vs Segmento</h3>
          {kpis.slice(4).map(k => {
            const stats = getSegmentoStats(clubId, k.key)
            if (!stats) return null
            return (
              <div key={k.key} className="mb-4">
                <PercentileBar
                  label={`${k.label}`}
                  value={club[k.key] as number}
                  p25={stats.p25}
                  p50={stats.p50}
                  p75={stats.p75}
                  min={stats.min}
                  max={stats.max}
                  unit={k.unit}
                  semaforo={kpiSem(k.key)}
                />
                <p className="text-[10px] text-texto-secundario/70 mt-1">{k.ref}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Gastos en MM COP */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Gastos en Valores Absolutos (MM COP)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {opexDonut.map(item => (
            <div key={item.name} className="text-center bg-fondo-suave rounded-lg p-3">
              <p className="text-sm font-bold text-texto-secundario">{item.name}</p>
              <p className="text-xl font-bold text-brand-azul mt-1">{formatNumber(item.value, 1)} MM</p>
            </div>
          ))}
        </div>
      </div>

      {/* Eficiencia SP per cápita (CAP5 §5.6) */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5 mt-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-1">Eficiencia Servicios Públicos per Cápita</h3>
        <p className="text-sm text-texto-secundario mb-4">Gasto en SP dividido entre la comunidad total de socios</p>
        <div className="flex items-end gap-6">
          <div>
            <p className="text-xs text-texto-secundario uppercase tracking-wide font-bold mb-1">SP / Socio / Año</p>
            <p className="text-3xl font-bold text-brand-azul">{formatNumber(spPerCapita, 0)} <span className="text-base font-normal text-texto-secundario">K COP</span></p>
          </div>
          <div className="flex-1 p-3 bg-fondo-suave rounded-lg">
            <p className="text-xs text-texto-secundario">
              Gasto total SP: <strong>{formatNumber(club.G01_gasto_sp_COP_MM, 1)} MM COP</strong> · Comunidad: <strong>{formatNumber(club.C02_comunidad_total, 0)} socios</strong>
            </p>
            <p className="text-xs text-texto-secundario mt-1">Referencia: permite comparar eficiencia energética normalizada por tamaño de comunidad.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
