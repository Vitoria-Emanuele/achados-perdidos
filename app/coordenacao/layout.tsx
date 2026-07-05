'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getPerfilLogado } from '@/lib/perfil'

export default function CoordenacaoLayout({ children }: { children: React.ReactNode }) {
  const [autorizado, setAutorizado] = useState<boolean | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    getPerfilLogado().then((perfil) => {
      setAutorizado(perfil?.role === 'coordenacao')
    })
  }, [])

  const abas = [
    { href: '/coordenacao/cadastrar-item', label: 'Cadastrar item' },
    { href: '/coordenacao/moderar', label: 'Moderar notificações' },
    { href: '/coordenacao/devolucoes', label: 'Registrar devolução' },
  ]

  if (autorizado === null) {
    return <div className="p-6" style={{ color: 'var(--color-slate)' }}>Carregando...</div>
  }

  if (autorizado === false) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
          Acesso restrito
        </h1>
        <p style={{ color: 'var(--color-slate)' }}>
          Esta área é reservada à coordenação do Centro de Informática.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <h1
        className="text-xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}
      >
        Painel da coordenação
      </h1>

      <nav className="flex gap-2 border-b mb-6" style={{ borderColor: 'var(--color-border)' }}>
        {abas.map((aba) => (
          <Link
            key={aba.href}
            href={aba.href}
            className="px-4 py-2 text-sm"
            style={{
              borderBottom: pathname === aba.href ? '2px solid var(--color-azure)' : '2px solid transparent',
              color: pathname === aba.href ? 'var(--color-azure)' : 'var(--color-slate)',
            }}
          >
            {aba.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  )
}