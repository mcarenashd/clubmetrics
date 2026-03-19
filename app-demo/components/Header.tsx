'use client'

import { useRouter } from 'next/navigation'
import { Lock, LogOut } from 'lucide-react'

export default function Header({ clubName }: { clubName: string }) {
  const router = useRouter()

  function handleLogout() {
    localStorage.removeItem('clubmetrics_club')
    localStorage.removeItem('clubmetrics_email')
    router.push('/login')
  }

  return (
    <header className="fixed top-0 right-0 h-16 bg-white border-b border-bordes flex items-center justify-between px-8 z-20" style={{ left: 220 }}>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-verde bg-brand-verde/10 px-3 py-1.5 rounded-full">
          <Lock className="w-3 h-3" />
          Datos protegidos
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-texto-secundario">{clubName}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-texto-secundario hover:text-semaforo-rojo transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
