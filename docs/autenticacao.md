# Autenticação — Sistema de Achados e Perdidos
Documentação técnica do fluxo de login (RF04) e das políticas de segurança
associadas. Complementa `BD_modelos_tecnico.pdf`.

## Como funciona o login por link mágico

1. A pessoa acessa `/login` e informa o e-mail.
2. O site chama `supabase.auth.signInWithOtp()`, que dispara um e-mail com um
   link de acesso.
3. Ao clicar no link, a pessoa é levada para `/auth/callback` (não direto para
   o site) — essa rota troca o código recebido por uma sessão válida e só
   então redireciona para a página inicial.
4. A sessão fica guardada em cookies, renovados automaticamente a cada
   requisição pelo `middleware.ts`.
5. No primeiro login de um e-mail novo, a trigger `ao_criar_usuario` (ver
   `BANCO_DE_DADOS.md`) cria automaticamente a linha correspondente em
   `perfis`, com `role = 'aluno'`.

## Arquivos envolvidos

| Arquivo                      | Papel                                                         |
|---                           |---                                                            |
| `middleware.ts`              | Renova a sessão em toda requisição                            |
| `lib/supabase.ts`            | Cliente Supabase para uso no navegador (Client Components)    |
| `lib/supabase-server.ts`     | Cliente Supabase para uso no servidor (Server Components)     |
| `app/login/page.tsx`         | Formulário de login                                           |
| `app/auth/callback/route.ts` | Recebe o retorno do link mágico e cria a sessão               |
| `components/Header.tsx`      | Exibe o estado de login (e-mail do usuário ou botão "Entrar") |

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

### Nota importante

Todas as tabelas com RLS ativado exigem uma política para **cada operação**
(select, insert, update, delete) que devem ser permitidas. As políticas acima
cobrem apenas leitura (select) — as políticas de escrita (quem pode inserir
uma notificação, quem pode aprovar, etc.) ainda precisam ser criadas conforme
as próximas histórias (RF01, RF05, RF06...) forem implementadas. Registrar
aqui cada nova política à medida que for criada evita o mesmo tipo de bug que
tivemos com `itens_achados` (dado existia, mas não aparecia, sem erro visível).