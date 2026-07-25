# Sistema de Achados e Perdidos — CI/UFPB

Sistema centralizado para gestão de itens achados e perdidos no Centro de
Informática da UFPB, sendo um mural
digital com controle de acesso, moderação e auditoria.

🔗 **Site:** https://achados-perdidos-blue.vercel.app


## Equipe

- Thaynara Magno Rodrigues
- Lucas Leite Mota Dias
- Iago Vitor Lopes das Chagas
- Kennyo Wescley Elias Cavalcante
- Vitória Emanuele de Sousa Silva

## Stack

- [Next.js](https://nextjs.org/) (TypeScript) — front-end e rotas de servidor
- [Supabase](https://supabase.com/) — banco de dados (PostgreSQL), autenticação e armazenamento de fotos
- [Vercel](https://vercel.com/) — hospedagem, com deploy automático a cada push na branch `main`

## Funcionalidades

- Mural público de itens achados, com busca e filtro por categoria
- Notificação de item perdido pelo aluno, com moderação da coordenação
- Autenticação diferenciada por papel: aluno (link mágico) e coordenação (e-mail e senha)
- Vínculo manual entre notificação de perdido e item achado correspondente
- Comentários em notificações aprovadas, com denúncia e moderação
- Registro de devolução, com log de auditoria de ações administrativas
- Acompanhamento de notificações pelo aluno, com indicador de novidades

## Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org/) (LTS) instalado.

```bash
git clone https://github.com/Vitoria-Emanuele/achados-perdidos.git
cd achados-perdidos
npm install
npm run dev
```

Acesse http://localhost:3000

É necessário criar um arquivo `.env.local` na raiz do projeto com as
credenciais do Supabase — ver `docs/autenticacao_A&P.docx`.

## Testes

```bash
npm run test:rls
```

Executa a verificação automatizada das políticas de segurança (Row Level
Security) do banco de dados. Requer um arquivo `.env.test.local` (não
versionado) — ver `docs/plano_teste_A&P.docx`, Seção 6.

Os demais testes (funcionais e de sistema) são manuais, roteirizados em
`plano_teste_A&P.docx`.

## Documentação

https://docs.google.com/document/d/1JthjNlQOfYEg-5HpM8rwsZeli39Sl0RR/edit?usp=drive_link&ouid=115994166069042830446&rtpof=true&sd=true

- `Requisitos_A&P.docx` — requisitos, atores, regras de negócio
- `Modelo_de_Dados_A&P.docx` — modelo de dados, diagrama ER, políticas de segurança
- `Diagramas_do_Sistema_A&P.docx` — diagrama de casos de uso e diagrama de arquitetura
- `autenticacao_A&P.docx` — fluxo de login e configuração necessária
- `docs/plano_teste_A&P.docx` — metodologia, casos de teste e registro de defeitos

## Metodologia

Desenvolvimento ágil (Scrum), com backlog gerenciado nas Issues/Projects
deste repositório e entregas incrementais por história de usuário.
