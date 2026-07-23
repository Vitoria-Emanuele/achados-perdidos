export type Role = 'aluno' | 'coordenacao'

export interface Perfil {
  id: string
  nome: string
  email: string
  matricula: string | null
  role: Role
}

export interface ItemAchado {
  id: string
  titulo: string
  categoria: string
  foto_url: string
  descricao: string
  local_encontrado: string | null
  data_horario_achado: string
  status: 'aguardando' | 'devolvido' | 'doado' | 'triturado'
  visibilidade_publica: boolean
  cadastrado_por: string
}

export interface NotificacaoPerdido {
  id: string
  titulo: string
  categoria: string
  foto_url: string | null
  descricao: string
  local_perdido: string | null
  data_horario_perda: string
  status_moderacao: 'pendente' | 'aprovado' | 'rejeitado'
  item_vinculado_id: string | null
  autor_id: string
  moderado_por: string | null
  lida: boolean
  motivo_rejeicao: string | null
}

export interface Comentario {
  id: string
  texto: string
  autor_id: string
  notificacao_id: string
  denunciado: boolean
  status: 'visivel' | 'removido'
  criado_em: string
  perfis?: { email: string }
  notificacoes_perdidos?: { titulo: string }
}