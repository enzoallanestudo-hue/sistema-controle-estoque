
const VERSAO_DADOS = 3;

const produtosIniciais = [
  { id: 1, nome: "Frango",             unidade: "Quilo",   atual: 30, minimo: 10, imagem: "imagens/produtos/frango.jpg" },
  { id: 2, nome: "Anel de Cebola",         unidade: "Pacote", atual: 50, minimo: 10, imagem: "imagens/produtos/aneldecebola.jpg" },
  { id: 3, nome: "Batata Frita",       unidade: "Pacote",   atual: 15, minimo: 5,  imagem: "imagens/produtos/batatafrita.jpg" },
  { id: 4, nome: "Refrigerante 1,5 L", unidade: "Fardo", atual: 10, minimo: 5,  imagem: "imagens/produtos/refrigerante1.jpg" },
  { id: 5, nome: "Mandioca",           unidade: "Quilo",   atual: 12, minimo: 5,  imagem: "imagens/produtos/mandioca.jpg" },
  { id: 6, nome: "Polenta",           unidade: "Quilo",   atual: 12, minimo: 5,  imagem: "imagens/produtos/polenta.jpg" },
  { id: 7, nome: "Banana da terra",           unidade: "Quilo",   atual: 12, minimo: 5,  imagem: "imagens/produtos/bananadaterra.jpg" },
  { id: 8, nome: "limão",           unidade: "Quilo",   atual: 12, minimo: 5,  imagem: "imagens/produtos/limao.jpg" },
  { id: 9, nome: "Gelo",           unidade: "Pacote",   atual: 3, minimo: 1,  imagem: "imagens/produtos/gelo.jpg" },
  { id: 10, nome: "Laranja",           unidade: "Quilo",   atual: 5, minimo: 2,  imagem: "imagens/produtos/laranja.jpg" },
  { id: 11, nome: "Refrigerante 600ml",           unidade: "Fardo",   atual: 5, minimo: 2,  imagem: "imagens/produtos/refrigerante600.jpg" },
  { id: 12, nome: "Água com gás",           unidade: "Fardo",   atual: 5, minimo: 2,  imagem: "imagens/produtos/aguacomgas.jpg" },
  { id: 13, nome: "Água sem gás",           unidade: "Fardo",   atual: 5, minimo: 2,  imagem: "imagens/produtos/aguasemgas.jpg" },
  { id: 14, nome: "Cerveja 600ml",           unidade: "Garrafa",   atual: 30, minimo: 10,  imagem: "imagens/produtos/cerveja600.jpg" },
  { id: 15, nome: "Cerveja latão ",           unidade: "Fardo",   atual: 5, minimo: 2,  imagem: "imagens/produtos/cervejalatao.jpg" },
];

const movimentacoesIniciais = [
  { id: 1, produtoId: 4, tipo: "entrada", quantidade: 12, data: "2026-10-21T16:20:00" },
  { id: 2, produtoId: 3, tipo: "saida",   quantidade: 3,  data: "2026-10-22T09:15:00" },
  { id: 3, produtoId: 1, tipo: "entrada", quantidade: 10, data: "2026-10-22T14:32:00" }
];

if (localStorage.getItem("gdf_versao") !== String(VERSAO_DADOS)) {
  localStorage.setItem("gdf_produtos", JSON.stringify(produtosIniciais));
  localStorage.setItem("gdf_movimentacoes", JSON.stringify(movimentacoesIniciais));
  localStorage.setItem("gdf_versao", String(VERSAO_DADOS));
}