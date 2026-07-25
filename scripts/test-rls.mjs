import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
const emailAluno = process.env.EMAIL_ALUNO_TESTE
const emailCoordenacao = process.env.EMAIL_COORDENACAO_TESTE
const senhaCoordenacao = process.env.SENHA_COORDENACAO_TESTE

let passou = 0
let falhou = 0

function checar(descricao, condicao) {
  if (condicao) {
    console.log(`Passou — ${descricao}`)
    passou++
  } else {
    console.log(`Falhou — ${descricao}`)
    falhou++
  }
}

async function loginAluno() {
  const admin = createClient(url, serviceRoleKey)
  const { data: linkData, error: erroLink } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: emailAluno,
  })
  if (erroLink) throw new Error(`Não foi possível gerar link para o aluno de teste: ${erroLink.message}`)

  const cliente = createClient(url, publishableKey)
  const { data, error } = await cliente.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  })
  if (error) throw new Error(`Falha ao autenticar aluno de teste: ${error.message}`)

  const clienteAutenticado = createClient(url, publishableKey)
  await clienteAutenticado.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  })
  return clienteAutenticado
}

async function loginCoordenacao() {
  const cliente = createClient(url, publishableKey)
  const { error } = await cliente.auth.signInWithPassword({
    email: emailCoordenacao,
    password: senhaCoordenacao,
  })
  if (error) throw new Error(`Falha ao autenticar coordenação de teste: ${error.message}`)
  return cliente
}

async function rodarTestes() {
  console.log('Iniciando testes de RLS...\n')

  const anonimo = createClient(url, publishableKey)
  const aluno = await loginAluno()
  const coordenacao = await loginCoordenacao()

  // --- Visitante (sem login) ---
  const { data: itensVisitante } = await anonimo.from('itens_achados').select('*')
  checar('Visitante consegue ler itens_achados', Array.isArray(itensVisitante))

  const { data: devolucoesVisitante } = await anonimo.from('registros_devolucao').select('*')
  checar('Visitante NÃO consegue ler registros_devolucao', (devolucoesVisitante ?? []).length === 0)

  const { error: erroInsertVisitante } = await anonimo.from('itens_achados').insert({
    titulo: 'teste-rls', categoria: 'outros', foto_url: 'x', descricao: 'x',
    data_horario_achado: new Date().toISOString(),
  })
  checar('Visitante NÃO consegue cadastrar item achado', !!erroInsertVisitante)

  // --- Aluno ---
  const { error: erroItemAluno } = await aluno.from('itens_achados').insert({
    titulo: 'teste-rls', categoria: 'outros', foto_url: 'x', descricao: 'x',
    data_horario_achado: new Date().toISOString(),
  })
  checar('Aluno NÃO consegue cadastrar item achado', !!erroItemAluno)

  const { data: devolucoesAluno } = await aluno.from('registros_devolucao').select('*')
  checar('Aluno NÃO consegue ler registros_devolucao', (devolucoesAluno ?? []).length === 0)

  // --- Coordenação ---
  const { error: erroItemCoord } = await coordenacao.from('itens_achados').insert({
    titulo: 'teste-rls-coordenacao', categoria: 'outros', foto_url: 'x', descricao: 'x',
    data_horario_achado: new Date().toISOString(),
  })
  checar('Coordenação consegue cadastrar item achado', !erroItemCoord)

  const { data: devolucoesCoord, error: erroDevolucoesCoord } = await coordenacao.from('registros_devolucao').select('*')
  checar('Coordenação consegue ler registros_devolucao', !erroDevolucoesCoord && Array.isArray(devolucoesCoord))

  // --- Limpeza: remove os itens de teste criados ---
  const admin = createClient(url, serviceRoleKey)
  await admin.from('itens_achados').delete().like('titulo', 'teste-rls%')

  console.log(`\nResultado: ${passou} passaram, ${falhou} falharam.`)
  if (falhou > 0) process.exit(1)
}

rodarTestes().catch((e) => {
  console.error('Erro ao rodar os testes:', e.message)
  process.exit(1)
})