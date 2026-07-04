# Plano de Testes — Sistema de Achados e Perdidos

Este documento define como cada história de usuário será testada.

## Como usar este documento

Para cada entrega/sprint, quem for testar a funcionalidade correspondente segue os passos da coluna "Como testar" e marca o resultado (Passou / Falhou / Não testado) numa cópia deste arquivo ou numa Issue do GitHub.

## RF01 — Cadastro de item achado

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Cadastro com todos os campos | Logar como coordenação, preencher título, categoria, foto, descrição, local e data, salvar | Item aparece no mural com status "aguardando" |  |
| Cadastro sem foto | Tentar salvar sem anexar foto | Sistema bloqueia e avisa que foto é obrigatória |  |
| Cadastro sem campo obrigatório | Deixar título ou descrição em branco | Sistema bloqueia e indica o campo faltante |  |

## RF02 — Atualizar status do item / devolução

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Marcar como devolvido | Abrir um item "aguardando", preencher nome/matrícula/contato de quem retirou, confirmar | Status muda para "devolvido"; item some da listagem padrão do mural |  |
| Dados de devolução ficam restritos | Tentar acessar os dados de quem retirou logado como aluno | Acesso deve ser negado (RLS) |  |

## RF03 — Visualizar e buscar itens

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Listagem geral | Acessar o mural sem estar logado | Itens com visibilidade pública aparecem |  |
| Busca por palavra-chave | Buscar por parte do título/descrição de um item existente | Item correspondente aparece nos resultados |  |
| Filtro por categoria | Selecionar uma categoria | Só itens daquela categoria aparecem |  |
| Item de visibilidade restrita | Cadastrar item com visibilidade\_publica \= false | Item não aparece no mural público |  |

## RF04 — Autenticação por link mágico (aluno)

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Login com e-mail novo | Inserir e-mail nunca usado antes | Perfil é criado automaticamente (role "aluno") e link é enviado |  |
| Login com e-mail existente | Repetir login com mesmo e-mail | Recebe novo link, sem duplicar perfil |  |
| Link expirado | Aguardar expiração do link e tentar usar | Sistema informa que o link expirou e permite solicitar novo |  |

## RF05 — Cadastro de notificação de item perdido

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Cadastro sem foto | Preencher todos os campos exceto foto | Sistema aceita normalmente (foto é opcional) |  |
| Cadastro sem estar logado | Tentar acessar o formulário sem login | Sistema redireciona para login |  |
| Notificação não aparece antes de aprovação | Cadastrar notificação e checar o mural imediatamente | Notificação não deve aparecer publicamente ainda |  |

## RF06 — Moderação de notificações

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Aprovar notificação | Logado como coordenação, aprovar uma notificação pendente | Notificação passa a aparecer no mural |  |
| Rejeitar notificação | Rejeitar uma notificação pendente | Notificação não aparece e some da fila de pendentes |  |
| Remover apenas a foto | Aprovar removendo a foto anexada | Notificação aparece sem a foto, restante do conteúdo mantido |  |
| Aluno não acessa moderação | Tentar acessar a tela de moderação logado como aluno | Acesso deve ser negado |  |

## RF07 — Vínculo entre item achado e notificação

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Vincular manualmente | Selecionar uma notificação e um item achado correspondente | Campo item\_vinculado\_id da notificação é preenchido |  |
| Aluno vê vínculo | Acessar "minhas notificações" após o vínculo | Status/vínculo deve refletir a mudança |  |

## RF08 — Comentário público em item

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Comentar logado | Adicionar comentário em um item do mural | Comentário aparece publicamente, sem moderação prévia |  |
| Comentar sem login | Tentar comentar sem estar autenticado | Sistema bloqueia e pede login |  |

## RF09 — Autenticação reforçada da coordenação

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Login com e-email e senhas corretos | Logar como coordenação com credenciais válidas | Acesso concedido, papel "coordenacao" reconhecido pelo sistema |  |
| Login com senha incorreta | Tentar logar como senha errada | Sistema recusa e informa “E-mail ou senha incorretos” |  |
| Conta não provisionada | Tentar logar como coordenação com e-mail não cadastrado nesse role | Sistema direciona para o fluxo de aluno (link mágico) em vez de pedir senha |  |

## RF10 — Log de auditoria de ações críticas

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Aprovação registrada | Aprovar uma notificação | Campo moderado\_por é preenchido com o id de quem aprovou |  |
| Devolução registrada | Registrar uma devolução | Campo registrado\_por é preenchido corretamente |  |

## RF11 — Acompanhamento das próprias notificações

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Ver notificações próprias | Logar como aluno que já enviou notificações | Lista mostra apenas as notificações daquele aluno, com status atualizado |  |
| Não ver notificações de outros | Tentar acessar notificação de outro aluno pela URL direta | Acesso deve ser negado |  |

## RF12 — Denúncia de comentário

| Caso de teste | Como testar | Resultado esperado | Resultado |
| :---- | :---- | :---- | :---- |
| Denunciar comentário | Clicar em "denunciar" em um comentário | Comentário é marcado como denunciado=true |  |
| Coordenação remove comentário denunciado | Acessar lista de denúncias e remover um comentário | Comentário some do mural (status \= removido) |  |

## Testes não funcionais (verificação geral, não por história específica)

| Categoria | Como testar | Resultado |
| :---- | :---- | :---- |
| Segurança de dados (RLS) | Tentar acessar `registros_devolucao` com um usuário aluno autenticado; deve falhar |  |
| Responsividade | Abrir o mural em celular e desktop, checar se o layout se adapta |  |
| Tempo de carregamento | Medir tempo de carregamento do mural com ao menos 20 itens cadastrados |  |

