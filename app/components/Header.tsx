'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

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
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}
          >
            Achados &amp; Perdidos
          </span>
        </Link>

        {/* Menu completo — só aparece em telas médias/grandes */}
        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:opacity-70">
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="px-4 py-2 rounded-md text-white text-sm"
            style={{ backgroundColor: 'var(--color-azure)' }}
          >
            Entrar
          </Link>
        </nav>

        {/* Botão hambúrguer — só aparece em telas pequenas */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Abrir menu"
        >
          <span className="w-6 h-0.5" style={{ backgroundColor: 'var(--color-navy)' }} />
          <span className="w-6 h-0.5" style={{ backgroundColor: 'var(--color-navy)' }} />
          <span className="w-6 h-0.5" style={{ backgroundColor: 'var(--color-navy)' }} />
        </button>
      </div>

      {/* Menu suspenso — aparece só quando aberto, e só em telas pequenas */}
      {menuAberto && (
        <nav
          className="md:hidden flex flex-col gap-1 px-6 pb-4 text-sm"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2"
              onClick={() => setMenuAberto(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-2 px-4 py-2 rounded-md text-white text-sm text-center"
            style={{ backgroundColor: 'var(--color-azure)' }}
            onClick={() => setMenuAberto(false)}
          >
            Entrar
          </Link>
        </nav>
      )}
    </header>
  )
}