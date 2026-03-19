import { Semaforo } from '@/types/club'

interface PercentileBarProps {
  value: number
  p25: number
  p50: number
  p75: number
  min: number
  max: number
  label: string
  unit?: string
  semaforo: Semaforo
}

const dotColor: Record<Semaforo, string> = {
  verde: 'bg-semaforo-verde',
  ambar: 'bg-semaforo-ambar',
  rojo: 'bg-semaforo-rojo',
  gris: 'bg-semaforo-gris',
}

export default function PercentileBar({
  value,
  p25,
  p50,
  p75,
  min,
  max,
  label,
  unit,
  semaforo,
}: PercentileBarProps) {
  const range = max - min || 1
  const toPercent = (v: number) => Math.max(0, Math.min(100, ((v - min) / range) * 100))

  const p25Pos = toPercent(p25)
  const p75Pos = toPercent(p75)
  const p50Pos = toPercent(p50)
  const valuePos = toPercent(value)

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-texto-principal">{label}</span>
        <span className="text-sm font-bold text-brand-azul">
          {value.toLocaleString('es-CO')} {unit ?? ''}
        </span>
      </div>
      <div className="relative h-2 bg-bordes rounded-full">
        {/* Zona P25-P75 */}
        <div
          className="absolute top-0 h-full bg-blue-300/40 rounded-full"
          style={{ left: `${p25Pos}%`, width: `${p75Pos - p25Pos}%` }}
        />
        {/* Línea P50 */}
        <div
          className="absolute top-0 h-full w-px border-l border-dashed border-texto-secundario/40"
          style={{ left: `${p50Pos}%` }}
        />
        {/* Marcador del club */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-md z-10 ${dotColor[semaforo]}`}
          style={{ left: `${valuePos}%` }}
        />
      </div>
      <div className="relative mt-1 text-[10px] text-texto-secundario/60">
        <span className="absolute" style={{ left: `${p25Pos}%`, transform: 'translateX(-50%)' }}>
          P25
        </span>
        <span className="absolute" style={{ left: `${p50Pos}%`, transform: 'translateX(-50%)' }}>
          P50
        </span>
        <span className="absolute" style={{ left: `${p75Pos}%`, transform: 'translateX(-50%)' }}>
          P75
        </span>
      </div>
    </div>
  )
}
