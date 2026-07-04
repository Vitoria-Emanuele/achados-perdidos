# 1\. Introdução e Viabilidade do Projeto

Atualmente, o fluxo de comunicação sobre itens perdidos no centro de informática da UFPB gera um alto volume de e-mails, o que é ineficiente e sobrecarrega o armazenamento institucional. Para solucionar este problema, propomos o desenvolvimento de um sistema centralizado de achados e perdidos. O projeto é pertinente, pois existe uma clara demanda pela organização dessas informações e sua implementação técnica é viável no curto prazo.

# 2\. Equipe de Desenvolvimento

Atuaremos como um grupo auto-organizado de desenvolvedores. Teremos total autonomia para decidir como o trabalho será dividido e executado. Nossa equipe é composta pelos seguintes alunos:

* Fábio Filipe Martins Figueiredo;  
* Thaynara Magno Rodrigues;  
* Lucas Leite Mota Dias;  
* Iago Vitor Lopes das Chagas;  
* Kennyo Wescley Elias Cavalcante;  
* Vitória Emanuele de Sousa Silva.

# 3\. Metodologia de Desenvolvimento

Adotaremos o desenvolvimento ágil guiado pelo método scrum. A escolha do Scrum se justifica porque ele é um método ágil geral que foca no gerenciamento do desenvolvimento iterativo. Como os requisitos de sistemas frequentemente mudam, uma abordagem ágil nos permite acomodar essas mudanças facilmente. O projeto será construído em ciclos chamados de sprints, garantindo entregas contínuas.

# 4\. Modelo de Processo

Para o desenvolvimento do sistema, utilizaremos o modelo de integração e configuração, trabalhando em conjunto com o modelo de desenvolvimento incremental.  A escolha desse modelo se dá pelo seu foco no reuso de software. Em vez de programar toda a infraestrutura do zero, faremos a integração de serviços web já existentes e disponibilizados para invocação remota através da internet. Essa escolha estratégica nos traz grandes benefícios:

* Redução de custos e esforço: Menor quantidade de software precisa ser desenvolvida do zero.  
* Redução de riscos: Utilizaremos software e componentes que já foram prévios e amplamente testados.  
* Entrega rápida: Proporciona uma entrega muito mais ágil do sistema funcional.

# 5\. Requisitos de Usuário

Como adotamos o desenvolvimento ágil e incremental, nosso documento de requisitos adota propositalmente descrições menos detalhadas neste momento inicial. A especificação do sistema será baseada no backlog do produto, utilizando a técnica de histórias de usuário para expressar os cenários em linguagem natural:

* História 1: Como um funcionário da coordenação, eu quero cadastrar um item encontrado informando sua categoria, descrição e foto, de modo que o objeto fique visível no mural virtual oficial do centro.  
* História 2: Como um funcionário da coordenação, eu quero alterar o status de um item para "Devolvido", de modo que o mural mostre apenas os objetos que ainda aguardam retirada.  
* História 3: Como um aluno, eu quero visualizar, buscar e filtrar os itens do mural, de modo que eu possa verificar rapidamente se algo que perdi já foi achado.  
* História 4: Como um aluno, eu quero adicionar um comentário público informando que perdi um item específico, de modo que todos saibam o que procurar.

# 6\. Cronograma, Prazos e Organização de Tarefas

Para organizar as entregas no prazo estipulado pela disciplina, dividiremos nosso ciclo de trabalho em sprints (iterações de desenvolvimento), com duração fixa de 2 semanas. O nosso projeto utilizará um quadro scrum hospedado na ferramenta de gerenciamento Jira. O quadro conterá as colunas "A fazer", "Em andamento", "Para verificar" e "Concluído", servindo como um recurso visual compartilhado que permite identificar facilmente o que cada membro está desenvolvendo e o que ainda está pendente. as nossas histórias de usuário (definidas no backlog do produto) serão decompostas em tarefas menores pela equipe. A equipe fará o jogo do planejamento e adotará uma abordagem de alocação onde os próprios desenvolvedores se candidatam para implementar tarefas específicas baseados na velocidade da equipe.  
