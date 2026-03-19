'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import DonutDistribucion from '@/components/charts/DonutDistribucion'
import BarComparativo from '@/components/charts/BarComparativo'
import { getClub, getSegmentoStats, getAllSegmentoClubs, hasEnoughPeers } from '@/lib/data'
import { getSemaforoColor, isHigherBetter, formatNumber } from '@/lib/benchmark'
import { anonymizeClubsForDisplay } from '@/lib/anonymize'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function NominaPage() {
  const [club, setClub] = useState<Club | null>(null)
  const [clubId, setClubId] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('clubmetrics_club') ?? 'CLB-005'
    setClubId(id)
    setClub(getClub(id) ?? null)
  }, [])

  if (!club) return null

  const enough = hasEnoughPeers(clubId)

  // Distribución de nómina
  const nominaData = [
    { name: 'Estratégico/Admin', value: club.N01_nom_estrategico_COP_miles_mes },
    { name: 'A&B', value: club.N02_nom_ab_COP_miles_mes },
    { name: 'Deportivo', value: club.N03_nom_deportivo_COP_miles_mes },
    { name: 'Soporte/Manto', value: club.N04_nom_soporte_COP_miles_mes },
  ].filter(d => d.value > 0)

  // Distribución salarial
  const salarioData = [
    { name: 'Hasta 1 SMLV', value: club.N12_sal_hasta_1smlv },
    { name: '1-4 SMLV', value: club.N13_sal_1a4smlv },
    { name: '4-8 SMLV', value: club.N14_sal_4a8smlv },
    { name: '8-12 SMLV', value: club.N15_sal_8a12smlv },
    { name: '12-16 SMLV', value: club.N16_sal_12a16smlv },
    { name: '+16 SMLV', value: club.N17_sal_mas16smlv },
  ].filter(d => d.value > 0)

  // Barra comparativa ratio empleados/socio
  const allClubs = getAllSegmentoClubs(clubId)
  const anon = anonymizeClubsForDisplay(allClubs, clubId)
  const ratioBarData = anon.map(a => ({
    name: a.isOwn ? 'Tu club ★' : a.label,
    value: a.club.KPI_ratio_emp_socio,
    isOwn: a.isOwn,
  }))
  const ratioStats = getSegmentoStats(clubId, 'KPI_ratio_emp_socio')

  // KPIs nómina
  const totalEmpleados = club.N05_emp_estrategico_cant + club.N06_emp_ab_cant +
    club.N07_emp_deportivo_indef_cant + club.N08_emp_deportivo_otra_cant + club.N11_emp_soporte_cant

  const nominaKpis: { label: string; key: keyof Club; unit: string; format: (v: number) => string }[] = [
    { label: 'Ratio Emp/Socio', key: 'KPI_ratio_emp_socio', unit: '', format: (v) => formatNumber(v, 2) },
    { label: 'Nómina / Socio', key: 'KPI_nom_por_socio_COP_miles', unit: 'K COP', format: (v) => formatNumber(v, 0) },
    { label: 'Ingreso / COP Nómina', key: 'KPI_ingreso_por_COP_nom', unit: '', format: (v) => formatNumber(v, 2) },
  ]

  return (
    <div>
      <PageHeader title="Capital Humano" description="Estructura de nómina, empleados y productividad laboral" />

      {/* KPI resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <KPICard
          label="Total Empleados"
          value={totalEmpleados}
          semaforo="gris"
          comparativo={`${club.C01_socios_titulares} socios titulares`}
          tooltip={getKpiTooltip('KPI_ratio_emp_socio')}
        />
        {nominaKpis.map(k => {
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
        <DonutDistribucion data={nominaData} title="Distribución Nómina por Bloque (K COP/mes)" />
        <BarComparativo
          data={ratioBarData}
          title="Ratio Empleados/Socio vs Segmento"
          promedio={ratioStats?.promedio}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DonutDistribucion data={salarioData} title="Distribución por Rangos Salariales" />

        {/* Tipos de contrato */}
        <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
          <h3 className="text-lg font-semibold text-texto-principal mb-4">Tipos de Contrato</h3>
          <div className="space-y-4">
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
                    <div
                      className="h-full bg-brand-azul rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
