'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { NotificacaoPerdido, ItemAchado } from '@/lib/types'

export default function VincularPage() {
  const [notificacoes, setNotificacoes] = useState<NotificacaoPerdido[]>([])
  const [itens, setItens] = useState<ItemAchado[]>([])
  const [selecoes, setSelecoes] = useState<Record<string, string>>({})
  const [processando, setProcessando] = useState<string | null>(null)

  async function carregar() {
    const supabase = createClient()

    const { data: dadosNotificacoes } = await supabase
      .from('notificacoes_perdidos')
      .select('*')
      .eq('status_moderacao', 'aprovado')
      .is('item_vinculado_id', null)
      .order('criado_em', { ascending: false })

    const { data: dadosItens } = await supabase
      .from('itens_achados')
      .select('*')
      .eq('status', 'aguardando')
      .order('titulo', { ascending: true })

    setNotificacoes(dadosNotificacoes ?? [])
    setItens(dadosItens ?? [])
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleVincular(notificacaoId: string) {
    const itemId = selecoes[notificacaoId]
    if (!itemId) return

    setProcessando(notificacaoId)
    const supabase = createClient()

    await supabase
      .from('notificacoes_perdidos')
      .update({ item_vinculado_id: itemId, lida: false })
      .eq('id', notificacaoId)

    setProcessando(null)
    carregar()
  }

  if (notificacoes.length === 0) {
    return <p style={{ color: 'var(--color-slate)' }}>Nenhuma notificação aprovada aguardando vínculo.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {notificacoes.map((n) => (
        <div
          key={n.id}
          className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <div className="flex-1">
            <h3 className="font-semibold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
              {n.titulo}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-slate)' }}>{n.categoria} — {n.local_perdido ?? 'local não informado'}</p>
          </div>

          <select
            value={selecoes[n.id] ?? ''}
            onChange={(e) => setSelecoes({ ...selecoes, [n.id]: e.target.value })}
            className="px-3 py-2 rounded-md border text-sm"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <option value="">Selecione o item achado...</option>
            {itens.map((item) => (
              <option key={item.id} value={item.id}>{item.titulo} — {item.categoria}</option>
            ))}
          </select>

          <button
            onClick={() => handleVincular(n.id)}
            disabled={!selecoes[n.id] || processando === n.id}
            className="px-4 py-2 rounded-md text-white text-sm disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-azure)' }}
          >
            Vincular
          </button>
        </div>
      ))}
    </div>
  )
}