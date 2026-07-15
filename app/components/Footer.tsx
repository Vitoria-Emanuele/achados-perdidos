import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{ color: 'var(--color-bg)'  }}
    >
      <div
        className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
        style={{
          color: 'var(--color-slate)',
          fontFamily: 'var(--font-inter)' }}
      >
        <Image src="/logo-ci.png" alt="Centro de Informática UFPB" width={140} height={48} />
        <span> © 2026 Equipe Dev - All rights reserved</span>
      </div>
    </footer>
  )
}