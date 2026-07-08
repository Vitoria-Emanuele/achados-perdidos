'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { NotificacaoPerdido } from '@/lib/types'

const statusLabel: Record<NotificacaoPerdido['status_moderacao'], string> = {
  pendente: 'Em análise',
  aprovado: 'Aprovada',
  rejeitado: 'Rejeitada',
}

export default function SininhoNotificacoes({ userId }: { userId: string }) {
  const [notificacoes, setNotificacoes] = useState<NotificacaoPerdido[]>([])
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  async function carregar() {
    const supabase = createClient()
    const { data } = await supabase
      .from('notificacoes_perdidos')
      .select('*')
      .eq('autor_id', userId)
      .order('criado_em', { ascending: false })
      .limit(10)

    setNotificacoes(data ?? [])
  }

  useEffect(() => {
    carregar()
  }, [userId])

  useEffect(() => {
    function fecharAoClicarFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', fecharAoClicarFora)
    return () => document.removeEventListener('mousedown', fecharAoClicarFora)
  }, [])

  async function handleAbrir() {
    const novoEstado = !aberto
    setAberto(novoEstado)

    if (novoEstado) {
      const naoLidas = notificacoes.filter((n) => !n.lida)
      if (naoLidas.length > 0) {
        const supabase = createClient()
        await supabase
          .from('notificacoes_perdidos')
          .update({ lida: true })
          .in('id', naoLidas.map((n) => n.id))

        setNotificacoes(notificacoes.map((n) => ({ ...n, lida: true })))
      }
    }
  }

  const naoLidas = notificacoes.filter((n) => !n.lida).length

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleAbrir} className="relative p-2" aria-label="Notificações">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'inherit' }}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {naoLidas > 0 && (
          <span
            className="absolute top-0 right-0 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white"
            style={{ backgroundColor: 'var(--color-azure)' }}
          >
            {naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg shadow-lg border z-50"
          style={{ backgroundColor: 'white', borderColor: 'var(--color-border)' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-navy)' }}>Minhas notificações</span>
          </div>

          {notificacoes.length === 0 ? (
            <p className="p-4 text-sm" style={{ color: 'var(--color-slate)' }}>
              Você ainda não notificou nenhum item perdido.
            </p>
          ) : (
            notificacoes.map((n) => (
              <Link
                key={n.id}
                href={`/notificacoes/${n.id}`}
                onClick={() => setAberto(false)}
                className="block px-4 py-3 border-b hover:opacity-80"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-navy)' }}>{n.titulo}</span>
                  {!n.lida && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-azure)' }} />
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-slate)' }}>
                  {statusLabel[n.status_moderacao]}
                  {n.item_vinculado_id && ' — encontramos uma correspondência!'}
                </p>
              </Link>
            ))
          )}

          <Link
            href="/minhas-notificacoes"
            onClick={() => setAberto(false)}
            className="block text-center py-3 text-sm"
            style={{ color: 'var(--color-azure)' }}
          >
            Ver tudo
          </Link>
        </div>
      )}
    </div>
  )
}