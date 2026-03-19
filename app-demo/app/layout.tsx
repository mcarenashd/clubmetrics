import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ClubMetrics — Benchmarking Clubes Sociales y Deportivos",
  description:
    "Compara indicadores financieros, operativos y de capital humano de tu club contra el sector. Datos anónimos, rigurosos y accionables.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-fondo-suave text-texto-principal`}>
        {children}
      </body>
    </html>
  )
}
