'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { NotificacaoPerdido } from '@/lib/types'

export default function ModerarPage() {
  const [notificacoes, setNotificacoes] = useState<NotificacaoPerdido[]>([])
  const [carregando, setCarregando] = useState(true)
  const [processando, setProcessando] = useState<string | null>(null)

  async function carregar() {
    setCarregando(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('notificacoes_perdidos')
      .select('*')
      .eq('status_moderacao', 'pendente')
      .order('criado_em', { ascending: true })

    setNotificacoes(data ?? [])
    setCarregando(false)
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleModerar(id: string, decisao: 'aprovado' | 'rejeitado', removerFoto = false) {
    setProcessando(id)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const atualizacao: Record<string, unknown> = {
      status_moderacao: decisao,
      moderado_por: user?.id,
      lida: false,
    }
    
    if (removerFoto) atualizacao.foto_url = null

    await supabase.from('notificacoes_perdidos').update(atualizacao).eq('id', id)

    setProcessando(null)
    carregar()
  }

  if (carregando) {
    return <p style={{ color: 'var(--color-slate)' }}>Carregando...</p>
  }

  if (notificacoes.length === 0) {
    return <p style={{ color: 'var(--color-slate)' }}>Nenhuma notificação pendente no momento.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {notificacoes.map((n) => (
        <div
          key={n.id}
          className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          {n.foto_url && (
            <img src={n.foto_url} alt={n.titulo} className="w-full sm:w-32 h-32 object-cover rounded-md" />
          )}

          <div className="flex-1">
            <span
              className="text-[10px] uppercase px-2 py-0.5 rounded"
              style={{ fontFamily: 'var(--font-ibm-plex-mono)', backgroundColor: 'rgba(0, 180, 250, 0.12)', color: 'var(--color-azure)' }}
            >
              {n.categoria}
            </span>
            <h3 className="font-semibold mt-1" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
              {n.titulo}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-slate)' }}>{n.descricao}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-slate)' }}>
              {n.local_perdido ?? 'Local não informado'} — {new Date(n.data_horario_perda).toLocaleDateString('pt-BR')}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => handleModerar(n.id, 'aprovado')}
                disabled={processando === n.id}
                className="px-3 py-1.5 rounded-md text-white text-sm disabled:opacity-60"
                style={{ backgroundColor: 'var(--color-azure)' }}
              >
                Aprovar
              </button>

              {n.foto_url && (
                <button
                  onClick={() => handleModerar(n.id, 'aprovado', true)}
                  disabled={processando === n.id}
                  className="px-3 py-1.5 rounded-md text-sm border disabled:opacity-60"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}
                >
                  Aprovar sem foto
                </button>
              )}

              <button
                onClick={() => handleModerar(n.id, 'rejeitado')}
                disabled={processando === n.id}
                className="px-3 py-1.5 rounded-md text-sm border disabled:opacity-60"
                style={{ borderColor: '#D14343', color: '#D14343' }}
              >
                Rejeitar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}