# Modelo de Dados Técnico

Sistema de Achados e Perdidos — Centro de Informática (UFPB)

Documentação técnica do banco de dados (Supabase / PostgreSQL), derivada do Documento de Requisitos Detalhado, seção 5\. Serve como referência única para a estruturação das tabelas e para manutenção futura do sistema.

# 1\. Diagrama Entidade-Relacionamento

# 2\. Tabelas

## 2.1 perfis

Dados complementares de cada usuário autenticado (aluno ou coordenação). Ligada 1 para 1 com a tabela interna auth.users, que o Supabase já gerencia automaticamente para login (e-mail, link mágico/senha).

| Campo | Tipo | Obrigatório | Observação |
| :---- | :---- | :---- | :---- |
| id | uuid | Sim | Igual ao id de auth.users (chave primária e estrangeira) |
| nome | text | Sim |  |
| email | text | Sim | Espelha o e-mail de auth.users |
| matricula | text | Não | Preenchido quando o usuário é aluno |
| role | text | Sim | "aluno" ou "coordenacao" |
| criado\_em | timestamp | Sim |  |

## 2.2 itens\_achados

Item cadastrado pela coordenação.

| Campo | Tipo | Obrigatório | Observação |
| :---- | :---- | :---- | :---- |
| id | uuid | Sim | Chave primária, gerada automaticamente |
| titulo | text | Sim | Nome do objeto |
| categoria | text | Sim | Lista fixa, definida no front-end |
| foto\_url | text | Sim | Link do Supabase Storage |
| descricao | text | Sim |  |
| local\_encontrado | text | Não |  |
| data\_horario\_achado | timestamp | Sim |  |
| status | text | Sim | aguardando / devolvido / doado / triturado |
| visibilidade\_publica | boolean | Sim | Padrão: true |
| cadastrado\_por | uuid | Sim | Chave estrangeira → perfis.id |

## 2.3 notificacoes\_perdidos

Notificação enviada por aluno autenticado.

| Campo | Tipo | Obrigatório | Observação |
| :---- | :---- | :---- | :---- |
| id | uuid | Sim | Chave primária |
| titulo | text | Sim |  |
| categoria | text | Sim |  |
| foto\_url | text | Não | Opcional |
| descricao | text | Sim |  |
| local\_perdido | text | Não |  |
| data\_horario\_perda | timestamp | Sim |  |
| status\_moderacao | text | Sim | pendente / aprovado / rejeitado |
| item\_vinculado\_id | uuid | Não | Chave estrangeira → itens\_achados.id |
| autor\_id | uuid | Sim | Chave estrangeira → perfis.id |
| moderado\_por | uuid | Não | Chave estrangeira → perfis.id (funcionário que aprovou/rejeitou) |

## 2.4 registros\_devolucao

Acesso restrito à coordenação (Row Level Security). Contém dados pessoais de terceiros.

| Campo | Tipo | Obrigatório | Observação |
| :---- | :---- | :---- | :---- |
| id | uuid | Sim | Chave primária |
| nome\_retirou | text | Sim |  |
| matricula | text | Sim |  |
| contato | text | Não | E-mail ou telefone |
| item\_id | int | Sim | Chave estrangeira → itens\_achados.id |
| registrado\_por | uuid | Sim | Chave estrangeira → perfis.id (funcionário que deu baixa) |
| data\_devolucao | timestamp | Sim | Preenchida automaticamente |

## 2.5 comentarios

| Campo | Tipo | Obrigatório | Observação |
| :---- | :---- | :---- | :---- |
| id | uuid | Sim | Chave primária |
| texto | text | Sim |  |
| autor\_id | uuid | Sim | Chave estrangeira → perfis.id |
| item\_id | uuid | Sim | Chave estrangeira → itens\_achados.id |
| denunciado | boolean | Sim | Padrão: false |
| status | text | Sim | visivel / removido |

# 3\. Relacionamentos

* perfis.id → auth.users.id (1 para 1, gerenciada pelo Supabase Auth)

* itens\_achados.cadastrado\_por → perfis.id

* notificacoes\_perdidos.autor\_id → perfis.id

* notificacoes\_perdidos.moderado\_por → perfis.id

* notificacoes\_perdidos.item\_vinculado\_id → itens\_achados.id

* registros\_devolucao.item\_id → itens\_achados.id

* registros\_devolucao.registrado\_por → perfis.id

* comentarios.item\_id → itens\_achados.id

* comentarios.autor\_id → perfis.id

# 4\. Segurança (Row Level Security)

* registros\_devolucao: leitura restrita a usuários cujo registro em perfis tenha role \= "coordenacao".

* Demais tabelas: leitura pública; escrita restrita a usuários autenticados, com regras específicas por tabela a detalhar durante a implementação.

* A verificação do papel (role) é feita consultando a tabela perfis pelo id do usuário autenticado (auth.uid()), não por um campo solto no token de login.

# 5\. Convenções

* Nomes de tabela no plural, em snake\_case.

* Todo id é UUID gerado automaticamente.

* Datas em formato timestamp.

* Toda tabela nova precisa de uma política de leitura explícita, mesmo que pareça "óbvio" que deveria ser pública.