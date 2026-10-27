
const produtos = JSON.parse(localStorage.getItem("gdf_produtos"));
const movimentacoes = JSON.parse(localStorage.getItem("gdf_movimentacoes"));


const formMov = document.getElementById("form-mov");
const campoProduto = document.getElementById("campo-produto");
const dicaEstoque = document.getElementById("dica-estoque");
const campoQuantidade = document.getElementById("campo-quantidade");
const campoObservacao = document.getElementById("campo-observacao");
const erroForm = document.getElementById("erro-form");
const sucessoForm = document.getElementById("sucesso-form");
const botaoCancelar = document.getElementById("botao-cancelar");
const elTabela = document.getElementById("tabela-movimentacoes");


function salvar() {
  localStorage.setItem("gdf_produtos", JSON.stringify(produtos));
  localStorage.setItem("gdf_movimentacoes", JSON.stringify(movimentacoes));
}


function escapar(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}



function formatarData(texto) {
  return new Date(texto).toLocaleDateString("pt-BR");
}


function dataAgora() {
  const d = new Date();
  function doisDigitos(n) {
    return String(n).padStart(2, "0");
  }
  return d.getFullYear() + "-" + doisDigitos(d.getMonth() + 1) + "-" + doisDigitos(d.getDate()) +
    "T" + doisDigitos(d.getHours()) + ":" + doisDigitos(d.getMinutes()) + ":" + doisDigitos(d.getSeconds());
}


function buscarProduto(id) {
  return produtos.find(function (p) {
    return p.id === id;
  });
}


function tipoEscolhido() {
  const marcado = document.querySelector('input[name="tipo"]:checked');
  return marcado ? marcado.value : "";
}


function preencherProdutos() {
  let opcoes = `<option value="">Selecione um produto</option>`;
  produtos.forEach(function (p) {
    opcoes += `<option value="${p.id}">${escapar(p.nome)}</option>`;
  });
  campoProduto.innerHTML = opcoes;
}


function mostrarDica() {
  const produto = buscarProduto(Number(campoProduto.value));
  if (produto) {
    dicaEstoque.textContent = "Estoque atual: " + produto.atual + " (" + produto.unidade + ")";
  } else {
    dicaEstoque.textContent = "";
  }
}


function mostrarTabela() {
  if (movimentacoes.length === 0) {
    elTabela.innerHTML = `<tr><td colspan="5" class="mensagem-vazia">Nenhuma movimentação registrada.</td></tr>`;
    return;
  }


  const ultimas = movimentacoes
    .slice()
    .sort(function (a, b) {
      return new Date(b.data) - new Date(a.data) || b.id - a.id;
    })
    .slice(0, 10);

  let linhas = "";
  ultimas.forEach(function (mov) {
    const produto = buscarProduto(mov.produtoId);
    const nome = produto ? escapar(produto.nome) : "Produto excluído";
    const tipo = mov.tipo === "entrada" ? "Entrada" : "Saída";

    const observacao = mov.observacao ? escapar(mov.observacao) : "—";

    linhas += `
      <tr>
        <td>${formatarData(mov.data)}</td>
        <td>${nome}</td>
        <td>${tipo}</td>
        <td>${mov.quantidade}</td>
        <td>${observacao}</td>
      </tr>`;
  });

  elTabela.innerHTML = linhas;
}


function limparFormulario() {
  formMov.reset(); 
  erroForm.textContent = "";
  sucessoForm.textContent = "";
  dicaEstoque.textContent = "";
}


formMov.addEventListener("submit", function (evento) {
  evento.preventDefault(); 

  const produto = buscarProduto(Number(campoProduto.value));
  const tipo = tipoEscolhido();
  const quantidade = Number(campoQuantidade.value);
  const observacao = campoObservacao.value.trim();

  erroForm.textContent = "";
  sucessoForm.textContent = "";


  if (!produto) {
    erroForm.textContent = "Selecione um produto.";
    return;
  }
  if (tipo === "") {
    erroForm.textContent = "Escolha o tipo: Entrada ou Saída.";
    return;
  }
  if (campoQuantidade.value === "" || isNaN(quantidade) || quantidade <= 0) {
    erroForm.textContent = "Digite uma quantidade maior que zero.";
    return;
  }
  if (tipo === "saida" && quantidade > produto.atual) {
    erroForm.textContent = "A saída é maior que o estoque atual (" + produto.atual + ").";
    return;
  }


  if (tipo === "entrada") {
    produto.atual = Math.round((produto.atual + quantidade) * 1000) / 1000;
  } else {
    produto.atual = Math.round((produto.atual - quantidade) * 1000) / 1000;
  }


  let maiorId = 0;
  movimentacoes.forEach(function (m) {
    if (m.id > maiorId) {
      maiorId = m.id;
    }
  });

  movimentacoes.push({
    id: maiorId + 1,
    produtoId: produto.id,
    tipo: tipo,
    quantidade: quantidade,
    data: dataAgora(),
    observacao: observacao
  });

  salvar();        
  mostrarTabela(); 
  limparFormulario();
  sucessoForm.textContent = "Movimentação registrada com sucesso!";
});


campoProduto.addEventListener("change", mostrarDica);
botaoCancelar.addEventListener("click", limparFormulario);


formMov.addEventListener("input", function () {
  sucessoForm.textContent = "";
});


preencherProdutos();
mostrarTabela();

if (produtos.length === 0) {
  erroForm.textContent = "Cadastre um produto na tela Produtos antes de registrar movimentações.";
}