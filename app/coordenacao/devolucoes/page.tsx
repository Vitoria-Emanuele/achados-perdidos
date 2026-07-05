'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ItemAchado } from '@/lib/types'

export default function DevolucoesPage() {
  const [itens, setItens] = useState<ItemAchado[]>([])
  const [itemSelecionado, setItemSelecionado] = useState<ItemAchado | null>(null)
  const [nome, setNome] = useState('')
  const [matricula, setMatricula] = useState('')
  const [contato, setContato] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function carregar() {
    const supabase = createClient()
    const { data } = await supabase
      .from('itens_achados')
      .select('*')
      .eq('status', 'aguardando')
      .order('data_horario_achado', { ascending: false })

    setItens(data ?? [])
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleConfirmar(e: React.FormEvent) {
    e.preventDefault()
    if (!itemSelecionado) return

    setEnviando(true)
    setErro('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: erroInsert } = await supabase.from('registros_devolucao').insert({
      nome_retirou: nome,
      matricula,
      contato: contato || null,
      item_id: itemSelecionado.id,
      registrado_por: user?.id,
    })

    if (erroInsert) {
      setErro('Não foi possível registrar a devolução.')
      setEnviando(false)
      return
    }

    await supabase.from('itens_achados').update({ status: 'devolvido' }).eq('id', itemSelecionado.id)

    setEnviando(false)
    setItemSelecionado(null)
    setNome('')
    setMatricula('')
    setContato('')
    carregar()
  }

  if (itemSelecionado) {
    return (
      <div className="max-w-md">
        <button
          onClick={() => setItemSelecionado(null)}
          className="text-sm mb-4"
          style={{ color: 'var(--color-slate)' }}
        >
          ← Voltar para a lista
        </button>

        <h3 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
          Devolver: {itemSelecionado.titulo}
        </h3>

        <form onSubmit={handleConfirmar} className="flex flex-col gap-4">
          <input
            type="text"
            required
            placeholder="Nome de quem retirou"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="px-4 py-2 rounded-md border"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <input
            type="text"
            required
            placeholder="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="px-4 py-2 rounded-md border"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <input
            type="text"
            placeholder="Contato (opcional)"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            className="px-4 py-2 rounded-md border"
            style={{ borderColor: 'var(--color-border)' }}
          />

          <button
            type="submit"
            disabled={enviando}
            className="px-4 py-2 rounded-md text-white font-medium disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-azure)' }}
          >
            {enviando ? 'Registrando...' : 'Confirmar devolução'}
          </button>

          {erro && <p className="text-sm" style={{ color: '#D14343' }}>{erro}</p>}
        </form>
      </div>
    )
  }

  if (itens.length === 0) {
    return <p style={{ color: 'var(--color-slate)' }}>Nenhum item aguardando devolução.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {itens.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 rounded-lg border"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <div>
            <h3 className="font-semibold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
              {item.titulo}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-slate)' }}>
              {item.local_encontrado ?? 'Local não informado'}
            </p>
          </div>
          <button
            onClick={() => setItemSelecionado(item)}
            className="px-3 py-1.5 rounded-md text-white text-sm"
            style={{ backgroundColor: 'var(--color-azure)' }}
          >
            Registrar devolução
          </button>
        </div>
      ))}
    </div>
  )
}