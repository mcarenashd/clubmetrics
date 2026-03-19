import { Lock } from 'lucide-react'

export default function ProtectedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-verde bg-brand-verde/10 px-3 py-1.5 rounded-full">
      <Lock className="w-3 h-3" />
      Datos protegidos
    </span>
  )
}
