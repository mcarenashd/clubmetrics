'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { getClub, getSegmentoStats, getClubPercentil, getAlertasActivas } from '@/lib/data'
import { getSemaforoColor, isHigherBetter } from '@/lib/benchmark'
import { Club, Semaforo } from '@/types/club'

const SEMAFORO_HEX: Record<Semaforo, string> = {
  verde: '#27AE60',
  ambar: '#F39C12',
  rojo: '#E74C3C',
  gris: '#A0AEC0',
}

function worstSemaforo(semaforos: Semaforo[]): Semaforo {
  if (semaforos.includes('rojo')) return 'rojo'
  if (semaforos.includes('ambar')) return 'ambar'
  if (semaforos.includes('verde')) return 'verde'
  return 'gris'
}

function useSidebarData(clubId: string) {
  return useMemo(() => {
    const club = getClub(clubId)
    if (!club) return null

    function kpiSem(key: keyof Club): Semaforo {
      const stats = getSegmentoStats(clubId, key)
      if (!stats) return 'gris'
      return getSemaforoColor(club![key] as number, stats.p25, stats.p75, isHigherBetter(key))
    }

    function perc(key: keyof Club): number {
      return getClubPercentil(clubId, key, isHigherBetter(key))
    }

    const alertas = getAlertasActivas(clubId)

    // Semáforos por módulo
    const semaforos = {
      resumen:       worstSemaforo([kpiSem('KPI_nps'), kpiSem('KPI_churn_rate_pct'), kpiSem('KPI_ebitda_margen_pct')]),
      perfil:        worstSemaforo([kpiSem('KPI_indice_cupo_pct'), kpiSem('KPI_churn_rate_pct')]),
      ingresos:      worstSemaforo([kpiSem('KPI_arpu_mensual_COP_miles'), kpiSem('KPI_churn_rate_pct'), kpiSem('KPI_depend_cuotas_pct')]),
      tarifas:       worstSemaforo([kpiSem('KPI_margen_contribucion_restaurante_pct'), kpiSem('KPI_margen_contribucion_eventos_pct')]),
      deportes:      worstSemaforo([kpiSem('S05_ocupacion_tenis_pct'), kpiSem('S43_ocupacion_golf_pct'), kpiSem('S12_ocupacion_piscina_pct')]),
      opex:          worstSemaforo([kpiSem('KPI_pct_gasto_personal_ingresos'), kpiSem('K01_dso_dias'), kpiSem('KPI_costo_mant_m2_COP')]),
      capex:         worstSemaforo([kpiSem('KPI_reserve_funding_ratio_pct'), kpiSem('KPI_reinversion_capex_pct')]),
      capitalHumano: worstSemaforo([kpiSem('KPI_ratio_emp_socio'), kpiSem('KPI_rotacion_operativa_pct')]),
      experiencia:   worstSemaforo([kpiSem('KPI_nps'), kpiSem('KPI_tasa_retencion_anual_pct'), kpiSem('KPI_pct_socios_dormidos')]),
      solvencia:     worstSemaforo([kpiSem('KPI_ebitda_margen_pct'), kpiSem('KPI_razon_liquidez_corriente'), kpiSem('KPI_deuda_neta_ebitda')]),
      posicion:      worstSemaforo([kpiSem('KPI_arpu_mensual_COP_miles'), kpiSem('KPI_ebitda_margen_pct'), kpiSem('KPI_nps')]),
    }

    // Subtítulos (línea 2 de cada ítem)
    const subtitles = {
      resumen:       `NPS ${club.KPI_nps} · ${alertas} alerta${alertas !== 1 ? 's' : ''}`,
      perfil:        `Cupo ${club.KPI_indice_cupo_pct?.toFixed(0) ?? 'N/D'}% · P${perc('KPI_indice_cupo_pct')}`,
      ingresos:      `ARPU $${club.KPI_arpu_mensual_COP_miles?.toFixed(0) ?? 'N/D'}K · P${perc('KPI_arpu_mensual_COP_miles')}`,
      tarifas:       `Mg restaurante ${club.KPI_margen_contribucion_restaurante_pct?.toFixed(1) ?? 'N/D'}%`,
      deportes:      `Tenis ${club.S05_ocupacion_tenis_pct?.toFixed(0) ?? 'N/D'}% ocup · P${perc('S05_ocupacion_tenis_pct')}`,
      opex:          `Personal ${club.KPI_pct_gasto_personal_ingresos?.toFixed(1) ?? 'N/D'}% ing · P${perc('KPI_pct_gasto_personal_ingresos')}`,
      capex:         `Reserve ${club.KPI_reserve_funding_ratio_pct?.toFixed(0) ?? 'N/D'}% · ${kpiSem('KPI_reserve_funding_ratio_pct') === 'rojo' ? '⚠ Alerta' : 'OK'}`,
      capitalHumano: `${club.KPI_ratio_emp_socio?.toFixed(2) ?? 'N/D'} emp/socio · P${perc('KPI_ratio_emp_socio')}`,
      experiencia:   `NPS ${club.KPI_nps} · Retención ${club.KPI_tasa_retencion_anual_pct?.toFixed(1) ?? 'N/D'}%`,
      solvencia:     `EBITDA ${club.KPI_ebitda_margen_pct?.toFixed(1) ?? 'N/D'}% · Liq ${club.KPI_razon_liquidez_corriente?.toFixed(1) ?? 'N/D'}x`,
      posicion:      `Percentil global P${Math.round([perc('KPI_arpu_mensual_COP_miles'), perc('KPI_ebitda_margen_pct'), perc('KPI_nps')].reduce((a, b) => a + b, 0) / 3)}`,
    }

    // Scoreboard global
    const allKpis: (keyof Club)[] = [
      'KPI_arpu_mensual_COP_miles', 'KPI_churn_rate_pct', 'KPI_ebitda_margen_pct',
      'KPI_ratio_emp_socio', 'KPI_nps', 'K01_dso_dias',
      'KPI_margen_contribucion_restaurante_pct', 'KPI_reserve_funding_ratio_pct',
      'KPI_razon_liquidez_corriente', 'KPI_tasa_retencion_anual_pct',
      'KPI_rotacion_operativa_pct', 'KPI_indice_cupo_pct',
      'KPI_pct_gasto_personal_ingresos', 'KPI_deuda_neta_ebitda',
    ]
    const scoreVerde = allKpis.filter(k => kpiSem(k) === 'verde').length
    const scoreAmbar = allKpis.filter(k => kpiSem(k) === 'ambar').length
    const scoreRojo = allKpis.filter(k => kpiSem(k) === 'rojo').length
    const percGeneral = Math.round(
      allKpis.reduce((sum, k) => sum + getClubPercentil(clubId, k, isHigherBetter(k)), 0) / allKpis.length
    )

    const words = club.nombre_club.split(' ').filter(w => w.length > 2)
    const initials = words.slice(0, 2).map(w => w[0].toUpperCase()).join('')

    return { club, semaforos, subtitles, scoreboard: { verde: scoreVerde, ambar: scoreAmbar, rojo: scoreRojo, percGeneral }, initials }
  }, [clubId])
}

