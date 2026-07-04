# Documento de Requisitos Detalhado

**Sistema de Achados e Perdidos — Centro de Informática (UFPB)**

**Equipe**:  
Thaynara Magno Rodrigues,  
Lucas Leite Mota Dias,  
Iago Vitor Lopes das Chagas,  
Kennyo Wescley Elias Cavalcante,  
Vitória Emanuele de Sousa Silva.

1\. Introdução

Este documento detalha e aprofunda a proposta apresentada, especificando atores, regras de negócio, modelo de dados preliminar e requisitos não funcionais. O objetivo é servir como base de discussão com a equipe de desenvolvimento e com os responsáveis pela coordenação de achados e perdidos, permitindo validar e ajustar as decisões antes da etapa de prototipação.

Por ser um projeto conduzido em ciclos ágeis (Scrum), este documento não é definitivo: as descrições aqui servem como ponto de partida para o backlog do produto e devem ser refinadas continuamente a partir do feedback coletado.

2\. Atores do Sistema

| Ator | Descrição | Principais permissões |
| :---- | :---- | :---- |
| Visitante (sem login) | Qualquer pessoa que acesse o site, sem necessidade de autenticação. | Visualizar, buscar e filtrar itens achados e notificações de itens perdidos já aprovadas. |
| Aluno / usuário autenticado | Pessoa que se autentica via e-mail e link mágico para interagir ativamente com o mural. | Tudo o que o visitante pode fazer, além de cadastrar notificações de item perdido (com foto) e comentar em itens. |
| Funcionário da coordenação | Responsável pela gestão do processo de achados e perdidos. | Cadastrar itens achados, alterar status, aprovar ou rejeitar notificações de perdidos (podendo remover foto sensível), registrar devolução com dados de quem retirou, vincular notificações de perdido a itens achados. |

2.1 Diferença de autenticação entre aluno e coordenação

A coordenação tem acesso a dados pessoais de terceiros (registro de devolução) e a funções que afetam o conteúdo público do mural, o que justifica um mecanismo de login mais rigoroso do que o do aluno.

| Aspecto | Aluno | Funcionário da coordenação |
| :---- | :---- | :---- |
| Criação de conta | Autocadastro livre | Provisionada por administrador, lista fechada de e-mails |
| Mecanismo de login | E-mail \+ link mágico | E-mail \+ senha |
| Duração da sessão | Mais longa | Mais curta, com expiração por inatividade |
| Registro de ações | Não se aplica | Toda ação crítica registrada em log de auditoria |

3\. Requisitos Funcionais (Histórias de Usuário)

 As histórias abaixo expandem as quatro originais, incorporando as decisões tomadas sobre autenticação, moderação e vínculo entre registros.

**RF01** — Cadastro de item achado: Como funcionário da coordenação, quero cadastrar um item encontrado informando categoria, descrição, foto (obrigatória) e local/data/horário do achado, para que o item fique visível no mural.

**RF02** — Atualizar status do item: Como funcionário da coordenação, quero alterar o status de um item para "Devolvido", registrando nome, matrícula e contato de quem retirou, para manter o controle de quem levou cada objeto.

**RF03** — Visualizar e buscar itens: Como visitante ou aluno, quero visualizar, buscar e filtrar os itens do mural por categoria, data ou palavra-chave, para verificar rapidamente se algo que perdi já foi encontrado.

**RF04** — Autenticação por link mágico: Como aluno, quero me autenticar informando apenas meu e-mail e clicando em um link de confirmação recebido, sem precisar criar ou lembrar senha, para acessar as funcionalidades restritas de forma simples.

**RF05** — Cadastro de notificação de item perdido: Como aluno autenticado, quero cadastrar uma notificação informando que perdi um item, com categoria, descrição e local/data/horário aproximados, podendo opcionalmente anexar uma foto, para que a coordenação e outros alunos saibam o que procurar.

**RF06** — Moderação de notificações: Como funcionário da coordenação, quero revisar cada notificação de item perdido antes que ela apareça publicamente, podendo aprová-la, rejeitá-la, ou remover a foto anexada caso o conteúdo seja sensível, para manter o mural seguro e adequado.

