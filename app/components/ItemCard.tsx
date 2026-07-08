import { ItemAchado } from '@/lib/types'

const statusConfig: Record<ItemAchado['status'], { label: string; color: string }> = {
  aguardando: { label: 'Aguardando', color: 'var(--color-azure)' },
  devolvido: { label: 'Devolvido', color: 'var(--color-slate)' },
  doado: { label: 'Doado', color: '#9CA9B2' },
  triturado: { label: 'Triturado', color: '#9CA9B2' },
}

export default function ItemCard({ item }: { item: ItemAchado }) {
  const status = statusConfig[item.status]

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      {/* Foto — por enquanto <img> comum; trocamos por next/image quando as fotos vierem do Supabase Storage */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover" />
      </div>

      {/* linha tracejada, remete à etiqueta destacável */}
    <div className="border-t-2 border-dashed mx-4" style={{ borderColor: 'var(--color-border)' }} />
        <div className="p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 flex-1">
            <div className="flex items-center justify-between gap-2">
                <span
                className="text-[9px] sm:text-[11px] uppercase px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap"
                style={{
                    fontFamily: 'var(--font-ibm-plex-mono)',
                    backgroundColor: 'rgba(0, 180, 250, 0.12)',
                    color: 'var(--color-azure)',
                }}
                >
                {item.categoria}
                </span>

                <span className="flex items-center gap-1 text-[10px] sm:text-xs whitespace-nowrap" style={{ color: 'var(--color-slate)' }}>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full inline-block" style={{ backgroundColor: status.color }} />
                {status.label}
                </span>
            </div>

            <h3
              className="text-sm sm:text-base font-semibold truncate"
              style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}
            >
              {item.titulo}
            </h3>

            <p
              className="text-xs sm:text-sm line-clamp-2"
              style={{ color: 'var(--color-slate)', fontFamily: 'var(--font-inter)' }}
            >
              Descrição: {item.descricao}
            </p>

            <p
              className="text-[10px] sm:text-xs font-medium mt-1"
              style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-inter)' }}
            >
              Dados do encontro:
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] sm:text-xs" style={{ color: 'var(--color-slate)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {item.local_encontrado ?? 'Local não informado'}
              </span>

              <span className="flex items-center gap-1 text-[10px] sm:text-xs" style={{ fontFamily: 'var(--font-ibm-plex-mono)', color: 'var(--color-slate)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {new Date(item.data_horario_achado).toLocaleDateString('pt-BR')}
              </span>
            </div>
        </div>
    </div>
  )
}