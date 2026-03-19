interface BenchmarkTableProps {
  title: string
  headers: string[]
  rows: { label: string; values: string[]; isOwn: boolean }[]
}

export default function BenchmarkTable({ title, headers, rows }: BenchmarkTableProps) {
  return (
    <div className="bg-white rounded-xl border border-bordes shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-bordes">
        <h3 className="text-lg font-semibold text-texto-principal">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-brand-azul">
              {headers.map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-white">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-bordes/50 ${
                  row.isOwn
                    ? 'bg-blue-50 border-l-[3px] border-l-brand-azul font-semibold'
                    : i % 2 === 0 ? 'bg-white' : 'bg-fondo-suave/50'
                }`}
              >
                <td className="px-4 py-3 text-sm">
                  {row.isOwn ? (
                    <span className="text-brand-azul font-semibold">{row.label}</span>
                  ) : (
                    <span className="font-mono text-xs text-texto-secundario">{row.label}</span>
                  )}
                </td>
                {row.values.map((v, j) => (
                  <td key={j} className="px-4 py-3 text-sm text-texto-principal">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 bg-fondo-suave/50 border-t border-bordes">
        <p className="text-[11px] text-texto-secundario text-center">
          Datos anonimizados · Benchmark Sectorial ClubMetrics 2026
        </p>
      </div>
    </div>
  )
}