**RF07** — Vínculo entre item achado e notificação de perdido: Como funcionário da coordenação, quero vincular manualmente uma notificação de item perdido a um item já cadastrado como achado, para indicar que o objeto correspondente foi localizado.

**RF08** — Comentário público em item: Como aluno autenticado, quero adicionar um comentário público em um item do mural, para complementar informações que ajudem a identificá-lo.

**RF09** — Autenticação reforçada da coordenação: Como funcionário da coordenação, quero acessar o sistema com e-mail e senha, para proteger meu acesso a dados pessoais de terceiros e às funções administrativas.

**RF10** — Log de auditoria de ações críticas: Como administrador do sistema, quero que toda aprovação, rejeição, vínculo e baixa de item registrada por um funcionário fique associada a quem a realizou e em que data/horário, para permitir rastreabilidade em caso de disputa.

**RF11** — Acompanhamento das próprias notificações: Como aluno autenticado, quero acessar uma área de "minhas notificações" para acompanhar o status delas (pendente, aprovada, rejeitada, vinculada a um item), sem depender de aviso por e-mail.

**RF12** — Denúncia de comentário: Como visitante ou aluno, quero denunciar um comentário considerado inadequado, para que a coordenação possa avaliá-lo e removê-lo se necessário.

4\. Regras de Negócio

* Notificações de item perdido enviadas por alunos não ficam visíveis publicamente até serem aprovadas por um funcionário da coordenação.  
* Ao aprovar uma notificação, o funcionário pode optar por remover a foto anexada caso o conteúdo seja considerado sensível, mantendo o restante da descrição.  
* Os dados de quem retirou um item (nome, matrícula, contato) só ficam visíveis para funcionários da coordenação, nunca para visitantes ou alunos.  
* O acesso de aluno é concedido por e-mail \+ link mágico, sem exigência de domínio institucional específico, permitindo que qualquer pessoa (aluno, servidor ou visitante do CI) utilize o sistema.  
* Um item com status "Devolvido" deixa de aparecer na listagem padrão do mural, mas permanece no histórico.  
* A vinculação entre uma notificação de perdido e um item achado é feita manualmente por um funcionário, após comparação das descrições.  
* Contas de funcionário da coordenação não são de autocadastro: são criadas por um administrador do sistema a partir de uma lista fechada de e-mails autorizados.  
* O acesso da coordenação exige e-mail e senha, diferente do acesso do aluno, dado o nível de sensibilidade das informações e permissões envolvidas.  
* A sessão de funcionário expira após um período de inatividade mais curto que a sessão de aluno, reduzindo o risco de acesso indevido em dispositivo compartilhado.  
* Toda ação crítica realizada por um funcionário (aprovar, rejeitar, vincular, marcar como devolvido) é registrada em log de auditoria com autor, data e horário.  
* A validação de permissões (aluno vs. coordenação) deve ocorrer no backend em toda rota sensível, não apenas na interface visual.  
* Nem todo item cadastrado precisa ser publicado no mural: itens de alto valor (celular, tablet, notebook) podem ficar com visibilidade restrita, já que o dono costuma procurar diretamente e a entrega exige comprovação de posse (ex.: desbloqueio do aparelho).  
* Ao publicar um item no mural, dados sensíveis eventualmente visíveis na foto (ex.: informações pessoais em documentos) devem ser censurados antes da divulgação.  
* Itens não reclamados após um prazo definido (a validar com a coordenação) são doados; documentos não reclamados são triturados.  
* A foto é obrigatória apenas no cadastro de item achado pela coordenação; na notificação de perdido feita pelo aluno, a foto é opcional.  
* O aluno não recebe notificação por e-mail sobre atualizações; o acompanhamento é feito pela área "minhas notificações" dentro do sistema.  
* Comentários não passam por moderação prévia; qualquer pessoa pode denunciar um comentário, e a coordenação decide se remove (moderação reativa).

5\. Modelo de Dados Preliminar

As tabelas abaixo representam um levantamento inicial de atributos, a ser validado e ajustado após as entrevistas.

