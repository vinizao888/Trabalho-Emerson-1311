const API_URL = "https://localhost:5000/api/Materiais"; // troque a porta

// ---------- utilitários ----------
function mostrarMensagem(texto, tipo = "success") {
  const area = document.querySelector("#mensagens");
  area.textContent = texto;
  area.className = `alert alert-${tipo}`;   // success | danger | warning
  area.classList.remove("d-none");
  setTimeout(() => area.classList.add("d-none"), 5000);
}

async function lerErro(response) {
  // tenta ler o texto/JSON de erro que a API devolveu
  try {
    const dados = await response.json();
    return dados.mensagem || dados.title || JSON.stringify(dados);
  } catch {
    return `Erro ${response.status}`;
  }
}

function renderizarMateriais(materiais) {
  const tbody = document.querySelector("#tabela-materiais");
  tbody.textContent = "";                       // limpa

  if (materiais.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = "Nenhum material cadastrado.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  materiais.forEach(m => {
    const tr = document.createElement("tr");
    // criar <td> para título, ano, tipo, detalhes (autor/páginas OU edição/mês)
    // e uma <td> com os botões, cada um com addEventListener:
    //   btnEditar.addEventListener("click", () => abrirEdicao(m.id));
    //   btnExcluir.addEventListener("click", () => excluirMaterial(m.id));
    tbody.appendChild(tr);
  });
}
async function cadastrarLivro(event) {
  event.preventDefault();                       // impede o recarregamento da página

  const livro = {
    titulo: document.querySelector("#livro-titulo").value.trim(),
    anoPublicacao: Number(document.querySelector("#livro-ano").value),
    autor: document.querySelector("#livro-autor").value.trim(),
    paginas: Number(document.querySelector("#livro-paginas").value)
  };

  const erros = validarLivro(livro);
  if (erros.length > 0) {
    mostrarMensagem(erros.join(" "), "danger");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/livro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livro)               // sem id: quem gera é a API
    });
    if (!response.ok) throw new Error(await lerErro(response));
    mostrarMensagem("Livro cadastrado com sucesso!");
    event.target.reset();
    carregarMateriais();
  } catch (erro) {
    mostrarMensagem("Erro ao cadastrar: " + erro.message, "danger");
  }
}

document.querySelector("#form-livro").addEventListener("submit", cadastrarLivro);
async function excluirMaterial(id) {
  if (!confirm("Tem certeza que deseja excluir este material?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (response.status === 404) {
      mostrarMensagem("Material não encontrado (talvez já tenha sido excluído).", "warning");
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