Front-end da BibliotecaApi

Interface web desenvolvida para consumir a Web API de biblioteca universitária criada na disciplina de Programação Orientada a Objetos.

## Integrantes

Ludmila França de Oliveira

Vinícius Almeida Lopes

Gabriel Vieira Pellizzaro

## Sobre o projeto

O front-end é uma página única que se comunica com a API para gerenciar os livros e as revistas da biblioteca.

Por ela é possível listar os materiais, consultar um material, cadastrar livros e revistas, editar, excluir, ver a descrição com o prazo de empréstimo e tentar realizar o empréstimo.

## Tecnologias utilizadas

HTML5

CSS3

Bootstrap 5.3 (via CDN)

JavaScript ES6

fetch com async e await

Git e GitHub

## Como executar o projeto

Primeiro, execute a API: abra a pasta BibliotecaApi no terminal e rode dotnet restore e depois dotnet run.

Confira no terminal qual endereço a API está usando. Neste projeto usamos http://localhost:5000.

Abra a pasta front no Visual Studio Code e inicie o index.html com o Live Server.

# Observação: se a porta da API for diferente de 5000, altere a constante API_URL no começo do script.js. Os dados da API ficam em memória e voltam ao início quando ela é reiniciada.

## URL da API utilizada

const API_URL = "http://localhost:5000/api/Materiais";

## Endpoints consumidos

Método

Endpoint

Onde usamos

## GET

/api/Materiais

Listar os materiais e montar o resumo

## GET

/api/Materiais/{id}

Botão Detalhes e preenchimento do formulário de edição

## POST

/api/Materiais/livro

Cadastro de livro

## POST

/api/Materiais/revista

Cadastro de revista

## PUT

/api/Materiais/livro/{id}

Edição de livro

## PUT

/api/Materiais/revista/{id}

Edição de revista

## DELETE

/api/Materiais/{id}

Botão Excluir

## GET

/api/Materiais/{id}/descricao

Botão Descrição e prazo

## POST

/api/Materiais/{id}/emprestar

Botão Emprestar

## Organização da pasta front

index.html: estrutura da página (cabeçalho, resumo, cadastro, tabela e os dois modais).

script.css: ajustes visuais que complementam o Bootstrap (cores, sombras, foco dos campos e telas pequenas).

script.js: toda a comunicação com a API e as mudanças na tela.

O script.js foi dividido em funções, cada uma com uma tarefa:

carregarMateriais e renderizarMateriais: buscam a lista e desenham a tabela.

atualizarResumo: calcula o total, a quantidade de livros e de revistas.

validarLivro e validarRevista: checam os campos antes de enviar.

cadastrarLivro e cadastrarRevista: enviam o POST.

abrirEdicao e salvarEdicao: preenchem o formulário e enviam o PUT.

excluirMaterial: pede confirmação e envia o DELETE.

mostrarDescricao e emprestarMaterial: mostram o prazo e tentam o empréstimo.

mostrarMensagem: exibe os avisos de sucesso e erro.

## Componentes do Bootstrap utilizados

Grid (container, row e col) para a página se ajustar a telas pequenas, médias e grandes.

Cards para o resumo do acervo.

Abas (nav-tabs) para alternar entre o cadastro de livro e de revista.

Tabela responsiva (table-responsive, table-striped e table-hover).

Modais para edição e para detalhes/descrição.

Alerts para as mensagens de sucesso, erro e aviso.

Botões com cores diferentes para cada ação.

## Validações implementadas

Título obrigatório.

Autor obrigatório (livro).

Ano de publicação como número inteiro entre 1000 e o ano atual.

Número de páginas maior que zero (livro).

Número da edição maior que zero (revista).

Mês de publicação entre 1 e 12 (revista).

# Observação: essas validações melhoram a experiência, mas a API também valida os dados e é ela que tem a palavra final.

## Como cada ação foi tratada

Lista vazia: aparece a mensagem "Nenhum material cadastrado".

API desligada ou erro na requisição: aparece uma mensagem vermelha na tela.

Excluir: pede confirmação e, se o material não existir, mostra um aviso.

Emprestar um livro: mensagem de sucesso.

Emprestar uma revista: mensagem de erro, pois a API não permite.

Material não encontrado: mensagem de aviso.

## Testes realizados
Teste: Listar os materiais ao abrir a página

Resultado esperado: aparecem Clean Code e Tecnologia e Inovação

Resultado obtido: aparecem os dois itens

Teste: Cadastrar livro com título vazio

Resultado esperado: mensagem de validação, sem chamar a API

Resultado obtido: mensagem de validaçõa

Teste: Cadastrar revista com mês 13

Resultado esperado: mensagem de validação

Resultado obtido: mensagem de validação

Teste: Emprestar um livro

Resultado esperado: mensagem de sucesso

Resultado obtido: não é possivel emprestar ainda

Teste: Emprestar uma revista

Resultado esperado: mensagem de erro

Resultado obtido: mensagem de erro

Teste: Excluir o mesmo material duas vezes

Resultado esperado: aviso de material não encontrado

Resultado obtido: aviso

Teste: Editar um livro e uma revista

Resultado esperado: lista atualizada com os novos dados

Resultado obtido: lista atualizada

Teste: Parar a API e atualizar a lista

Resultado esperado: mensagem de erro na tela

Resultado obtido: mensagem de erro

Teste: Abrir em tela de celular (cerca de 375px)

Resultado esperado: nada cortado

Resultado obtido:nada cortado, porém rolagem lateral na listagem de itens

## Dificuldades encontradas
Uma das maiores dificuldades foi o erro "Failed to fetch". Ele apareceu
quando abrimos o front-end pela primeira vez: a lista de materiais não
carregava e a tela mostrava a mensagem vermelha de erro

## Como resolvemos as dificuldades
Abrimos o Console do navegador (F12) e a aba Network para ver o que estava
acontecendo. Descobrimos que o endereço do localhost estava errado. Para resolver rodamos a Api novamente e pegamos o endereço correto. Depois disso, a lista passou a carregar.

# Projeto desenvolvido como atividade acadêmica, com o objetivo de praticar HTML, Bootstrap, JavaScript e o consumo de uma API com fetch.