// ─── Módulos del sidebar ─────────────────────────────────────────────────────
type SemKey = 'resumen' | 'perfil' | 'ingresos' | 'tarifas' | 'deportes' | 'opex' | 'capex' | 'capitalHumano' | 'experiencia' | 'solvencia' | 'posicion'

const NAV_ITEMS: { href: string; label: string; semKey: SemKey; ready: boolean }[] = [
  { href: '/dashboard',                  label: 'Resumen Ejecutivo', semKey: 'resumen',       ready: true },
  { href: '/dashboard/perfil',           label: 'Perfil Estructural', semKey: 'perfil',       ready: true },
  { href: '/dashboard/ingresos',         label: 'Ingresos',           semKey: 'ingresos',     ready: true },
  { href: '/dashboard/tarifas',          label: 'Tarifas y Márgenes', semKey: 'tarifas',      ready: true },
  { href: '/dashboard/deportes',         label: 'Deportes',           semKey: 'deportes',     ready: true },
  { href: '/dashboard/opex',             label: 'OPEX y Costos',      semKey: 'opex',         ready: true },
  { href: '/dashboard/capex',            label: 'CAPEX y Reservas',   semKey: 'capex',        ready: true },
  { href: '/dashboard/capital-humano',   label: 'Capital Humano',     semKey: 'capitalHumano',ready: true },
  { href: '/dashboard/experiencia',      label: 'Experiencia',        semKey: 'experiencia',  ready: true },
  { href: '/dashboard/solvencia',        label: 'Solvencia',          semKey: 'solvencia',    ready: true },
  { href: '/dashboard/posicionamiento',  label: 'Posicionamiento',    semKey: 'posicion',     ready: true },
]

