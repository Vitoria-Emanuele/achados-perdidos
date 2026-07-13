'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const categorias = ['todas', 'documentos', 'eletrônicos', 'roupas', 'acessórios', 'outros']

export default function FiltrosMural() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [busca, setBusca] = useState(searchParams.get('q') ?? '')
  const categoriaAtual = searchParams.get('categoria') ?? 'todas'

  function atualizarUrl(novaBusca: string, novaCategoria: string) {
    const params = new URLSearchParams()
    if (novaBusca) params.set('q', novaBusca)
    if (novaCategoria && novaCategoria !== 'todas') params.set('categoria', novaCategoria)
    router.push(`/?${params.toString()}`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    atualizarUrl(busca, categoriaAtual)
  }

  function handleCategoria(categoria: string) {
    atualizarUrl(busca, categoria)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md border text-sm"
          style={{ borderColor: 'var(--color-border)' }}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md text-white text-sm"
          style={{ backgroundColor: 'var(--color-azure)' }}
        >
          Buscar
        </button>
      </form>

      <select
        value={categoriaAtual}
        onChange={(e) => handleCategoria(e.target.value)}
        className="px-4 py-2 rounded-md border text-sm"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {categorias.map((c) => (
          <option key={c} value={c}>{c === 'todas' ? 'Todas as categorias' : c}</option>
        ))}
      </select>
    </div>
  )
}