'use client'

import { useState, useRef, useEffect } from 'react'
import { KpiTooltip } from '@/lib/kpi-tooltips'

interface KpiTooltipIconProps {
  tooltip: KpiTooltip
}

export default function KpiTooltipIcon({ tooltip }: KpiTooltipIconProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="w-4 h-4 rounded-full bg-fondo-suave border border-bordes text-[10px] text-texto-secundario flex items-center justify-center hover:bg-brand-azul/10 hover:border-brand-azul/30 transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-brand-azul/30"
        aria-label="Más información sobre este indicador"
      >
        ?
      </button>

      {open && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white rounded-lg shadow-lg border border-bordes p-3 text-left animate-in fade-in duration-150"
          role="tooltip"
        >
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-bordes rotate-45 -mt-1" />

          <p className="text-xs text-texto-principal leading-relaxed mb-2">
            {tooltip.icon && <span className="mr-1">{tooltip.icon}</span>}
            {tooltip.desc}
          </p>
          <div className="flex items-start gap-1.5 bg-fondo-suave rounded-md px-2 py-1.5">
            <span className="text-[10px] font-bold text-brand-azul uppercase tracking-wide shrink-0 mt-px">Ref:</span>
            <p className="text-[11px] text-texto-secundario leading-snug">{tooltip.ref}</p>
          </div>
        </div>
      )}
    </div>
  )
}
