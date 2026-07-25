'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Comentario } from '@/lib/types'

export default function ComentariosDenunciadosPage() {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [processando, setProcessando] = useState<string | null>(null)

  async function carregar() {
    const supabase = createClient()
    const { data } = await supabase
      .from('comentarios')
      .select('*, perfis(email), notificacoes_perdidos(titulo)')
      .eq('denunciado', true)
      .eq('status', 'visivel')
      .order('criado_em', { ascending: false })

    setComentarios(data ?? [])
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleRemover(id: string) {
    setProcessando(id)
    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser()

    await supabase.from('comentarios').update({ status: 'removido', moderado_por: user?.id, moderado_em: new Date().toISOString() }).eq('id', id)
    setProcessando(null)
    carregar()
  }

  async function handleManter(id: string) {
    setProcessando(id)
    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser()

    await supabase.from('comentarios').update({ denunciado: false, moderado_por: user?.id, moderado_em: new Date().toISOString() }).eq('id', id)
    setProcessando(null)
    carregar()
  }

  if (comentarios.length === 0) {
    return <p style={{ color: 'var(--color-slate)' }}>Nenhum comentário denunciado no momento.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {comentarios.map((c) => (
        <div
          key={c.id}
          className="p-4 rounded-lg border"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <Link
            href={`/notificacoes/${c.notificacao_id}`}
            className="text-xs underline inline-block mb-2"
            style={{ color: 'var(--color-azure)' }}
          >
            Ver notificação: {c.notificacoes_perdidos?.titulo ?? 'notificação'}
          </Link>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--color-navy)' }}>
              {c.perfis?.email ?? 'Usuário'}
            </span>
            <span className="text-[10px]" style={{ fontFamily: 'var(--font-ibm-plex-mono)', color: 'var(--color-slate)' }}>
              {new Date(c.criado_em).toLocaleString('pt-BR')}
            </span>
          </div>

          <p className="text-sm mt-2" style={{ color: 'var(--color-slate)' }}>{c.texto}</p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleRemover(c.id)}
              disabled={processando === c.id}
              className="px-3 py-1.5 rounded-md text-white text-sm disabled:opacity-60"
              style={{ backgroundColor: '#D14343' }}
            >
              Remover comentário
            </button>
            <button
              onClick={() => handleManter(c.id)}
              disabled={processando === c.id}
              className="px-3 py-1.5 rounded-md text-sm border disabled:opacity-60"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}
            >
              Manter (ignorar denúncia)
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}