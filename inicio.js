


const produtos = JSON.parse(localStorage.getItem("gdf_produtos"));
const movimentacoes = JSON.parse(localStorage.getItem("gdf_movimentacoes"));


const elTotalProdutos = document.getElementById("total-produtos");
const elEstoqueNormal = document.getElementById("estoque-normal");
const elEstoqueBaixo = document.getElementById("estoque-baixo");
const elMovimentacoesHoje = document.getElementById("movimentacoes-hoje");
const elTabelaEstoqueBaixo = document.getElementById("tabela-estoque-baixo");
const elListaMovimentacoes = document.getElementById("lista-movimentacoes");
const elNomeUsuario = document.getElementById("nome-usuario");


function criarFoto(produto) {
  if (produto.imagem !== "") {
    return `<img class="foto-produto" src="${produto.imagem}" alt="${produto.nome}">`;
  }
  return `<span class="foto-produto"></span>`;
}


function formatarData(texto) {
  const data = new Date(texto);
  const dia = data.toLocaleDateString("pt-BR");
  const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return dia + " " + hora;
}


function mostrarCartoes() {

  const produtosBaixos = produtos.filter(function (produto) {
    return produto.atual <= produto.minimo;
  });


  const hoje = new Date().toDateString();
  const movimentacoesDeHoje = movimentacoes.filter(function (mov) {
    return new Date(mov.data).toDateString() === hoje;
  });

  elTotalProdutos.textContent = produtos.length;
  elEstoqueBaixo.textContent = produtosBaixos.length;
  elEstoqueNormal.textContent = produtos.length - produtosBaixos.length;
  elMovimentacoesHoje.textContent = movimentacoesDeHoje.length;
}


function mostrarEstoqueBaixo() {
  const produtosBaixos = produtos.filter(function (produto) {
    return produto.atual <= produto.minimo;
  });


  if (produtosBaixos.length === 0) {
    elTabelaEstoqueBaixo.innerHTML =
      `<tr><td colspan="5" class="mensagem-vazia">Nenhum produto com estoque baixo.</td></tr>`;
    return;
  }

  let linhas = "";
  produtosBaixos.forEach(function (produto) {
    linhas += `
      <tr>
        <td><span class="produto-nome">${criarFoto(produto)}${produto.nome}</span></td>
        <td>${produto.unidade}</td>
        <td>${produto.atual}</td>
        <td>${produto.minimo}</td>
        <td><span class="etiqueta etiqueta-baixo">Estoque baixo</span></td>
      </tr>`;
  });


  elTabelaEstoqueBaixo.innerHTML = linhas;
}


function mostrarMovimentacoesRecentes() {
  if (movimentacoes.length === 0) {
    elListaMovimentacoes.innerHTML =
      `<li class="mensagem-vazia">Nenhuma movimentação registrada.</li>`;
    return;
  }


  const recentes = movimentacoes
    .slice()
    .sort(function (a, b) {
      return new Date(b.data) - new Date(a.data);
    })
    .slice(0, 5);

  let itens = "";
  recentes.forEach(function (mov) {
  
    const produto = produtos.find(function (p) {
      return p.id === mov.produtoId;
    });
    if (!produto) {
      return; 
    }

    const ehEntrada = mov.tipo === "entrada";
    const classe = ehEntrada ? "entrada" : "saida";
    const sinal = ehEntrada ? "+" : "-";
    const textoTipo = ehEntrada ? "Entrada" : "Saída";

    itens += `
      <li class="movimentacao">
        ${criarFoto(produto)}
        <div class="movimentacao-info">
          <p class="movimentacao-produto">${produto.nome}</p>
          <p class="movimentacao-tipo ${classe}">${textoTipo}</p>
        </div>
        <span class="movimentacao-qtd ${classe}">${sinal}${mov.quantidade}</span>
        <span class="movimentacao-data">${formatarData(mov.data)}</span>
      </li>`;
  });

  elListaMovimentacoes.innerHTML = itens;

}
  const nomeUsuario = localStorage.getItem("gdf_usuario");
  if (nomeUsuario) {
  elNomeUsuario.textContent = nomeUsuario;
}

mostrarCartoes();
mostrarEstoqueBaixo();
mostrarMovimentacoesRecentes();