import { Semaforo } from '@/types/club'

const colorMap: Record<Semaforo, string> = {
  verde: 'bg-semaforo-verde/15 text-semaforo-verde',
  ambar: 'bg-semaforo-ambar/15 text-semaforo-ambar',
  rojo: 'bg-semaforo-rojo/15 text-semaforo-rojo',
  gris: 'bg-semaforo-gris/15 text-semaforo-gris',
}

const labelMap: Record<Semaforo, string> = {
  verde: 'Destacado',
  ambar: 'Promedio',
  rojo: 'Por mejorar',
  gris: 'Sin datos',
}

export default function SemaforoTag({ semaforo }: { semaforo: Semaforo }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${colorMap[semaforo]}`}
    >
      {labelMap[semaforo]}
    </span>
  )
}
