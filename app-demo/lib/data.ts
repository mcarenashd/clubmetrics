import { Club, SegmentoStats } from '@/types/club'
import { getPercentile, getSemaforoColor, isHigherBetter } from './benchmark'
import rawData from '@/data/clubmetrics_v2.json'

const data = rawData as Club[]

export function getAllClubs(): Club[] {
  return data
}

export function getClub(id: string): Club | undefined {
  return data.find(c => c.id_club === id)
}

export function getSegmento(club: Club): string {
  return `${club.P01_tipo_label} — ${club.tamaño}`
}

export function getSegmentoClubs(myClubId: string): Club[] {
  const myClub = getClub(myClubId)
  if (!myClub) return []
  const segmento = getSegmento(myClub)
  return data.filter(c => getSegmento(c) === segmento && c.id_club !== myClubId)
}

export function getAllSegmentoClubs(myClubId: string): Club[] {
  const myClub = getClub(myClubId)
  if (!myClub) return []
  const segmento = getSegmento(myClub)
  return data.filter(c => getSegmento(c) === segmento)
}

export function getSegmentoStats(myClubId: string, kpiKey: keyof Club): SegmentoStats | null {
  const peers = getSegmentoClubs(myClubId)
  const values = peers
    .map(c => c[kpiKey] as number)
    .filter(v => v != null && !isNaN(v))

  if (values.length < 2) return null

  return {
    promedio: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
    p25: getPercentile(values, 25),
    p50: getPercentile(values, 50),
    p75: getPercentile(values, 75),
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length,
  }
}

export function hasEnoughPeers(myClubId: string): boolean {
  return getAllSegmentoClubs(myClubId).length >= 5
}

/** Percentil de posición del club en su segmento (0–100). higherIsBetter ajusta dirección. */
export function getClubPercentil(
  myClubId: string,
  kpiKey: keyof Club,
  higher = true
): number {
  const myClub = getClub(myClubId)
  if (!myClub) return 50
  const myValue = myClub[kpiKey] as number
  const peers = getSegmentoClubs(myClubId)
  const allValues = [...peers.map(c => c[kpiKey] as number), myValue]
    .filter(v => v != null && !isNaN(v))
    .sort((a, b) => a - b)
  const rank = allValues.indexOf(myValue)
  const pct = Math.round((rank / Math.max(allValues.length - 1, 1)) * 100)
  return higher ? pct : 100 - pct
}

/** Cuenta KPIs críticos en rojo comparando contra el segmento */
export function getAlertasActivas(myClubId: string): number {
  const kpisMonitoreados: (keyof Club)[] = [
    'KPI_churn_rate_pct', 'KPI_ebitda_margen_pct', 'KPI_razon_liquidez_corriente',
    'KPI_reserve_funding_ratio_pct', 'KPI_nps', 'K01_dso_dias',
    'KPI_rotacion_operativa_pct', 'KPI_pct_socios_en_riesgo', 'KPI_deuda_neta_ebitda',
  ]
  let alertas = 0
  const myClub = getClub(myClubId)
  if (!myClub) return 0
  kpisMonitoreados.forEach(kpi => {
    const stats = getSegmentoStats(myClubId, kpi)
    if (!stats) return
    const value = myClub[kpi] as number
    const higher = isHigherBetter(kpi)
    const sem = getSemaforoColor(value, stats.p25, stats.p75, higher)
    if (sem === 'rojo') alertas++
  })
  return alertas
}

export const DEMO_USERS = [
  {
    email: 'demo@clubmetrics.co',
    password: 'clubmetrics2026',
    clubId: 'CLB-005',
    nombre: 'Club Campestre Bucaramanga',
    cargo: 'Gerente General',
  },
  {
    email: 'admin@clubmetrics.co',
    password: 'admin2026',
    clubId: 'CLB-001',
    nombre: 'Club Campestre El Nogal',
    cargo: 'Gerente General',
  },
]
