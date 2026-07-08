import ItemCard from '@/app/components/ItemCard'
import NotificacaoCard from '@/app/components/NotificacaoCard'
import { createServerClient } from '@/lib/supabase-server'
import { ItemAchado, NotificacaoPerdido } from '@/lib/types'

export const revalidate = 0

export default async function Home() {
  const supabase = await createServerClient()

  const { data: itens, error: erroItens } = await supabase
    .from('itens_achados')
    .select('*')
    .eq('visibilidade_publica', true)
    .order('criado_em', { ascending: false })

  const { data: notificacoes } = await supabase
    .from('notificacoes_perdidos')
    .select('*')
    .eq('status_moderacao', 'aprovado')
    .order('criado_em', { ascending: false })

  return (
    <header style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1
          className="text-3xl font-bold mb-10"
          style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}
        >
          Mural de Achados e Perdidos
        </h1>

        <section className="mb-12">
          <h2
            className="text-lg font-bold mb-4"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}
          >
            Achados
          </h2>

          {erroItens && (
            <p style={{ color: 'var(--color-slate)' }}>
              Não foi possível carregar os itens agora. Tente novamente em instantes.
            </p>
          )}

          {!erroItens && itens?.length === 0 && (
            <p style={{ color: 'var(--color-slate)' }}>
              Nenhum item cadastrado ainda. Assim que a coordenação registrar um achado, ele aparece aqui.
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {itens?.map((item: ItemAchado) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {notificacoes && notificacoes.length > 0 && (
          <section>
            <h2
              className="text-lg font-bold mb-4"
              style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}
            >
              Perdidos
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
              {notificacoes.map((n: NotificacaoPerdido) => (
                <NotificacaoCard key={n.id} notificacao={n} />
              ))}
            </div>
          </section>
        )}
      </div>

    </header>
  )
}