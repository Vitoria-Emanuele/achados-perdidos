import ItemCard from '@/app/components/ItemCard'
import { ItemAchado } from '@/lib/types'

// Aqui eh so teste para aparecer o card no mural
const itensFicticios: ItemAchado[] = [
  {
    id: '1',
    titulo: 'Carteira de couro marrom',
    categoria: 'documentos',
    foto_url: 'https://placehold.co/400x300/001B2E/FFFFFF?text=Foto',
    descricao: '',
    local_encontrado: 'Bloco B, sala 12',
    data_horario_achado: '2026-07-01T10:00:00',
    status: 'aguardando',
    visibilidade_publica: true,
    cadastrado_por: '',
  },
  {
    id: '2',
    titulo: 'Fone de ouvido Bluetooth',
    categoria: 'eletrônicos',
    foto_url: 'https://placehold.co/400x300/00B4FA/FFFFFF?text=Foto',
    descricao: '',
    local_encontrado: 'Laboratório 3',
    data_horario_achado: '2026-06-28T15:30:00',
    status: 'devolvido',
    visibilidade_publica: true,
    cadastrado_por: '',
  },
  {
    id: '3',
    titulo: 'Casaco jeans azul',
    categoria: 'roupas',
    foto_url: 'https://placehold.co/400x300/46BEFA/FFFFFF?text=Foto',
    descricao: '',
    local_encontrado: 'Auditório',
    data_horario_achado: '2026-06-25T09:00:00',
    status: 'aguardando',
    visibilidade_publica: true,
    cadastrado_por: '',
  },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}
      >
        Mural de Achados e Perdidos
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {itensFicticios.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}