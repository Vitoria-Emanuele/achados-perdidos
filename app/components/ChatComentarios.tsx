'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Comentario } from '@/lib/types'

export default function ChatComentarios({
  notificacaoId,
  comentariosIniciais,
  usuarioLogado,
}: {
  notificacaoId: string
  comentariosIniciais: Comentario[]
  usuarioLogado: boolean
}) {
  const [comentarios, setComentarios] = useState(comentariosIniciais)
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [denunciados, setDenunciados] = useState<string[]>([])

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setEnviando(false)
      return
    }

    const { data, error } = await supabase
      .from('comentarios')
      .insert({ texto, autor_id: user.id, notificacao_id: notificacaoId })
      .select('*, perfis(email)')
      .single()

    setEnviando(false)
    if (!error && data) {
      setComentarios([...comentarios, data as Comentario])
      setTexto('')
    }
  }

  async function handleDenunciar(id: string) {
    const supabase = createClient()
    await supabase.rpc('denunciar_comentario', { comentario_id: id })
    setDenunciados([...denunciados, id])
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
        Comentários
      </h3>

      <div className="flex flex-col gap-3">
        {comentarios.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--color-slate)' }}>
            Nenhum comentário ainda.
          </p>
        )}

        {comentarios.map((c) => (
          <div key={c.id} className="p-3 rounded-md" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium" style={{ color: 'var(--color-navy)' }}>
                {c.perfis?.email ?? 'Usuário'}
              </span>
              <span className="text-[10px]" style={{ fontFamily: 'var(--font-ibm-plex-mono)', color: 'var(--color-slate)' }}>
                {new Date(c.criado_em).toLocaleString('pt-BR')}
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--color-slate)' }}>{c.texto}</p>

            {usuarioLogado && (
              <button
                onClick={() => handleDenunciar(c.id)}
                disabled={denunciados.includes(c.id)}
                className="text-[11px] mt-2 underline disabled:no-underline disabled:opacity-60"
                style={{ color: '#D14343' }}
              >
                {denunciados.includes(c.id) ? 'Denunciado' : 'Denunciar'}
              </button>
            )}
          </div>
        ))}
      </div>

      {usuarioLogado ? (
        <form onSubmit={handleEnviar} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Escreva um comentário..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border text-sm"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <button
            type="submit"
            disabled={enviando}
            className="px-4 py-2 rounded-md text-white text-sm disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-azure)' }}
          >
            Enviar
          </button>
        </form>
      ) : (
        <p className="text-sm" style={{ color: 'var(--color-slate)' }}>
          <a href="/login" className="underline">Entre</a> para comentar.
        </p>
      )}
    </div>
  )
}