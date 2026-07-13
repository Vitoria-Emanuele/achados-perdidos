'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { NotificacaoPerdido } from '@/lib/types'

const statusConfig: Record<NotificacaoPerdido['status_moderacao'], { label: string; color: string }> = {
  pendente: { label: 'Em análise', color: 'var(--color-slate)' },
  aprovado: { label: 'Aprovada', color: 'var(--color-azure)' },
  rejeitado: { label: 'Rejeitada', color: '#D14343' },
}

export default function MinhasNotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<NotificacaoPerdido[]>([])
  const [carregando, setCarregando] = useState(true)
  const [logado, setLogado] = useState<boolean | null>(null)

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLogado(false)
        setCarregando(false)
        return
      }

      setLogado(true)

      const { data } = await supabase
        .from('notificacoes_perdidos')
        .select('*')
        .eq('autor_id', user.id)
        .order('criado_em', { ascending: false })

      setNotificacoes(data ?? [])
      setCarregando(false)
    }

    carregar()
  }, [])

  if (carregando) {
    return <p className="max-w-2xl mx-auto px-6 py-10" style={{ color: 'var(--color-slate)' }}>Carregando...</p>
  }

  if (logado === false) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
          Entre para ver suas notificações
        </h1>
        <Link href="/login" className="underline text-sm" style={{ color: 'var(--color-azure)' }}>
          Fazer login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}
      >
        Minhas notificações
      </h1>

      {notificacoes.length === 0 ? (
        <div>
          <p style={{ color: 'var(--color-slate)' }}>Você ainda não notificou nenhum item perdido.</p>
          <Link href="/notificar" className="underline text-sm mt-2 inline-block" style={{ color: 'var(--color-azure)' }}>
            Notificar um item perdido
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notificacoes.map((n) => {
            const status = statusConfig[n.status_moderacao]
            return (
              <Link
                key={n.id}
                href={`/notificacoes/${n.id}`}
                className="flex items-center gap-4 p-4 rounded-lg border hover:opacity-90"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
              >
                {n.foto_url ? (
                  <img src={n.foto_url} alt={n.titulo} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                ) : (
                  <div
                    className="w-16 h-16 rounded-md flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-navy)' }}
                  >
                    <span className="text-[9px] text-white opacity-60" style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>
                      Sem foto
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
                    {n.titulo}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--color-slate)' }}>
                    {new Date(n.data_horario_perda).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs" style={{ color: status.color }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: status.color }} />
                    {status.label}
                  </span>
                  {n.item_vinculado_id && (
                    <span className="text-[10px]" style={{ color: 'var(--color-azure)' }}>Correspondência encontrada!</span>
                  )}
                  {!n.lida && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-azure)' }} />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}