BibliotecaApi

API desenvolvida em C# para o gerenciamento de materiais de uma biblioteca universitária.

## Integrantes

Ludmila França de Oliveira

Vinícius Almeida Lopes

Gabriel Vieira Pellizzaro

 ## Sobre o projeto

O projeto tem como objetivo facilitar o gerenciamento de uma biblioteca universitária por meio de uma Web API.

Com ela, é possível cadastrar, consultar, atualizar e excluir livros e revistas, além de verificar informações e regras de empréstimo de cada material.

## Tecnologias utilizadas

C#

ASP.NET Core Web API (.NET 10)

Swagger

Repository Pattern

Dictionary em memória

## Como executar o projeto

Instale o SDK do .NET 10.

Abra a pasta BibliotecaApi no terminal.

Execute o comando dotnet restore.

Em seguida, execute dotnet run.

Acesse o endereço informado no terminal e acrescente /swagger para abrir a documentação da API.

# Observação: os dados são armazenados em memória e voltam aos valores iniciais sempre que a aplicação é reiniciada.

## Principais endpoints

Método

Endpoint

Função

## GET

/api/Materiais

Lista os materiais

## GET

/api/Materiais/{id}

Consulta por ID

## POST

/api/Materiais/livro

Cadastra um livro

## POST

/api/Materiais/revista

Cadastra uma revista

## PUT

/api/Materiais/livro/{id}

Atualiza um livro

## PUT

/api/Materiais/revista/{id}

Atualiza uma revista

## DELETE

/api/Materiais/{id}

Exclui um material

## GET

/api/Materiais/{id}/descricao

Consulta a descrição

## POST

/api/Materiais/{id}/emprestar

Verifica a possibilidade de empréstimo

## Exemplos de testes

Ao iniciar a aplicação, a biblioteca já possui dois materiais cadastrados:

ID 1: Livro Clean Code.

ID 2: Revista Tecnologia e Inovação.

Também foram realizados testes de cadastro, consulta, atualização, exclusão, validação de dados e empréstimos.

## Exemplo de cadastro de livro

Endpoint: POST /api/Materiais/livro

{
  "titulo": "Algoritmos e Programacao",
  "anoPublicacao": 2024,
  "autor": "Thomas H. Cormen",
  "paginas": 500
}

# Resultado esperado: a API retorna 201 Created e os dados do livro cadastrado, incluindo seu novo ID.

## Exemplo de consulta de descrição

Endpoint: GET /api/Materiais/1/descricao

O sistema retorna informações sobre o livro, incluindo seu tipo, descrição e prazo de empréstimo de 14 dias.

# Projeto desenvolvido como atividade acadêmica, com o objetivo de praticar conceitos de programação orientada a objetos e desenvolvimento de APIs em C#.