'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

type Perfil = {
  email: string
  role: 'aluno' | 'coordenacao'
}

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [perfil, setPerfil] = useState<Perfil | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function carregarPerfil() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setPerfil(null)
        return
      }

      const { data } = await supabase
        .from('perfis')
        .select('email, role')
        .eq('id', user.id)
        .single()

      setPerfil(data)
    }

    carregarPerfil()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      carregarPerfil()
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSair() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setPerfil(null)
    window.location.href = '/'
  }

  const linksVisitanteEAluno = [
    { href: '/', label: 'Mural' },
    { href: '/notificar', label: 'Perdi um item' },
    { href: '/minhas-notificacoes', label: 'Minhas notificações' },
  ]
  
  const linksCoordenacao = [
    { href: '/', label: 'Mural' },
    { href: '/coordenacao/cadastrar-item', label: 'Painel da coordenação' },
  ]
  
  const linksVisiveis = perfil?.role === 'coordenacao' ? linksCoordenacao : linksVisitanteEAluno
  

  return (
    <header style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuAberto(false)}>
          <Image src="/logo-apci.svg" alt="Achados e Perdidos" width={60} height={60} />

        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
          {linksVisiveis.map((link) => (
            <Link key={link.href} href={link.href} className="hover:opacity-70">
              {link.label}
            </Link>
          ))}

          {perfil ? (
            <div className="flex items-center gap-3">
              <span style={{ color: 'var(--color-slate)' }}>               
                {perfil.role === 'coordenacao' && (
                  <span
                    className="ml-2 text-[10px] uppercase px-1.5 py-0.5 rounded"
                    style={{ fontFamily: 'var(--font-ibm-plex-mono)', backgroundColor: 'rgba(0, 180, 250, 0.12)', color: 'var(--color-azure)' }}
                  >
                    coordenação
                  </span>
                )}
              </span>
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
          {linksVisiveis.map((link) => (
            <Link key={link.href} href={link.href} className="py-2" onClick={() => setMenuAberto(false)}>
              {link.label}
            </Link>
          ))}
          {perfil ? (
            <button onClick={handleSair} className="mt-2 py-2 text-left">Sair ({perfil.email})</button>
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