type Variante = 'info' | 'atencao'

const estilos: Record<Variante, { bg: string; texto: string; borda: string }> = {
  info: {
    bg: 'rgba(0, 180, 250, 0.08)',
    texto: 'var(--color-navy)',
    borda: 'rgba(0, 180, 250, 0.35)',
  },
  atencao: {
    bg: 'rgba(209, 67, 67, 0.08)',
    texto: '#7A2323',
    borda: 'rgba(209, 67, 67, 0.35)',
  },
}

const icones: Record<Variante, React.ReactNode> = {
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-azure)" strokeWidth="2" className="flex-shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="11" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  atencao: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D14343" strokeWidth="2" className="flex-shrink-0">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
}

export default function CardAviso({ variante, texto }: { variante: Variante; texto: string }) {
  const estilo = estilos[variante]

  return (
    <div
      className="flex items-start sm:items-center gap-3 rounded-lg border px-4 py-3"
      style={{ backgroundColor: estilo.bg, borderColor: estilo.borda }}
    >
      {icones[variante]}
      <p className="text-sm" style={{ color: estilo.texto, fontFamily: 'var(--font-inter)' }}>
        {texto}
      </p>
    </div>
  )
}