export default function Sidebar({ clubName, clubId }: { clubName: string; clubId: string }) {
  const pathname = usePathname()
  const data = useSidebarData(clubId)

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-30"
      style={{ width: 220, backgroundColor: '#0D4A7A' }}
    >
      {/* Logo */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-center">
        <Image src="/logo.webp" alt="ClubMetrics" width={148} height={37} priority style={{ filter: 'brightness(1.1)' }} />
      </div>

      {/* Nav — scrollable */}
      <nav className="flex-1 px-2 py-1 space-y-px overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href
          const semaforo: Semaforo = data?.semaforos[item.semKey] ?? 'gris'
          const subtitle = data?.subtitles[item.semKey] ?? '—'

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-lg transition-all duration-150"
              style={{
                backgroundColor: isActive ? '#1464A0' : 'transparent',
                borderLeft: isActive ? '3px solid #3DC99A' : '3px solid transparent',
                padding: '7px 10px 7px 9px',
              }}
            >
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 12.5, color: isActive ? '#fff' : 'rgba(255,255,255,0.78)', fontWeight: isActive ? 500 : 400, lineHeight: 1.3 }} className="truncate">
                  {item.label}
                </p>
                {item.ready ? (
                  <p style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.38)', lineHeight: 1.3 }} className="truncate mt-0.5">
                    {subtitle}
                  </p>
                ) : (
                  <span style={{ fontSize: 9, backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', borderRadius: 4, padding: '1px 5px' }}>
                    Próximamente
                  </span>
                )}
              </div>
              {item.ready && (
                <div
                  className="flex-shrink-0 rounded-full ml-1.5"
                  style={{ width: 8, height: 8, backgroundColor: SEMAFORO_HEX[semaforo] }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Mini Scoreboard */}
      {data && (
        <div className="mx-2.5 mb-2.5 px-3 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</span>
            <span className="font-bold" style={{ fontSize: 9.5, backgroundColor: 'rgba(61,201,154,0.15)', color: '#3DC99A', borderRadius: 8, padding: '1px 6px' }}>
              P{data.scoreboard.percGeneral}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {[
              { color: '#27AE60', count: data.scoreboard.verde },
              { color: '#F39C12', count: data.scoreboard.ambar },
              { color: '#E74C3C', count: data.scoreboard.rojo },
            ].map(({ color, count }) => (
              <div key={color} className="flex items-center gap-1">
                <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: color }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.78)', fontWeight: 600 }}>{count}</span>
              </div>
            ))}
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.28)' }}>KPIs</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex-shrink-0 flex items-center justify-center rounded-full font-bold" style={{ width: 30, height: 30, backgroundColor: '#1464A0', color: '#3DC99A', fontSize: 11 }}>
          {data?.initials ?? '?'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate" style={{ fontSize: 11, color: 'rgba(255,255,255,0.80)', fontWeight: 500, lineHeight: 1.3 }}>{clubName}</p>
          <p className="font-mono" style={{ fontSize: 10, color: 'rgba(61,201,154,0.60)', lineHeight: 1.3 }}>{clubId}</p>
        </div>
      </div>
    </aside>
  )
}
