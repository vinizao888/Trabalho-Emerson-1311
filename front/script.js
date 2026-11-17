
const API_URL = "http://localhost:5000/api/Materiais";

const areaMensagens = document.querySelector("#mensagens");
const tabelaMateriais = document.querySelector("#tabela-materiais");
const formLivro = document.querySelector("#form-livro");
const formRevista = document.querySelector("#form-revista");
const formEdicao = document.querySelector("#form-edicao");

// UTILITÁRIOS
let temporizador;

function mostrarMensagem(texto, tipo = "success") {
  areaMensagens.textContent = texto;
  areaMensagens.className = `alert alert-${tipo}`;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => areaMensagens.classList.add("d-none"), 6000);
}

// Lê o corpo da resposta como texto e tenta converter para JSON.
async function lerCorpo(response) {
  const texto = await response.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

function extrairTexto(corpo) {
  if (typeof corpo === "string") return corpo;
  if (corpo && (corpo.mensagem || corpo.message || corpo.title)) {
    return corpo.mensagem || corpo.message || corpo.title;
  }
  return "";
}

async function lerErro(response) {
  const texto = extrairTexto(await lerCorpo(response));
  return texto || `Erro ${response.status}`;
}

function criarCelula(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

function criarBotao(texto, classes, aoClicar) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = `btn btn-sm ${classes}`;
  botao.textContent = texto;
  botao.addEventListener("click", aoClicar);
  return botao;
}

// A API usa [JsonPolymorphic] e devolve "tipoMaterial": "Livro" ou "Revista"
// na listagem. No GET por ID esse campo pode não vir, então, se ele faltar,
// o livro é reconhecido por ter o campo "autor".
function ehLivro(material) {
  if (material.tipoMaterial !== undefined) {
    return String(material.tipoMaterial).toLowerCase() === "livro";
  }
  return material.autor !== undefined;
}

function abrirModal(seletor) {
  bootstrap.Modal.getOrCreateInstance(document.querySelector(seletor)).show();
}

function fecharModal(seletor) {
  bootstrap.Modal.getOrCreateInstance(document.querySelector(seletor)).hide();
}

// GET: LISTAR, RENDERIZAR E RESUMO
async function carregarMateriais() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(await lerErro(response));

    const materiais = await response.json();
    renderizarMateriais(materiais);
    atualizarResumo(materiais);
  } catch (erro) {
    tabelaMateriais.textContent = "";
    mostrarMensagem("Não foi possível carregar os materiais: " + erro.message, "danger");
  }
}

function descreverDetalhes(material) {
  if (ehLivro(material)) {
    return `Autor: ${material.autor} | ${material.paginas} páginas`;
  }
  return `Edição ${material.edicao} | Mês: ${material.mesPublicacao}`;
}

function renderizarMateriais(materiais) {
  tabelaMateriais.textContent = "";

  if (materiais.length === 0) {
    const tr = document.createElement("tr");
    const td = criarCelula("Nenhum material cadastrado. Use o formulário acima para adicionar o primeiro.");
    td.colSpan = 5;
    tr.appendChild(td);
    tabelaMateriais.appendChild(tr);
    return;
  }

  materiais.forEach((material) => {
    const tr = document.createElement("tr");
    tr.appendChild(criarCelula(material.titulo));
    tr.appendChild(criarCelula(material.anoPublicacao));
    tr.appendChild(criarCelula(ehLivro(material) ? "Livro" : "Revista"));
    tr.appendChild(criarCelula(descreverDetalhes(material)));

    const tdAcoes = document.createElement("td");
    const divAcoes = document.createElement("div");
    divAcoes.className = "acoes";
    divAcoes.append(
      criarBotao("Detalhes", "btn-outline-primary", () => mostrarDetalhes(material.id)),
      criarBotao("Descrição e prazo", "btn-outline-secondary", () => mostrarDescricao(material.id)),
      criarBotao("Emprestar", "btn-outline-success", () => emprestarMaterial(material.id)),
      criarBotao("Editar", "btn-warning", () => abrirEdicao(material.id)),
      criarBotao("Excluir", "btn-danger", () => excluirMaterial(material.id))
    );
    tdAcoes.appendChild(divAcoes);
    tr.appendChild(tdAcoes);

    tabelaMateriais.appendChild(tr);
  });
}

function atualizarResumo(materiais) {
  const livros = materiais.filter(ehLivro).length;
  document.querySelector("#total-materiais").textContent = materiais.length;
  document.querySelector("#total-livros").textContent = livros;
  document.querySelector("#total-revistas").textContent = materiais.length - livros;
}

