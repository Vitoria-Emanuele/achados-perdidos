import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-achados-perdidos.png" alt="Achados e Perdidos" width={36} height={36} />
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}
          >
            Achados &amp; Perdidos
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
          <Link href="/" className="hover:opacity-70">Mural</Link>
          <Link href="/notificar" className="hover:opacity-70">Perdi um item</Link>
          <Link href="/minhas-notificacoes" className="hover:opacity-70">Minhas notificações</Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-md text-white text-sm"
            style={{ backgroundColor: 'var(--color-azure)' }}
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  )
}