import { createServerClient } from '@/lib/supabase-server'
import ChatComentarios from '@/app/components/ChatComentarios'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function NotificacaoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()

  const { data: notificacao } = await supabase
    .from('notificacoes_perdidos')
    .select('*')
    .eq('id', id)
    .single()

  if (!notificacao) notFound()

  const { data: comentarios } = await supabase
    .from('comentarios')
    .select('*, perfis(email)')
    .eq('notificacao_id', id)
    .eq('status', 'visivel')
    .order('criado_em', { ascending: true })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {notificacao.foto_url && (
        <img
          src={notificacao.foto_url}
          alt={notificacao.titulo}
          className="w-full aspect-[16/9] object-cover rounded-lg mb-4"
        />
      )}

      <span
        className="text-[10px] uppercase px-2 py-0.5 rounded"
        style={{ fontFamily: 'var(--font-ibm-plex-mono)', backgroundColor: 'rgba(0, 180, 250, 0.12)', color: 'var(--color-azure)' }}
      >
        {notificacao.categoria}
      </span>

      <h1 className="text-xl font-bold mt-2" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
        {notificacao.titulo}
      </h1>

      <p className="mt-2" style={{ color: 'var(--color-slate)' }}>{notificacao.descricao}</p>

      <p className="text-sm mt-1" style={{ color: 'var(--color-slate)' }}>
        {notificacao.local_perdido ?? 'Local não informado'} — {new Date(notificacao.data_horario_perda).toLocaleDateString('pt-BR')}
      </p>

      <div className="border-t my-6" style={{ borderColor: 'var(--color-border)' }} />

      <ChatComentarios
        notificacaoId={notificacao.id}
        comentariosIniciais={comentarios ?? []}
        usuarioLogado={!!user}
      />
    </div>
  )
}