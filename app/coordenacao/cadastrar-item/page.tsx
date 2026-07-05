'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const categorias = ['documentos', 'eletrônicos', 'roupas', 'acessórios', 'outros']

export default function CadastrarItemPage() {
  const router = useRouter()

  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState(categorias[0])
  const [descricao, setDescricao] = useState('')
  const [localEncontrado, setLocalEncontrado] = useState('')
  const [dataAchado, setDataAchado] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!foto) {
      setErro('Selecione uma foto do item.')
      return
    }

    setEnviando(true)
    setErro('')
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setErro('Sessão expirada. Faça login novamente.')
      setEnviando(false)
      return
    }

    // 1. Upload da foto
    const nomeArquivo = `${Date.now()}-${foto.name}`
    const { error: erroUpload } = await supabase.storage
      .from('fotos-itens')
      .upload(nomeArquivo, foto)

    if (erroUpload) {
      setErro('Não foi possível enviar a foto. Tente novamente.')
      setEnviando(false)
      return
    }

    const { data: urlPublica } = supabase.storage
      .from('fotos-itens')
      .getPublicUrl(nomeArquivo)

    // 2. Inserir o item
    const { error: erroInsert } = await supabase.from('itens_achados').insert({
      titulo,
      categoria,
      foto_url: urlPublica.publicUrl,
      descricao,
      local_encontrado: localEncontrado || null,
      data_horario_achado: new Date(dataAchado).toISOString(),
      cadastrado_por: user.id,
    })

    setEnviando(false)

    if (erroInsert) {
      setErro('Não foi possível cadastrar o item. Tente novamente.')
      return
    }

    setSucesso(true)
    setTimeout(() => router.push('/'), 1500)
  }

  if (sucesso) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
          Item cadastrado!
        </h2>
        <p style={{ color: 'var(--color-slate)' }}>Redirecionando para o mural...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-bold mb-6" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
        Cadastrar item achado
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          required
          placeholder="Título (ex: Carteira de couro marrom)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="px-4 py-2 rounded-md border"
          style={{ borderColor: 'var(--color-border)' }}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="px-4 py-2 rounded-md border"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <textarea
          required
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="px-4 py-2 rounded-md border"
          style={{ borderColor: 'var(--color-border)' }}
          rows={3}
        />

        <input
          type="text"
          placeholder="Local onde foi encontrado (opcional)"
          value={localEncontrado}
          onChange={(e) => setLocalEncontrado(e.target.value)}
          className="px-4 py-2 rounded-md border"
          style={{ borderColor: 'var(--color-border)' }}
        />

        <input
          type="datetime-local"
          required
          value={dataAchado}
          onChange={(e) => setDataAchado(e.target.value)}
          className="px-4 py-2 rounded-md border"
          style={{ borderColor: 'var(--color-border)' }}
        />

        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
        />

        <button
          type="submit"
          disabled={enviando}
          className="px-4 py-2 rounded-md text-white font-medium disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-azure)' }}
        >
          {enviando ? 'Enviando...' : 'Cadastrar item'}
        </button>

        {erro && <p className="text-sm" style={{ color: '#D14343' }}>{erro}</p>}
      </form>
    </div>
  )
}