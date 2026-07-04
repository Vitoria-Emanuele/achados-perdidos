# Autenticação — Sistema de Achados e Perdidos

Documentação técnica do fluxo de login (RF04) e das políticas de segurança
associadas. Complementa `BANCO_DE_DADOS.md`.

## Como funciona o login por link mágico (aluno — RF04)

1. A pessoa acessa `/login` e informa o e-mail.
2. O sistema consulta a função `get_role_by_email` para saber se aquele e-mail
   é de aluno ou de coordenação.
3. Se for aluno (ou e-mail novo, nunca visto antes): o site chama
   `supabase.auth.signInWithOtp()`, que dispara um e-mail com um link de
   acesso.
4. Ao clicar no link, a pessoa é levada para `/auth/callback` (não direto para
   o site) — essa rota troca o código recebido por uma sessão válida e só
   então redireciona para a página inicial.
5. A sessão fica guardada em cookies, renovados automaticamente a cada
   requisição pelo `middleware.ts`.
6. No primeiro login de um e-mail novo, a trigger `ao_criar_usuario` (ver
   `BANCO_DE_DADOS.md`) cria automaticamente a linha correspondente em
   `perfis`, com `role = 'aluno'`.

## Como funciona o login da coordenação (RF09)

Diferente do aluno, a coordenação usa **e-mail e senha** (sem link mágico e
sem segundo fator/MFA — avaliado e descartado por trazer mais fricção do que
benefício real para o perfil de usuário desta conta).

1. A pessoa acessa `/login` e informa o e-mail.
2. O sistema identifica, pela função `get_role_by_email`, que o e-mail tem
   `role = 'coordenacao'`.
3. A tela pede a senha (`supabase.auth.signInWithPassword`).
4. Login bem-sucedido redireciona para a página inicial.

Contas de coordenação **não são de autocadastro** — são criadas manualmente
por um administrador do sistema, com senha definida na criação (ver seção de
"Promovendo um e-mail para coordenação" no `BANCO_DE_DADOS.md` ou no histórico
do projeto).

## Arquivos envolvidos

| Arquivo | Papel |
|---|---|
| `middleware.ts` | Renova a sessão em toda requisição |
| `lib/supabase.ts` | Cliente Supabase para uso no navegador (Client Components) |
| `lib/supabase-server.ts` | Cliente Supabase para uso no servidor (Server Components) |
| `app/login/page.tsx` | Formulário de login, com dois fluxos (aluno / coordenação) |
| `app/auth/callback/route.ts` | Recebe o retorno do link mágico e cria a sessão |
| `components/Header.tsx` | Exibe o estado de login (e-mail, papel, botão "Entrar"/"Sair") |
| Função `get_role_by_email` (banco) | Permite checar o papel de um e-mail antes do login, sem expor a tabela `perfis` |

## Configuração necessária no painel do Supabase

Sem isso, o login não funciona — o Supabase recusa o redirecionamento por
segurança. Em **Authentication → URL Configuration**:

- **Site URL:** URL de produção do site (ex.: `https://achados-perdidos-blue.vercel.app`)
- **Redirect URLs:** adicionar todas as URLs de callback usadas:
  - `http://localhost:3000/auth/callback` (desenvolvimento local)
  - `https://achados-perdidos-blue.vercel.app/auth/callback` (produção)
  - Se o Vercel gerar outros domínios de Preview (por Pull Request), adicionar
    também, ou usar um padrão coringa se o Supabase permitir.

## Políticas de segurança (Row Level Security)

Estas políticas foram adicionadas depois da criação inicial das tabelas —
o Supabase ativa RLS por padrão em tabelas novas, o que bloqueia toda leitura
até que uma política explícita seja criada.

```sql
-- Itens achados: leitura pública
create policy "Itens achados são públicos"
on itens_achados for select
using (true);

-- Notificações: só as já aprovadas ficam públicas
create policy "Notificações aprovadas são públicas"
on notificacoes_perdidos for select
using (status_moderacao = 'aprovado');

-- Comentários: só os visíveis (não removidos) ficam públicos
create policy "Comentários visíveis são públicos"
on comentarios for select
using (status = 'visivel');
```

Já existentes (definidas junto com a criação das tabelas):

```sql
-- Perfis: visíveis para qualquer usuário autenticado
create policy "Perfis são visíveis para autenticados"
on perfis for select
using (auth.role() = 'authenticated');

-- Registros de devolução: acesso restrito à coordenação
create policy "Somente coordenação vê devoluções"
on registros_devolucao for select
using (
  exists (
    select 1 from perfis
    where perfis.id = auth.uid()
    and perfis.role = 'coordenacao'
  )
);
```

## Limitação do serviço de e-mail padrão do Supabase

Sem configurar um provedor de e-mail próprio (SMTP), o Supabase aplica duas
restrições no envio de link mágico, que já geraram confusão durante os testes:

- **Só envia para e-mails cadastrados como membros da organização** no
  Supabase (Settings da organização → Team). Qualquer outro e-mail recebe erro
  ao tentar logar.
- **Limite de 2 e-mails de autenticação por hora**, no total do projeto.

Isso é adequado só para desenvolvimento. **Antes de qualquer teste real com
alunos ou coordenação fora do grupo**, é necessário configurar um provedor de
e-mail próprio via SMTP (ex.: Resend, que tem plano gratuito) em
**Authentication → SMTP Settings** no Supabase. Sem isso, o login por link
mágico não funciona para ninguém fora da lista de membros do projeto.

## Sobre o MFA (segundo fator) — decisão descartada

Chegamos a implementar um segundo fator (TOTP) para a coordenação, mas essa
exigência foi removida deliberadamente: o código muda a cada 30 segundos e
adicionaria fricção desnecessária para o perfil de usuário real dessa conta.
A proteção da conta de coordenação continua sendo e-mail + senha (mais forte
que o link mágico do aluno), com a senha guardada apenas por quem administra
o sistema.

Todas as tabelas com RLS ativado exigem uma política para **cada operação**
(select, insert, update, delete) que devem ser permitidas. As políticas acima
cobrem apenas leitura (select) — as políticas de escrita (quem pode inserir
uma notificação, quem pode aprovar, etc.) ainda precisam ser criadas conforme
as próximas histórias (RF01, RF05, RF06...) forem implementadas. Registrar
aqui cada nova política à medida que for criada evita o mesmo tipo de bug que
tivemos com `itens_achados` (dado existia, mas não aparecia, sem erro visível).