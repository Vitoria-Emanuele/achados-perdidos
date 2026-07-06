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

        <p className="text-xs truncate" style={{ color: 'var(--color-slate)', fontFamily: 'var(--font-inter)' }}>
          {notificacao.local_perdido ?? 'Local não informado'}
        </p>

        <p className="text-[10px]" style={{ fontFamily: 'var(--font-ibm-plex-mono)', color: 'var(--color-slate)' }}>
          {new Date(notificacao.data_horario_perda).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </Link>
  )
}