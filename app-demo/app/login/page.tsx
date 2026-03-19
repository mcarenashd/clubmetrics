'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail } from 'lucide-react'
import Image from 'next/image'

const DEMO_USERS = [
  { email: 'demo@clubmetrics.co', password: 'clubmetrics2026', clubId: 'CLB-005' },
  { email: 'admin@clubmetrics.co', password: 'admin2026', clubId: 'CLB-001' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const user = DEMO_USERS.find(
      u => u.email === email.toLowerCase().trim() && u.password === password
    )

    if (user) {
      localStorage.setItem('clubmetrics_club', user.clubId)
      localStorage.setItem('clubmetrics_email', user.email)
      router.push('/dashboard')
    } else {
      setError('Credenciales incorrectas. Intenta con demo@clubmetrics.co')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-azul-oscuro to-brand-azul px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.webp"
              alt="ClubMetrics"
              width={200}
              height={50}
              priority
            />
          </div>

          <h1 className="text-2xl font-bold text-brand-azul text-center mb-2">
            Accede a tu benchmarking
          </h1>
          <p className="text-texto-secundario text-center text-sm mb-8">
            Plataforma exclusiva para clubes participantes
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-texto-secundario mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-secundario" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-bordes rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-azul focus:border-transparent transition-shadow"
                  placeholder="demo@clubmetrics.co"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-texto-secundario mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-secundario" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-bordes rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-azul focus:border-transparent transition-shadow"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-semaforo-rojo text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-azul hover:bg-brand-azul-oscuro text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-bordes">
            <p className="text-xs text-texto-secundario text-center">
              <span className="inline-flex items-center gap-1">
                🔒 Datos protegidos · Información 100% anónima
              </span>
            </p>
            <div className="mt-3 bg-fondo-suave rounded-lg p-3">
              <p className="text-xs text-texto-secundario text-center font-medium mb-1">Credenciales demo:</p>
              <p className="text-xs text-texto-secundario text-center font-mono">
                demo@clubmetrics.co / clubmetrics2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