5.1 Item Achado

## 

| Atributo | Tipo/Formato | Observação |
| :---- | :---- | :---- |
| Título/nome | Texto curto | Obrigatório |
| Categoria | Lista pré-definida | Ex.: eletrônicos, documentos, roupas, acessórios |
| Foto | Imagem | Obrigatória |
| Descrição | Texto longo | Obrigatório |
| Local encontrado | Texto curto | Ex.: sala, bloco |
| Data e horário do achado | Data/hora | Obrigatório |
| Status | Enum | Ex.: aguardando, devolvido, doado, triturado — a validar outros status possíveis |
| Visibilidade pública | Sim/Não | Itens de alto valor (celular, tablet, notebook) podem não ser publicados no mural |

5.2 Notificação de Item Perdido

| Atributo | Tipo/Formato | Observação |
| :---- | :---- | :---- |
| Título/nome | Texto curto | Obrigatório |
| Categoria | Lista pré-definida | Mesma lista do item achado |
| Foto | Imagem | Opcional; pode ser removida na moderação |
| Descrição | Texto longo | Obrigatório |
| Local perdido | Texto curto |  |
| Data e horário da perda | Data/hora | Obrigatório |
| Status de moderação | Enum | Pendente, aprovado, rejeitado |
| Item vinculado | Referência | Preenchido quando a coordenação identifica correspondência |

5.3 Registro de Devolução

| Atributo | Tipo/Formato | Observação |
| :---- | :---- | :---- |
| Nome de quem retirou | Texto curto | Obrigatório |
| Matrícula | Texto curto | Obrigatório |
| Contato | Texto curto | E-mail ou telefone |
| Item vinculado | Referência | Item achado devolvido |
| Data da devolução | Data/hora | Preenchida automaticamente |
| Visibilidade | — | Acesso restrito a funcionários da coordenação |

6\. Fluxo de Moderação de Notificações

* 1\. Aluno autenticado envia notificação de item perdido (foto opcional).  
* 2\. Notificação entra em fila de "pendente", não visível publicamente.  
* 3\. Funcionário da coordenação revisa o conteúdo.  
* 4\. Funcionário aprova (com ou sem remoção da foto) ou rejeita a notificação.  
* 5\. Se aprovada, a notificação passa a aparecer no mural para todos os visitantes.  
* 6\. A qualquer momento, a coordenação pode vincular a notificação a um item achado correspondente.

7\. Requisitos Não Funcionais (preliminares)

| Categoria | Descrição |
| :---- | :---- |
| Proteção de dados pessoais (LGPD) | Dados de identificação (nome, matrícula, contato) coletados na devolução devem ser acessíveis apenas à coordenação e ter finalidade e prazo de retenção definidos. |
| Usabilidade | Interface simples o suficiente para uso por visitantes sem qualquer treinamento prévio. |
| Disponibilidade | Sistema deve estar acessível durante o período letivo, com tolerância a indisponibilidades pontuais por ser projeto acadêmico. |
| Desempenho | Carregamento do mural e da busca deve ser rápido mesmo com acúmulo de itens ao longo dos semestres. |
| Acessibilidade | A definir nível de conformidade (ex.: contraste, leitura por leitor de tela) — ponto a validar com a equipe. |
| Segurança de acesso | Contas de coordenação exigem MFA e são provisionadas por administrador; senhas armazenadas com hash forte; validação de permissões sempre no backend. |
| Auditoria e rastreabilidade | Ações críticas de funcionários (aprovação, rejeição, vínculo, devolução) ficam registradas com autor, data e horário, e não podem ser apagadas por usuários comuns. |

8\. Pontos em Aberto para Validar com a Equipe e a Coordenação

* Prazo exato (X meses) de guarda antes de doação/trituração.  
* Lista final de categorias de itens (eletrônicos, documentos, roupas, etc.).  
* Volume médio de itens por semana/mês na coordenação hoje, para dimensionar o sistema.  
* Por quanto tempo os dados do registro de devolução ficam armazenados.  
* Nível de acessibilidade exigido pela equipe/orientador.

