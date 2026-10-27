
let produtos = JSON.parse(localStorage.getItem("gdf_produtos"));
let idEmEdicao = null; 


const elTabela = document.getElementById("tabela-produtos");
const campoBusca = document.getElementById("busca");
const botaoNovo = document.getElementById("botao-novo");
const modal = document.getElementById("modal");
const formProduto = document.getElementById("form-produto");
const modalTitulo = document.getElementById("modal-titulo");
const campoNome = document.getElementById("campo-nome");
const campoUnidade = document.getElementById("campo-unidade");
const campoAtual = document.getElementById("campo-atual");
const campoMinimo = document.getElementById("campo-minimo");
const campoImagem = document.getElementById("campo-imagem");
const erroForm = document.getElementById("erro-form");
const botaoCancelar = document.getElementById("botao-cancelar");


function salvar() {
  localStorage.setItem("gdf_produtos", JSON.stringify(produtos));
}


function escapar(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


function criarFoto(produto) {
  if (produto.imagem !== "") {
    return `<img class="foto-produto" src="${escapar(produto.imagem)}" alt="${escapar(produto.nome)}">`;
  }
  return `<span class="foto-produto"></span>`;
}


function mostrarTabela() {
  const termo = campoBusca.value.trim().toLowerCase();


  const lista = produtos.filter(function (produto) {
    return produto.nome.toLowerCase().includes(termo);
  });

  if (lista.length === 0) {
    const texto = produtos.length === 0 ? "Nenhum produto cadastrado." : "Nenhum produto encontrado.";
    elTabela.innerHTML = `<tr><td colspan="6" class="mensagem-vazia">${texto}</td></tr>`;
    return;
  }

  let linhas = "";
  lista.forEach(function (produto) {

    const baixo = produto.atual <= produto.minimo;
    const etiqueta = baixo
      ? `<span class="etiqueta etiqueta-baixo">Estoque baixo</span>`
      : `<span class="etiqueta etiqueta-normal">Normal</span>`;

    linhas += `
      <tr>
        <td><span class="produto-nome">${criarFoto(produto)}${escapar(produto.nome)}</span></td>
        <td>${escapar(produto.unidade)}</td>
        <td>${produto.atual}</td>
        <td>${produto.minimo}</td>
        <td>${etiqueta}</td>
        <td>
          <div class="acoes">
            <button type="button" class="botao-icone" data-acao="editar" data-id="${produto.id}" aria-label="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
              </svg>
            </button>
            <button type="button" class="botao-icone excluir" data-acao="excluir" data-id="${produto.id}" aria-label="Excluir">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M3 6h18"></path>
                <path d="M8 6V4h8v2"></path>
                <path d="M6 6l1 14h10l1-14"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>`;
  });

  elTabela.innerHTML = linhas;
}


function abrirModal(produto) {
  erroForm.textContent = "";

  if (produto) {
    idEmEdicao = produto.id;
    modalTitulo.textContent = "Editar produto";
    campoNome.value = produto.nome;
    campoUnidade.value = produto.unidade;
    campoAtual.value = produto.atual;
    campoMinimo.value = produto.minimo;
    campoImagem.value = produto.imagem;
  } else {
    idEmEdicao = null;
    modalTitulo.textContent = "Novo produto";
    formProduto.reset(); 
  }

  modal.classList.add("aberto");
  campoNome.focus();
}

function fecharModal() {
  modal.classList.remove("aberto");
}


formProduto.addEventListener("submit", function (evento) {
  evento.preventDefault(); 

  const nome = campoNome.value.trim();
  const unidade = campoUnidade.value;
  const atual = Number(campoAtual.value);
  const minimo = Number(campoMinimo.value);
  const imagem = campoImagem.value.trim();


  if (nome === "") {
    erroForm.textContent = "Digite o nome do produto.";
    return;
  }
  if (unidade === "") {
    erroForm.textContent = "Escolha a unidade.";
    return;
  }
  if (campoAtual.value === "" || isNaN(atual) || atual < 0) {
    erroForm.textContent = "Digite uma quantidade atual válida (0 ou mais).";
    return;
  }
  if (campoMinimo.value === "" || isNaN(minimo) || minimo < 0) {
    erroForm.textContent = "Digite uma quantidade mínima válida (0 ou mais).";
    return;
  }

  if (idEmEdicao === null) {

    let maiorId = 0;
    produtos.forEach(function (p) {
      if (p.id > maiorId) {
        maiorId = p.id;
      }
    });
    produtos.push({ id: maiorId + 1, nome: nome, unidade: unidade, atual: atual, minimo: minimo, imagem: imagem });
  } else {

    const produto = produtos.find(function (p) {
      return p.id === idEmEdicao;
    });
    produto.nome = nome;
    produto.unidade = unidade;
    produto.atual = atual;
    produto.minimo = minimo;
    produto.imagem = imagem;
  }

  salvar();        
  mostrarTabela(); 
  fecharModal();
});


botaoNovo.addEventListener("click", function () {
  abrirModal(null);
});

botaoCancelar.addEventListener("click", fecharModal);


modal.addEventListener("click", function (evento) {
  if (evento.target === modal) {
    fecharModal();
  }
});


campoBusca.addEventListener("input", mostrarTabela);


elTabela.addEventListener("click", function (evento) {
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) {
    return;
  }

  const id = Number(botao.dataset.id);
  const produto = produtos.find(function (p) {
    return p.id === id;
  });

  if (botao.dataset.acao === "editar") {
    abrirModal(produto);
  }

  if (botao.dataset.acao === "excluir") {
    if (confirm('Excluir o produto "' + produto.nome + '"?')) {
      produtos = produtos.filter(function (p) {
        return p.id !== id;
      });
      salvar();
      mostrarTabela();
    }
  }
});


mostrarTabela();