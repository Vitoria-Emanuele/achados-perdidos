'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Registro = {
  id: string
  nome_retirou: string
  matricula: string
  contato: string | null
  data_devolucao: string
  itens_achados?: { titulo: string }
}

export default function RegistrosDevolucaoPage() {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [busca, setBusca] = useState('')

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()
      const { data } = await supabase
        .from('registros_devolucao')
        .select('*, itens_achados(titulo)')
        .order('data_devolucao', { ascending: false })

      setRegistros(data ?? [])
    }
    carregar()
  }, [])

  const filtrados = registros.filter((r) =>
    `${r.nome_retirou} ${r.matricula} ${r.itens_achados?.titulo ?? ''}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Buscar por nome, matrícula ou item..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="px-4 py-2 rounded-md border text-sm"
        style={{ borderColor: 'var(--color-border)' }}
      />

      {filtrados.length === 0 && (
        <p style={{ color: 'var(--color-slate)' }}>Nenhum registro encontrado.</p>
      )}

      <div className="flex flex-col gap-3">
        {filtrados.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-lg border"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="font-semibold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
              {r.itens_achados?.titulo ?? 'Item removido'}
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--color-slate)' }}>
              Retirado por <strong>{r.nome_retirou}</strong> — matrícula {r.matricula}
              {r.contato && ` — contato: ${r.contato}`}
            </p>
            <p className="text-xs mt-1" style={{ fontFamily: 'var(--font-ibm-plex-mono)', color: 'var(--color-slate)' }}>
              {new Date(r.data_devolucao).toLocaleString('pt-BR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}