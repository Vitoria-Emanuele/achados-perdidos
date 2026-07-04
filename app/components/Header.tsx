'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [emailUsuario, setEmailUsuario] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setEmailUsuario(data.user?.email ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmailUsuario(session?.user?.email ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSair() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setEmailUsuario(null)
    window.location.href = '/'
  }

  const links = [
    { href: '/', label: 'Mural' },
    { href: '/notificar', label: 'Perdi um item' },
    { href: '/minhas-notificacoes', label: 'Minhas notificações' },
  ]

  return (
    <header className="border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuAberto(false)}>
          <Image src="/logo-achados-perdidos.png" alt="Achados e Perdidos" width={36} height={36} />
          <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
            Achados &amp; Perdidos
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:opacity-70">
              {link.label}
            </Link>
          ))}

          {emailUsuario ? (
            <div className="flex items-center gap-3">
              <span style={{ color: 'var(--color-slate)' }}>{emailUsuario}</span>
              <button onClick={handleSair} className="px-4 py-2 rounded-md text-sm border" style={{ borderColor: 'var(--color-border)' }}>
                Sair
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-md text-white text-sm" style={{ backgroundColor: 'var(--color-azure)' }}>
              Entrar
            </Link>
          )}
        </nav>

        <button className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8" onClick={() => setMenuAberto(!menuAberto)} aria-label="Abrir menu">
          <span className="w-6 h-0.5" style={{ backgroundColor: 'var(--color-navy)' }} />
          <span className="w-6 h-0.5" style={{ backgroundColor: 'var(--color-navy)' }} />
          <span className="w-6 h-0.5" style={{ backgroundColor: 'var(--color-navy)' }} />
        </button>
      </div>

      {menuAberto && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-4 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="py-2" onClick={() => setMenuAberto(false)}>
              {link.label}
            </Link>
          ))}
          {emailUsuario ? (
            <button onClick={handleSair} className="mt-2 py-2 text-left">Sair ({emailUsuario})</button>
          ) : (
            <Link href="/login" className="mt-2 px-4 py-2 rounded-md text-white text-sm text-center" style={{ backgroundColor: 'var(--color-azure)' }} onClick={() => setMenuAberto(false)}>
              Entrar
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}