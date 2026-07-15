import ItemCard from '@/app/components/ItemCard'
import NotificacaoCard from '@/app/components/NotificacaoCard'
import FiltrosMural from '@/app/components/FiltrosMural'
import { createServerClient } from '@/lib/supabase-server'
import { ItemAchado, NotificacaoPerdido } from '@/lib/types'
import CardAviso from '@/app/components/CardAviso'

export const revalidate = 0

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>
}) {
  const { q, categoria } = await searchParams
  const supabase = await createServerClient()

  let consulta = supabase
    .from('itens_achados')
    .select('*')
    .eq('visibilidade_publica', true)
    .eq('status', 'aguardando')

  if (q) {
    consulta = consulta.or(`titulo.ilike.%${q}%,descricao.ilike.%${q}%`)
  }

  if (categoria && categoria !== 'todas') {
    consulta = consulta.eq('categoria', categoria)
  }

  const { data: itens, error: erroItens } = await consulta.order('criado_em', { ascending: false })

  const { data: notificacoes } = await supabase
    .from('notificacoes_perdidos')
    .select('*')
    .eq('status_moderacao', 'aprovado')
    .order('criado_em', { ascending: false })

  return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1
          className="text-3xl font-bold mb-4"
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

          <div className="mb-10">
            <CardAviso
              variante="info"
              texto="Os itens encontrados estão disponíveis para retirada na sala da coordenação dos cursos (CI-109, 1º andar)."
            />
          </div>

          <FiltrosMural />

          {erroItens && (
            <p style={{ color: 'var(--color-slate)' }}>
              Não foi possível carregar os itens agora. Tente novamente em instantes.
            </p>
          )}

          {!erroItens && itens?.length === 0 && (
            <p style={{ color: 'var(--color-slate)' }}>
              {q || (categoria && categoria !== 'todas')
                ? 'Nenhum item encontrado com esses filtros.'
                : 'Nenhum item cadastrado ainda. Assim que a coordenação registrar um achado, ele aparece aqui.'}
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

        <div className="max-w-6xl mx-auto py-6">
          <CardAviso
            variante="atencao"
            texto="Itens não recolhidos em até 6 meses serão encaminhados para doação, reciclagem ou descarte por trituração, conforme a natureza do item."
          />
        </div>

      </div>
  )
}