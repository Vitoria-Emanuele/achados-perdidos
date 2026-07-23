'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function SininhoCoordenacao() {
  const [pendentesModeracao, setPendentesModeracao] = useState(0)
  const [pendentesVinculo, setPendentesVinculo] = useState(0)
  const [aberto, setAberto] = useState(false)
  const [pendentesComentarios, setPendentesComentarios] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  


  async function carregar() {
    const supabase = createClient()

    const { count: moderacao } = await supabase
      .from('notificacoes_perdidos')
      .select('*', { count: 'exact', head: true })
      .eq('status_moderacao', 'pendente')

    const { count: vinculo } = await supabase
      .from('notificacoes_perdidos')
      .select('*', { count: 'exact', head: true })
      .eq('status_moderacao', 'aprovado')
      .is('item_vinculado_id', null)

    setPendentesModeracao(moderacao ?? 0)
    setPendentesVinculo(vinculo ?? 0)

    const { count: comentarios } = await supabase
      .from('comentarios')
      .select('*', { count: 'exact', head: true })
      .eq('denunciado', true)
      .eq('status', 'visivel')

    setPendentesComentarios(comentarios ?? 0)
  }

  useEffect(() => {
    carregar()
    const intervalo = setInterval(carregar, 60000) // atualiza a cada 1 min
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    function fecharAoClicarFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', fecharAoClicarFora)
    return () => document.removeEventListener('mousedown', fecharAoClicarFora)
  }, [])

  const total = pendentesModeracao + pendentesVinculo + pendentesComentarios

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setAberto(!aberto)} className="relative p-2" aria-label="Pendências">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {total > 0 && (
          <span
            className="absolute top-0 right-0 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white"
            style={{ backgroundColor: '#D14343' }}
          >
            {total}
          </span>
        )}
      </button>

      {aberto && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg border z-50"
          style={{ backgroundColor: 'white', borderColor: 'var(--color-border)' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-navy)' }}>Pendências</span>
          </div>

          <Link
            href="/coordenacao/moderar"
            onClick={() => setAberto(false)}
            className="flex items-center justify-between px-4 py-3 border-b hover:opacity-80"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span className="text-sm" style={{ color: 'var(--color-navy)' }}>Notificações para moderar</span>
            <span className="text-sm font-semibold" style={{ color: pendentesModeracao > 0 ? '#D14343' : 'var(--color-slate)' }}>
              {pendentesModeracao}
            </span>
          </Link>

          <Link
            href="/coordenacao/vincular"
            onClick={() => setAberto(false)}
            className="flex items-center justify-between px-4 py-3 border-b hover:opacity-80"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span className="text-sm" style={{ color: 'var(--color-navy)' }}>Aguardando vínculo</span>
            <span className="text-sm font-semibold" style={{ color: pendentesVinculo > 0 ? '#D14343' : 'var(--color-slate)' }}>
              {pendentesVinculo}
            </span>
          </Link>

          <Link
            href="/coordenacao/comentarios-denunciados"
            onClick={() => setAberto(false)}
            className="flex items-center justify-between px-4 py-3 hover:opacity-80"
          >
            <span className="text-sm" style={{ color: 'var(--color-navy)' }}>Comentários denunciados</span>
            <span className="text-sm font-semibold" style={{ color: pendentesComentarios > 0 ? '#D14343' : 'var(--color-slate)' }}>
                  {pendentesComentarios}
            </span>
          </Link>

          {total === 0 && (
            <p className="px-4 py-3 text-sm" style={{ color: 'var(--color-slate)' }}>
              Nenhuma pendência no momento.
            </p>
          )}
        </div>
      )}
    </div>
  )
}