// VALIDAÇÃO (a API continua precisando validar também)
function anoValido(ano) {
  return Number.isInteger(ano) && ano >= 1000 && ano <= new Date().getFullYear();
}

function validarLivro(livro) {
  const erros = [];
  if (!livro.titulo) erros.push("Informe o título.");
  if (!livro.autor) erros.push("Informe o autor.");
  if (!anoValido(livro.anoPublicacao)) {
    erros.push(`O ano deve estar entre 1000 e ${new Date().getFullYear()}.`);
  }
  if (!Number.isInteger(livro.paginas) || livro.paginas <= 0) {
    erros.push("O número de páginas deve ser maior que zero.");
  }
  return erros;
}

function validarRevista(revista) {
  const erros = [];
  if (!revista.titulo) erros.push("Informe o título.");
  if (!anoValido(revista.anoPublicacao)) {
    erros.push(`O ano deve estar entre 1000 e ${new Date().getFullYear()}.`);
  }
  if (!Number.isInteger(revista.edicao) || revista.edicao <= 0) {
    erros.push("A edição deve ser maior que zero.");
  }
  if (!Number.isInteger(revista.mesPublicacao) || revista.mesPublicacao < 1 || revista.mesPublicacao > 12) {
    erros.push("O mês deve estar entre 1 e 12.");
  }
  return erros;
}

// POST: CADASTRAR
function lerFormularioLivro() {
  return {
    titulo: document.querySelector("#livro-titulo").value.trim(),
    anoPublicacao: Number(document.querySelector("#livro-ano").value),
    autor: document.querySelector("#livro-autor").value.trim(),
    paginas: Number(document.querySelector("#livro-paginas").value)
  };
}

function lerFormularioRevista() {
  return {
    titulo: document.querySelector("#revista-titulo").value.trim(),
    anoPublicacao: Number(document.querySelector("#revista-ano").value),
    edicao: Number(document.querySelector("#revista-edicao").value),
    mesPublicacao: Number(document.querySelector("#revista-mes").value)
  };
}

async function enviarCadastro(endpoint, dados, nome) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error(await lerErro(response));

    mostrarMensagem(`${nome} cadastrado com sucesso!`);
    carregarMateriais();
    return true;
  } catch (erro) {
    mostrarMensagem(`Erro ao cadastrar ${nome.toLowerCase()}: ${erro.message}`, "danger");
    return false;
  }
}

async function cadastrarLivro(event) {
  event.preventDefault();
  const livro = lerFormularioLivro();
  const erros = validarLivro(livro);
  if (erros.length > 0) {
    mostrarMensagem(erros.join(" "), "danger");
    return;
  }
  if (await enviarCadastro("livro", livro, "Livro")) formLivro.reset();
}

async function cadastrarRevista(event) {
  event.preventDefault();
  const revista = lerFormularioRevista();
  const erros = validarRevista(revista);
  if (erros.length > 0) {
    mostrarMensagem(erros.join(" "), "danger");
    return;
  }
  if (await enviarCadastro("revista", revista, "Revista")) formRevista.reset();
}

// GET POR ID: DETALHES
async function buscarMaterial(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (response.status === 404) throw new Error("Material não encontrado.");
  if (!response.ok) throw new Error(await lerErro(response));
  return response.json();
}

function abrirModalDetalhes(titulo, linhas) {
  document.querySelector("#titulo-modal-detalhes").textContent = titulo;
  const lista = document.querySelector("#detalhes-conteudo");
  lista.textContent = "";

  linhas.forEach(([rotulo, valor]) => {
    const dt = document.createElement("dt");
    dt.textContent = rotulo;
    const dd = document.createElement("dd");
    dd.textContent = valor;
    lista.append(dt, dd);
  });

  abrirModal("#modal-detalhes");
}

async function mostrarDetalhes(id) {
  try {
    const material = await buscarMaterial(id);
    const linhas = [
      ["Título", material.titulo],
      ["Ano de publicação", material.anoPublicacao],
      ["Tipo", ehLivro(material) ? "Livro" : "Revista"]
    ];
    if (ehLivro(material)) {
      linhas.push(["Autor", material.autor], ["Páginas", material.paginas]);
    } else {
      linhas.push(["Edição", material.edicao], ["Mês de publicação", material.mesPublicacao]);
    }
    abrirModalDetalhes("Detalhes do material", linhas);
  } catch (erro) {
    mostrarMensagem(erro.message, "danger");
  }
}

