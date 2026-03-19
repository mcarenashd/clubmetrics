'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { getClub } from '@/lib/data'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [clubId, setClubId] = useState<string | null>(null)
  const [clubName, setClubName] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('clubmetrics_club')
    if (!id) {
      router.push('/login')
      return
    }
    setClubId(id)
    const club = getClub(id)
    setClubName(club?.nombre_club ?? 'Club')
  }, [router])

  if (!clubId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-brand-azul font-semibold">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-fondo-suave">
      <Sidebar clubName={clubName} clubId={clubId} />
      <Header clubName={clubName} />
      <main className="mt-16 p-8" style={{ marginLeft: 220 }}>
        {children}
      </main>
    </div>
  )
}
