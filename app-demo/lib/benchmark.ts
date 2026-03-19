import { Semaforo } from '@/types/club'

export function getPercentile(values: number[], percentile: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.floor((percentile / 100) * sorted.length)
  return sorted[Math.min(idx, sorted.length - 1)]
}

export function getSemaforoColor(
  value: number,
  p25: number,
  p75: number,
  higherIsBetter = true
): Semaforo {
  if (value == null || isNaN(value)) return 'gris'
  if (higherIsBetter) {
    if (value >= p75) return 'verde'
    if (value >= p25) return 'ambar'
    return 'rojo'
  } else {
    if (value <= p25) return 'verde'
    if (value <= p75) return 'ambar'
    return 'rojo'
  }
}

// Alias para compatibilidad con CLAUDE.md sección 10
export const getSemaforo = getSemaforoColor

/** Semáforo absoluto con umbrales sectoriales conocidos (independiente del segmento) */
export function getSemaforoAbsoluto(kpi: string, value: number): 'verde' | 'ambar' | 'rojo' {
  const thresholds: Record<string, { verde: [number, number]; ambar: [number, number] }> = {
    KPI_churn_rate_pct:            { verde: [0, 3],     ambar: [3, 5]     }, // menor mejor
    KPI_ebitda_margen_pct:         { verde: [12, 100],  ambar: [8, 12]    },
    KPI_razon_liquidez_corriente:  { verde: [1.5, 99],  ambar: [1.0, 1.5] },
    KPI_reserve_funding_ratio_pct: { verde: [70, 100],  ambar: [50, 70]   },
    KPI_nps:                       { verde: [40, 100],  ambar: [20, 40]   },
    KPI_tasa_retencion_anual_pct:  { verde: [95, 100],  ambar: [90, 95]   },
    KPI_cobertura_intereses:       { verde: [4, 99],    ambar: [2, 4]     },
    KPI_deuda_neta_ebitda:         { verde: [0, 2],     ambar: [2, 3.5]   }, // menor mejor
    KPI_pct_gasto_personal_ingr:   { verde: [0, 45],    ambar: [45, 55]   }, // menor mejor
    K01_dso_dias:                  { verde: [0, 30],    ambar: [30, 45]   }, // menor mejor
    KPI_reinversion_capex_pct:     { verde: [5, 100],   ambar: [3, 5]     },
    KPI_margen_contribucion_restaurante_pct: { verde: [25, 100], ambar: [20, 25] },
    KPI_margen_contribucion_eventos_pct:     { verde: [35, 100], ambar: [25, 35] },
    KPI_indice_cupo_pct:           { verde: [85, 100],  ambar: [70, 85]   },
    KPI_rotacion_operativa_pct:    { verde: [0, 20],    ambar: [20, 35]   }, // menor mejor
    KPI_rotacion_administrativa_pct: { verde: [0, 10],  ambar: [10, 20]   }, // menor mejor
    KPI_pct_socios_dormidos:       { verde: [0, 20],    ambar: [20, 30]   }, // menor mejor
  }
  const t = thresholds[kpi]
  if (!t) return 'verde'
  if (value >= t.verde[0] && value <= t.verde[1]) return 'verde'
  if (value >= t.ambar[0] && value <= t.ambar[1]) return 'ambar'
  return 'rojo'
}

export function getSemaforoBgClass(semaforo: Semaforo): string {
  switch (semaforo) {
    case 'verde': return 'bg-semaforo-verde'
    case 'ambar': return 'bg-semaforo-ambar'
    case 'rojo': return 'bg-semaforo-rojo'
    default: return 'bg-semaforo-gris'
  }
}

export function getSemaforoTextClass(semaforo: Semaforo): string {
  switch (semaforo) {
    case 'verde': return 'text-semaforo-verde'
    case 'ambar': return 'text-semaforo-ambar'
    case 'rojo': return 'text-semaforo-rojo'
    default: return 'text-semaforo-gris'
  }
}

// Indicadores donde MENOR es mejor
export const LOWER_IS_BETTER_KEYS = new Set([
  'KPI_churn_rate_pct',
  'K01_dso_dias',
  'KPI_ratio_emp_socio',
  'KPI_costo_mant_m2_COP',
  'KPI_gasto_sp_m2_COP',
  'KPI_rotacion_operativa_pct',
  'KPI_rotacion_administrativa_pct',
  'KPI_pct_socios_dormidos',
  'KPI_pct_socios_en_riesgo',
  'KPI_pct_acciones_alquiler',
  'KPI_ratio_cuotas_extraordinarias_pct',
  'KPI_indice_endeudamiento_pct',
  'KPI_deuda_neta_ebitda',
  'KPI_pct_gasto_personal_ingresos',
  'KPI_pct_sp_ingresos',
  'KPI_pct_impuestos_ingresos',
])

export function isHigherBetter(key: string): boolean {
  return !LOWER_IS_BETTER_KEYS.has(key)
}

export function formatNumber(value: number, decimals = 1): string {
  if (value == null || isNaN(value)) return 'N/D'
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatCurrency(value: number, unit: 'miles' | 'MM' = 'miles'): string {
  if (value == null || isNaN(value)) return 'N/D'
  const formatted = value.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `$${formatted} ${unit === 'MM' ? 'MM' : 'K'}`
}

export function formatPercent(value: number): string {
  if (value == null || isNaN(value)) return 'N/D'
  return `${value.toFixed(1)}%`
}
