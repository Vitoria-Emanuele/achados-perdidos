'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const categorias = ['documentos', 'eletrônicos', 'roupas', 'acessórios', 'outros']

export default function NotificarPage() {
  const router = useRouter()

  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState(categorias[0])
  const [descricao, setDescricao] = useState('')
  const [localPerdido, setLocalPerdido] = useState('')
  const [dataPerda, setDataPerda] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setErro('Você precisa estar logado para notificar um item perdido.')
      setEnviando(false)
      return
    }

    let fotoUrl: string | null = null

    if (foto) {
      const nomeArquivo = `${Date.now()}-${foto.name}`
      const { error: erroUpload } = await supabase.storage
        .from('fotos-itens')
        .upload(nomeArquivo, foto)

      if (erroUpload) {
        setErro('Não foi possível enviar a foto. Tente novamente.')
        setEnviando(false)
        return
      }

      const { data: urlPublica } = supabase.storage.from('fotos-itens').getPublicUrl(nomeArquivo)
      fotoUrl = urlPublica.publicUrl
    }

    const { error: erroInsert } = await supabase.from('notificacoes_perdidos').insert({
      titulo,
      categoria,
      foto_url: fotoUrl,
      descricao,
      local_perdido: localPerdido || null,
      data_horario_perda: new Date(dataPerda).toISOString(),
      autor_id: user.id,
    })

    setEnviando(false)

    if (erroInsert) {
      setErro('Não foi possível enviar sua notificação. Tente novamente.')
      return
    }

    setSucesso(true)
    setTimeout(() => router.push('/minhas-notificacoes'), 1500)
  }

  if (sucesso) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
          Notificação enviada!
        </h1>
        <p style={{ color: 'var(--color-slate)' }}>
          A coordenação vai revisar antes de publicar. Você pode acompanhar em &quot;Minhas notificações&quot;.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
        Perdi um item
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-slate)' }}>
        A foto é opcional. Sua notificação passa por uma revisão antes de aparecer no mural.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          required
          placeholder="Título (ex: Fone de ouvido preto)"
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
          placeholder="Local onde perdeu (opcional)"
          value={localPerdido}
          onChange={(e) => setLocalPerdido(e.target.value)}
          className="px-4 py-2 rounded-md border"
          style={{ borderColor: 'var(--color-border)' }}
        />

        <input
          type="datetime-local"
          required
          value={dataPerda}
          onChange={(e) => setDataPerda(e.target.value)}
          className="px-4 py-2 rounded-md border"
          style={{ borderColor: 'var(--color-border)' }}
        />

        <div>
          <label className="text-sm block mb-1" style={{ color: 'var(--color-slate)' }}>
            Foto (opcional)
          </label>
          <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="px-4 py-2 rounded-md text-white font-medium disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-azure)' }}
        >
          {enviando ? 'Enviando...' : 'Enviar notificação'}
        </button>

        {erro && <p className="text-sm" style={{ color: '#D14343' }}>{erro}</p>}
      </form>
    </div>
  )
}