// PUT: EDITAR
async function abrirEdicao(id) {
  try {
    const material = await buscarMaterial(id);
    const livro = ehLivro(material);

    document.querySelector("#edicao-id").value = material.id;
    document.querySelector("#edicao-tipo").value = livro ? "livro" : "revista";
    document.querySelector("#edicao-titulo").value = material.titulo;
    document.querySelector("#edicao-ano").value = material.anoPublicacao;

    document.querySelector("#edicao-campos-livro").classList.toggle("d-none", !livro);
    document.querySelector("#edicao-campos-revista").classList.toggle("d-none", livro);

    if (livro) {
      document.querySelector("#edicao-autor").value = material.autor;
      document.querySelector("#edicao-paginas").value = material.paginas;
    } else {
      document.querySelector("#edicao-edicao").value = material.edicao;
      document.querySelector("#edicao-mes").value = material.mesPublicacao;
    }

    abrirModal("#modal-edicao");
  } catch (erro) {
    mostrarMensagem(erro.message, "danger");
  }
}

async function salvarEdicao(event) {
  event.preventDefault();

  const id = document.querySelector("#edicao-id").value;
  const tipo = document.querySelector("#edicao-tipo").value;
  const titulo = document.querySelector("#edicao-titulo").value.trim();
  const anoPublicacao = Number(document.querySelector("#edicao-ano").value);

  let dados;
  let erros;
  if (tipo === "livro") {
    dados = {
      titulo,
      anoPublicacao,
      autor: document.querySelector("#edicao-autor").value.trim(),
      paginas: Number(document.querySelector("#edicao-paginas").value)
    };
    erros = validarLivro(dados);
  } else {
    dados = {
      titulo,
      anoPublicacao,
      edicao: Number(document.querySelector("#edicao-edicao").value),
      mesPublicacao: Number(document.querySelector("#edicao-mes").value)
    };
    erros = validarRevista(dados);
  }

  if (erros.length > 0) {
    mostrarMensagem(erros.join(" "), "danger");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${tipo}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    if (response.status === 404) throw new Error("Material não encontrado.");
    if (!response.ok) throw new Error(await lerErro(response));

    fecharModal("#modal-edicao");
    mostrarMensagem("Material atualizado com sucesso!");
    carregarMateriais();
  } catch (erro) {
    mostrarMensagem("Erro ao atualizar: " + erro.message, "danger");
  }
}

// DELETE: EXCLUIR
async function excluirMaterial(id) {
  if (!confirm("Tem certeza que deseja excluir este material?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (response.status === 404) {
      mostrarMensagem("Material não encontrado. Talvez já tenha sido excluído.", "warning");
    } else if (!response.ok) {
      throw new Error(await lerErro(response));
    } else {
      mostrarMensagem("Material excluído com sucesso!");
    }
    carregarMateriais();
  } catch (erro) {
    mostrarMensagem("Erro ao excluir: " + erro.message, "danger");
  }
}

// DESCRIÇÃO, PRAZO E EMPRÉSTIMO
async function mostrarDescricao(id) {
  try {
    const response = await fetch(`${API_URL}/${id}/descricao`);
    if (response.status === 404) throw new Error("Material não encontrado.");
    if (!response.ok) throw new Error(await lerErro(response));

    // A API devolve: { id, tipo, descricao, prazoEmprestimo }
    const dados = await response.json();
    abrirModalDetalhes("Descrição e prazo de empréstimo", [
      ["Tipo", dados.tipo],
      ["Descrição", dados.descricao],
      ["Prazo de empréstimo", `${dados.prazoEmprestimo} dias`]
    ]);
  } catch (erro) {
    mostrarMensagem(erro.message, "danger");
  }
}

async function emprestarMaterial(id) {
  try {
    const response = await fetch(`${API_URL}/${id}/emprestar`, { method: "POST" });

    if (response.status === 404) {
      mostrarMensagem("Material não encontrado.", "warning");
      return;
    }

    const textoApi = extrairTexto(await lerCorpo(response));
    if (response.ok) {
      mostrarMensagem(textoApi || "Empréstimo realizado com sucesso!");
    } else {
      mostrarMensagem(textoApi || "Este material não pode ser emprestado.", "danger");
    }
  } catch (erro) {
    mostrarMensagem("Não foi possível falar com a API: " + erro.message, "danger");
  }
}

// EVENTOS E INICIALIZAÇÃO
formLivro.addEventListener("submit", cadastrarLivro);
formRevista.addEventListener("submit", cadastrarRevista);
formEdicao.addEventListener("submit", salvarEdicao);
document.querySelector("#btn-atualizar").addEventListener("click", carregarMateriais);

carregarMateriais();
