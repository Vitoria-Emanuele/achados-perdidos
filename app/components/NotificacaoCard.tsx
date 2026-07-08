import Link from 'next/link'
import { NotificacaoPerdido } from '@/lib/types'

export default function NotificacaoCard({ notificacao }: { notificacao: NotificacaoPerdido }) {
  return (
    <Link
      href={`/notificacoes/${notificacao.id}`}
      className="rounded-xl overflow-hidden flex flex-col flex-shrink-0 w-56 sm:w-64 snap-start hover:opacity-90 transition-opacity"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--color-navy)' }}>
        {notificacao.foto_url ? (
          <img src={notificacao.foto_url} alt={notificacao.titulo} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-white opacity-60" style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>
            Sem foto
          </span>
        )}
      </div>

      <div className="border-t-2 border-dashed mx-4" style={{ borderColor: 'var(--color-border)' }} />

      <div className="p-3 flex flex-col gap-1.5">
        <span
          className="text-[9px] uppercase px-1.5 py-0.5 rounded self-start"
          style={{ fontFamily: 'var(--font-ibm-plex-mono)', backgroundColor: 'rgba(0, 180, 250, 0.12)', color: 'var(--color-azure)' }}
        >
          {notificacao.categoria}
        </span>

        <h3 className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
          {notificacao.titulo}
        </h3>

        <p
          className="text-[10px] sm:text-xs font-medium mt-1"
          style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-inter)' }}
        >
          Dados da perda:
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] sm:text-xs" style={{ color: 'var(--color-slate)' }}>
          
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          
            {notificacao.local_perdido ?? 'Local não informado'}
          
          </span>

          <span
            className="flex items-center gap-1 text-[10px] sm:text-xs"
            style={{ fontFamily: 'var(--font-ibm-plex-mono)', color: 'var(--color-slate)' }}>
            
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            
            {new Date(notificacao.data_horario_perda).toLocaleDateString('pt-BR')}
          </span>
        </div>

        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--color-azure)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Comentar
        </span>

      </div>
    </Link>
  )
}