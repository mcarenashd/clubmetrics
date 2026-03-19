import { Semaforo } from '@/types/club'
import SemaforoTag from './SemaforoTag'
import KpiTooltipIcon from './KpiTooltipIcon'
import { KpiTooltip } from '@/lib/kpi-tooltips'

interface KPICardProps {
  label: string
  value: string | number
  unit?: string
  comparativo?: string
  semaforo: Semaforo
  tooltip?: KpiTooltip
}

export default function KPICard({ label, value, unit, comparativo, semaforo, tooltip }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-bordes shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-texto-secundario">
            {label}
          </span>
          {tooltip && <KpiTooltipIcon tooltip={tooltip} />}
        </div>
        <SemaforoTag semaforo={semaforo} />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[34px] font-bold text-brand-azul leading-none">{value}</span>
        {unit && <span className="text-sm text-texto-secundario">{unit}</span>}
      </div>
      {comparativo && (
        <p className="text-xs text-texto-secundario">{comparativo}</p>
      )}
    </div>
  )
}
