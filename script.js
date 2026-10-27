
const formulario = document.getElementById("form-login");
const campoUsuario = document.getElementById("usuario");
const campoSenha = document.getElementById("senha");
const botaoSenha = document.getElementById("botao-senha");
const erroUsuario = document.getElementById("erro-usuario");
const erroSenha = document.getElementById("erro-senha");
const mensagemSucesso = document.getElementById("mensagem-sucesso");


function mostrarErro(campo, elementoErro, texto) {
  campo.parentElement.classList.add("com-erro");
  elementoErro.textContent = texto;
}

function limparErro(campo, elementoErro) {
  campo.parentElement.classList.remove("com-erro");
  elementoErro.textContent = "";
}


botaoSenha.addEventListener("click", function () {
  if (campoSenha.type === "password") {
    campoSenha.type = "text";
  } else {
    campoSenha.type = "password";
  }
});


campoUsuario.addEventListener("input", function () {
  limparErro(campoUsuario, erroUsuario);
});

campoSenha.addEventListener("input", function () {
  limparErro(campoSenha, erroSenha);
});


formulario.addEventListener("submit", function (evento) {

  evento.preventDefault();

  const usuario = campoUsuario.value.trim();
  const senha = campoSenha.value.trim();
  let tudoCerto = true;


  limparErro(campoUsuario, erroUsuario);
  limparErro(campoSenha, erroSenha);
  mensagemSucesso.textContent = "";

  if (usuario === "") {
    mostrarErro(campoUsuario, erroUsuario, "Digite o usuário.");
    tudoCerto = false;
  }

  if (senha === "") {
    mostrarErro(campoSenha, erroSenha, "Digite a senha.");
    tudoCerto = false;
  }

    if (tudoCerto) {
    mensagemSucesso.textContent = "Login realizado com sucesso! Redirecionando...";

    
    localStorage.setItem("gdf_usuario", usuario);

    
    setTimeout(function () {
      window.location.href = "inicio.html";
    }, 1000);
  }
});