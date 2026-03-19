'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import DonutDistribucion from '@/components/charts/DonutDistribucion'
import ScatterPositioning from '@/components/charts/ScatterPositioning'
import { getClub, getSegmentoStats, getAllSegmentoClubs, hasEnoughPeers } from '@/lib/data'
import { getSemaforoColor, isHigherBetter, formatNumber, formatPercent } from '@/lib/benchmark'
import { anonymizeClubsForDisplay } from '@/lib/anonymize'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function CapitalHumanoPage() {
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

  const totalEmp = (club.N05_emp_estrategico_cant ?? 0) + (club.N06_emp_ab_cant ?? 0) +
    (club.N07_emp_deportivo_indef_cant ?? 0) + (club.N08_emp_deportivo_otra_cant ?? 0) + (club.N11_emp_soporte_cant ?? 0)

  // Donut nómina por bloque
  const nominaData = [
    { name: 'Estratégico/Admin', value: club.N01_nom_estrategico_COP_miles_mes },
    { name: 'A&B', value: club.N02_nom_ab_COP_miles_mes },
    { name: 'Deportivo', value: club.N03_nom_deportivo_COP_miles_mes },
    { name: 'Soporte/Manto', value: club.N04_nom_soporte_COP_miles_mes },
  ].filter(d => d.value > 0)

  // Donut rangos salariales
  const salarioData = [
    { name: 'Hasta 1 SMLV', value: club.N12_sal_hasta_1smlv },
    { name: '1-4 SMLV', value: club.N13_sal_1a4smlv },
    { name: '4-8 SMLV', value: club.N14_sal_4a8smlv },
    { name: '8-12 SMLV', value: club.N15_sal_8a12smlv },
    { name: '12-16 SMLV', value: club.N16_sal_12a16smlv },
    { name: '>16 SMLV', value: club.N17_sal_mas16smlv },
  ].filter(d => d.value > 0)

  // Scatter: rotación vs horas de formación (comparativo segmento)
  const allClubs = getAllSegmentoClubs(clubId)
  const anon = anonymizeClubsForDisplay(allClubs, clubId)
  const scatterData = anon.map(a => ({
    x: a.club.KPI_horas_formacion_emp_año ?? 0,
    y: a.club.KPI_rotacion_operativa_pct ?? 0,
    label: a.isOwn ? 'Tu club ★' : a.label,
    isOwn: a.isOwn,
  }))

  const kpis: { label: string; key: keyof Club; unit: string; format: (v: number) => string }[] = [
    { label: 'Ratio Emp/Socio', key: 'KPI_ratio_emp_socio', unit: '', format: v => formatNumber(v, 2) },
    { label: 'Rotación Operativa', key: 'KPI_rotacion_operativa_pct', unit: '%', format: formatPercent },
    { label: 'Rotación Admva.', key: 'KPI_rotacion_administrativa_pct', unit: '%', format: formatPercent },
    { label: 'Horas Formación/Emp', key: 'KPI_horas_formacion_emp_año', unit: 'h/año', format: v => formatNumber(v, 0) },
    { label: '% Personal Fronoffice', key: 'KPI_pct_personal_frontoffice', unit: '%', format: formatPercent },
    { label: 'Nómina / Socio', key: 'KPI_nom_por_socio_COP_miles', unit: 'K COP', format: v => formatNumber(v, 0) },
  ]

  return (
    <div>
      <PageHeader title="Capital Humano" description="Eficiencia laboral, rotación, nómina y desarrollo del talento" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <KPICard label="Total Empleados" value={totalEmp} semaforo="gris" comparativo={`${club.C01_socios_titulares} socios`} tooltip={getKpiTooltip('KPI_ratio_emp_socio')} />
        {kpis.map(k => (
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
        <DonutDistribucion data={nominaData} title="Distribución Nómina por Bloque (K COP/mes)" />
        <DonutDistribucion data={salarioData} title="Distribución por Rangos Salariales" />
      </div>

      {/* Scatter rotación vs formación */}
      <div className="mb-8">
        <ScatterPositioning
          data={scatterData}
          xLabel="Horas Formación / Emp / Año"
          yLabel="Rotación Operativa (%)"
          title="Correlación Formación vs Rotación"
        />
      </div>

      {/* Distribución Front-office vs Soporte (CAP7 §7.2) */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5 mb-8">
        <h3 className="text-lg font-semibold text-texto-principal mb-1">Orientación del Equipo Humano</h3>
        <p className="text-sm text-texto-secundario mb-4">% empleados en atención directa al socio vs apoyo/soporte interno — Ref: &gt;55% front-office</p>
        <div className="grid grid-cols-2 gap-5">
          {[
            { label: '% Atención Directa al Socio', value: club.N18_pct_atencion_socio, color: 'bg-brand-azul', textColor: 'text-brand-azul', ref: '>55% = orientado al socio' },
            { label: '% Soporte y Back-office', value: club.N19_pct_soporte_back, color: 'bg-texto-secundario', textColor: 'text-texto-secundario', ref: '<45% = estructura eficiente' },
          ].map(item => (
            <div key={item.label} className="bg-fondo-suave rounded-lg p-4">
              <p className="text-xs text-texto-secundario uppercase tracking-wide font-bold mb-2">{item.label}</p>
              <p className={`text-3xl font-bold ${item.textColor} mb-2`}>{formatPercent(item.value ?? 0)}</p>
              <div className="h-2 bg-bordes rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value ?? 0}%` }} />
              </div>
              <p className="text-[10px] text-texto-secundario mt-1">{item.ref}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tipos contrato */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Tipos de Contrato</h3>
        <div className="space-y-3">
          {[
            { label: 'Indefinido tiempo completo', value: club.N20_emp_indefinido_tc },
            { label: 'Prestación de servicios', value: club.N21_emp_prestacion_servicios },
            { label: 'Indefinido no tiempo completo', value: club.N22_emp_indefinido_no_tc },
          ].map(t => {
            const total = club.N20_emp_indefinido_tc + club.N21_emp_prestacion_servicios + club.N22_emp_indefinido_no_tc
            const pct = total > 0 ? (t.value / total * 100) : 0
            return (
              <div key={t.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-texto-principal">{t.label}</span>
                  <span className="font-semibold text-brand-azul">{t.value} ({pct.toFixed(0)}%)</span>
                </div>
                <div className="h-2 bg-bordes rounded-full overflow-hidden">
                  <div className="h-full bg-brand-azul rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
        {club.P10_tiene_sindicato === 1 && (
          <p className="text-xs text-semaforo-ambar mt-4 flex items-center gap-1">
            ⚠ Este club cuenta con sindicato. % Sindicalizados: {formatPercent(club.KPI_pct_sindicalizados ?? 0)}
          </p>
        )}
      </div>
    </div>
  )
}
