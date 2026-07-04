import ItemCard from '@/app/components/ItemCard'
import { createServerClient } from '@/lib/supabase-server'
import { ItemAchado } from '@/lib/types'

export const revalidate = 0 // sempre busca dados atualizados, nunca uma versão salva antiga

export default async function Home() {
  const supabase = createServerClient()

  const { data: itens, error } = await supabase
    .from('itens_achados')
    .select('*')
    .eq('visibilidade_publica', true)
    .order('criado_em', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}
      >
        Mural de Achados e Perdidos
      </h1>

      {error && (
        <p style={{ color: 'var(--color-slate)' }}>
          Não foi possível carregar os itens agora. Tente novamente em instantes.
        </p>
      )}

      {!error && itens?.length === 0 && (
        <p style={{ color: 'var(--color-slate)' }}>
          Nenhum item cadastrado ainda. Assim que a coordenação registrar um achado, ele aparece aqui.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {itens?.map((item: ItemAchado) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}