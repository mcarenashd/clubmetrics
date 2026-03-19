'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import PercentileBar from '@/components/ui/PercentileBar'
import BarComparativo from '@/components/charts/BarComparativo'
import { getClub, getSegmentoStats, getAllSegmentoClubs, hasEnoughPeers } from '@/lib/data'
import { getSemaforoColor, isHigherBetter, formatNumber } from '@/lib/benchmark'
import { anonymizeClubsForDisplay } from '@/lib/anonymize'
import { Club } from '@/types/club'

export default function InfraestructuraPage() {
  const [club, setClub] = useState<Club | null>(null)
  const [clubId, setClubId] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('clubmetrics_club') ?? 'CLB-005'
    setClubId(id)
    setClub(getClub(id) ?? null)
  }, [])

  if (!club) return null

  const enough = hasEnoughPeers(clubId)

  // Ocupación de escenarios
  const ocupacion = [
    { label: 'Ocupación Golf', key: 'S43_ocupacion_golf_pct' as keyof Club, unit: '%' },
    { label: 'Ocupación Tenis', key: 'S05_ocupacion_tenis_pct' as keyof Club, unit: '%' },
    { label: 'Ocupación Piscina', key: 'S12_ocupacion_piscina_pct' as keyof Club, unit: '%' },
  ]

  // Bar: venta por silla A&B
  const allClubs = getAllSegmentoClubs(clubId)
  const anon = anonymizeClubsForDisplay(allClubs, clubId)
  const ventaSillaBar = anon.map(a => ({
    name: a.isOwn ? 'Tu club ★' : a.label,
    value: a.club.KPI_venta_silla_mes_COP_miles,
    isOwn: a.isOwn,
  }))
  const ventaSillaStats = getSegmentoStats(clubId, 'KPI_venta_silla_mes_COP_miles')

  // KPIs infraestructura
  const infraKpis: { label: string; value: number | string; unit: string }[] = [
    { label: 'Área Terreno', value: formatNumber(club.D02_area_terreno_m2, 0), unit: 'm²' },
    { label: 'Área Construida', value: formatNumber(club.D03_area_construida_m2, 0), unit: 'm²' },
    { label: 'Sedes', value: club.D01_sedes, unit: '' },
    { label: 'Torneos/Eventos', value: club.S37_torneos_eventos_total, unit: '/año' },
    { label: 'Máquinas Gym', value: club.S42_maquinas_gym, unit: '' },
    { label: 'Sillas A&B', value: club.S10_sillas_ab, unit: '' },
  ]

  return (
    <div>
      <PageHeader title="Infraestructura y Deportes" description="Ocupación, uso de escenarios y costos de mantenimiento" />

      {/* Inventario */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {infraKpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-bordes shadow-sm p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-texto-secundario mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-brand-azul">{k.value}</p>
            {k.unit && <p className="text-xs text-texto-secundario">{k.unit}</p>}
          </div>
        ))}
      </div>

      {/* Ocupación percentiles */}
      <div className="bg-white rounded-xl border border-bordes shadow-sm p-5 mb-8">
        <h3 className="text-lg font-semibold text-texto-principal mb-4">Ocupación de Escenarios</h3>
        {ocupacion.map(o => {
          const value = club[o.key] as number
          const stats = getSegmentoStats(clubId, o.key)
          if (!stats) return null
          const semaforo = enough ? getSemaforoColor(value, stats.p25, stats.p75, true) : 'gris'
          return (
            <PercentileBar
              key={o.key}
              label={o.label}
              value={value}
              p25={stats.p25}
              p50={stats.p50}
              p75={stats.p75}
              min={stats.min}
              max={stats.max}
              unit={o.unit}
              semaforo={semaforo}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BarComparativo
          data={ventaSillaBar}
          title="Venta por Silla A&B (K COP/mes)"
          unit="K COP"
          promedio={ventaSillaStats?.promedio}
        />

        {/* Costo mantenimiento */}
        <div className="bg-white rounded-xl border border-bordes shadow-sm p-5">
          <h3 className="text-lg font-semibold text-texto-principal mb-4">Costos por m²</h3>
          {[
            { label: 'Costo Mantenimiento / m²', key: 'KPI_costo_mant_m2_COP' as keyof Club, unit: 'COP' },
            { label: 'Gasto Serv. Públicos / m²', key: 'KPI_gasto_sp_m2_COP' as keyof Club, unit: 'COP' },
            { label: 'Socios por cancha tenis', key: 'KPI_socios_por_cancha_tenis' as keyof Club, unit: '' },
          ].map(k => {
            const value = club[k.key] as number
            const stats = getSegmentoStats(clubId, k.key)
            if (!stats) return null
            const higher = isHigherBetter(k.key)
            const semaforo = enough ? getSemaforoColor(value, stats.p25, stats.p75, higher) : 'gris'
            return (
              <PercentileBar
                key={k.key}
                label={k.label}
                value={value}
                p25={stats.p25}
                p50={stats.p50}
                p75={stats.p75}
                min={stats.min}
                max={stats.max}
                unit={k.unit}
                semaforo={semaforo}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
