'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import KPICard from '@/components/ui/KPICard'
import PercentileBar from '@/components/ui/PercentileBar'
import { getClub, getSegmentoStats, hasEnoughPeers, getSegmento } from '@/lib/data'
import { getSemaforoColor, formatNumber } from '@/lib/benchmark'
import { Club } from '@/types/club'
import { getKpiTooltip } from '@/lib/kpi-tooltips'

export default function PerfilPage() {
  const [club, setClub] = useState<Club | null>(null)
  const [clubId, setClubId] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('clubmetrics_club') ?? 'CLB-005'
    setClubId(id)
    setClub(getClub(id) ?? null)
  }, [])

  if (!club) return null
  const enough = hasEnoughPeers(clubId)

  const cupoStats = getSegmentoStats(clubId, 'KPI_indice_cupo_pct')
  const cupoSem = enough && cupoStats ? getSemaforoColor(club.KPI_indice_cupo_pct, cupoStats.p25, cupoStats.p75, true) : 'gris'

  const antiguedad = new Date().getFullYear() - club.P11_año_fundacion

  return (
    <div>
      <PageHeader
        title="Perfil Estructural"
        description={`${club.nombre_club} · ${getSegmento(club)} · Fundado en ${club.P11_año_fundacion}`}
      />

      {/* Identidad */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Tipo de club', value: club.P01_tipo_label },
          { label: 'Modelo negocio', value: club.P14_modelo_label },
          { label: 'Ciudad', value: club.P12_ciudad },
          { label: 'Antigüedad', value: `${antiguedad} años` },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-bordes shadow-sm p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-texto-secundario mb-1">{item.label}</p>
            <p className="text-lg font-semibold text-brand-azul">{item.value}</p>
          </div>
        ))}
      </div>

      {/* KPIs demográficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <KPICard
          label="Socios Titulares"
          value={formatNumber(club.C01_socios_titulares, 0)}
          comparativo={`Comunidad total: ${formatNumber(club.C02_comunidad_total, 0)}`}
          semaforo="gris"
          tooltip={getKpiTooltip('C01_socios_titulares')}
        />
        <KPICard
          label="Índice Ocupación Cupo"
          value={`${club.KPI_indice_cupo_pct?.toFixed(1) ?? 'N/D'}%`}
          comparativo={club.KPI_indice_cupo_pct > 90 ? 'Posible lista de espera' : 'Por debajo del tope'}
          semaforo={cupoSem}
          tooltip={getKpiTooltip('KPI_indice_cupo_pct')}
        />
        <KPICard
          label="Acciones Emitidas"
          value={formatNumber(club.C04_acciones_totales_emitidas, 0)}
          comparativo={`Socios nuevos año: ${formatNumber(club.C06_socios_nuevos_año, 0)}`}
          semaforo="gris"
          tooltip={getKpiTooltip('C04_acciones_totales_emitidas')}
        />
        <KPICard
          label="Área Terreno"
          value={formatNumber(club.D02_area_terreno_m2 / 1000, 1)}
          unit="mil m²"
          semaforo="gris"
        />
        <KPICard
          label="Área Construida"
          value={formatNumber(club.D03_area_construida_m2, 0)}
          unit="m²"
          comparativo={`${((club.D03_area_construida_m2 / club.D02_area_terreno_m2) * 100).toFixed(1)}% del terreno`}
          semaforo="gris"
        />
        <KPICard
          label="Sindicato"
          value={club.P10_tiene_sindicato ? 'Sí' : 'No'}
          semaforo="gris"
          comparativo={`${club.D01_sedes} sede${club.D01_sedes !== 1 ? 's' : ''}`}
        />
      </div>

      {/* Baja y nuevos socios */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5 mb-8">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Dinámica de Membresía</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-semaforo-verde">{club.C06_socios_nuevos_año}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-texto-secundario mt-1">Socios Nuevos / Año</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-semaforo-rojo">{club.C05_socios_baja_año}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-texto-secundario mt-1">Bajas / Año</p>
          </div>
          <div className="text-center">
            <p className={`text-3xl font-bold ${club.C06_socios_nuevos_año - club.C05_socios_baja_año >= 0 ? 'text-semaforo-verde' : 'text-semaforo-rojo'}`}>
              {club.C06_socios_nuevos_año - club.C05_socios_baja_año > 0 ? '+' : ''}
              {club.C06_socios_nuevos_año - club.C05_socios_baja_año}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-texto-secundario mt-1">Balance Neto</p>
          </div>
        </div>
      </div>

      {/* Percentile cupo */}
      {enough && cupoStats && (
        <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
          <h3 className="text-lg font-semibold text-texto-principal mb-4">Índice de Cupo vs Segmento</h3>
          <PercentileBar
            label="Índice de Ocupación de Cupo (%)"
            value={club.KPI_indice_cupo_pct}
            p25={cupoStats.p25}
            p50={cupoStats.p50}
            p75={cupoStats.p75}
            min={cupoStats.min}
            max={cupoStats.max}
            unit="%"
            semaforo={cupoSem}
          />
          <p className="text-xs text-texto-secundario mt-4">
            Ref: &gt;90% = posible lista de espera (alta demanda). Calculado como socios titulares / acciones emitidas × 100.
          </p>
        </div>
      )}
    </div>
  )
}
