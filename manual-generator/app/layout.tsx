import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'StandGenius - Generador de Manuales de Producción',
    description: 'Genera manuales de producción detallados para tus proyectos usando inteligencia artificial. Analiza renders y obtén listas de materiales, dimensiones y archivos de corte.',
    keywords: 'producción, manual, fabricación, IA, CNC, corte láser, stands, displays',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
