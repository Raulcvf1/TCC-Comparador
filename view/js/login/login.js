// login.js

document.addEventListener("DOMContentLoaded", () => {
    // Função para mostrar o formulário de login
    function showLogin() {
        document.getElementById("login-card").style.display = "block";
        document.getElementById("register-card").style.display = "none";
    }

    // Função para mostrar o formulário de cadastro
    function showRegister() {
        document.getElementById("login-card").style.display = "none";
        document.getElementById("register-card").style.display = "block";
    }

    // Tornar as funções globais
    window.showLogin = showLogin;
    window.showRegister = showRegister;
});

const btnLogin = document.getElementById("btnLogin");
const txtEmail = document.getElementById("txtEmailLogin");
const txtSenha = document.getElementById("txtSenhaLogin");

btnLogin.onclick = onclick_btnLogin;

//função que trata o evento de click do botão
function onclick_btnLogin() {
  //recupera os valores digitados no formulario
  const v_email = txtEmail.value;
  const v_senha = txtSenha.value;

  //constroi um objeto json que será enviado na requisição
  const objJson = {
    email: v_email,
    senha: v_senha,
  };
  //chama a função que enviara os dados para a api que
  //verificará o login
  fetch_post_verificarLogin(objJson);
}

//função assincrona para validar login
function fetch_post_verificarLogin(objJson) {
  //converte o objeto recebido em um texto json
  const stringJson = JSON.stringify(objJson);

  //determina a uri do serviço na api
  const uri = "/professor/login";

  const requisicao_assincrona = fetch(uri, {
    method: "post",
    body: stringJson,
    headers: {
      Accept: "application/json", //Aceita json como resposta da api
      "Content-Type": "application/json", //Informa que irá enviar para api conteúdo em json
      Authorization: "", //não envia token pq ainda não está logado
    },
  });

  //caso seja retornada uma resposta da api, ela será processada abaixo
  requisicao_assincrona
    .then((response) => {
      return response.text();
    })
    .then((jsonResposta) => {
      //é execudado quando a api "js" responde.

      //mostra o contúdo recebido da api no console do navegador.
      console.log("RECEBIDO:", jsonResposta);

      //converte a resposta da api para um objeto json.
      const objetoJson = JSON.parse(jsonResposta);

      //caso o status da resposta seja true entra no if
      if (objetoJson.status == true) {
        let stringJsonProfessor = JSON.stringify(objetoJson.professor);

        //recupera o novo token e armanzena no localStorage
        localStorage.setItem("token", objetoJson.token);

        //recupera o json no formato: {"email":"","nome":"","idFuncionario":"","idCargo":"","nomeCargo":""}
        //esses dados são armazenado no localStorage e potem ser utilizados
        //para verificações adicionais dentro do front-end
        localStorage.setItem("jsonProfessor", stringJsonProfessor);

        //redireciona para a pagina Painel.html
        window.location = "index.html";
      } else {
        //caso o status da resposta não sseja true
        //escreve a mensagem que veio da api
        console.log(objetoJson.msg);
      }
    });

  //caso aconteça algum erro o catch é chamado e o erro é apresentado no console do navegador
  requisicao_assincrona.catch((error) => {
    console.error("Error:", error);
  });
}
