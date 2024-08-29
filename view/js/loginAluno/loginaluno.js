// loginaluno.js

const btnLogin = document.getElementById("btnLoginAluno");
const txtEmail = document.getElementById("txtEmailLoginAluno");
const txtSenha = document.getElementById("txtSenhaLoginAluno");

btnLogin.onclick = onclick_btnLogin;

// Função que trata o evento de click do botão
function onclick_btnLogin(event) {
  event.preventDefault(); // Previne o envio padrão do formulário

  // Recupera os valores digitados no formulário
  const v_email = txtEmail.value;
  const v_senha = txtSenha.value;

  // Constrói um objeto JSON que será enviado na requisição
  const objJson = {
    email: v_email,
    senha: v_senha,
  };

  // Chama a função que enviará os dados para a API que verificará o login
  fetch_post_verificarLogin(objJson);
}

// Função assíncrona para validar login
function fetch_post_verificarLogin(objJson) {
  // Converte o objeto recebido em um texto JSON
  const stringJson = JSON.stringify(objJson);

  // Determina a URI do serviço na API
  const uri = "/aluno/login";

  const requisicao_assincrona = fetch(uri, {
    method: "post",
    body: stringJson,
    headers: {
      Accept: "application/json", // Aceita JSON como resposta da API
      "Content-Type": "application/json", // Informa que irá enviar para a API conteúdo em JSON
      Authorization: "", // Não envia token porque ainda não está logado
    },
  });

  // Caso seja retornada uma resposta da API, ela será processada abaixo
  requisicao_assincrona
    .then((response) => response.text())
    .then((jsonResposta) => {
      // É executado quando a API "JS" responde.
      console.log("RECEBIDO:", jsonResposta);

      // Converte a resposta da API para um objeto JSON.
      const objetoJson = JSON.parse(jsonResposta);

      // Caso o status da resposta seja true entra no if
      if (objetoJson.status == true) {
        let stringJsonProfessor = JSON.stringify(objetoJson.professor);

        // Recupera o novo token e armazena no localStorage
        localStorage.setItem("token", objetoJson.token);

        // Recupera o JSON no formato: {"email":"","nome":"","idFuncionario":"","idCargo":"","nomeCargo":""}
        localStorage.setItem("jsonProfessor", stringJsonProfessor);

        // Redireciona para a página index.html
        window.location = "index.html";
      } else {
        // Caso o status da resposta não seja true
        // Escreve a mensagem que veio da API
        console.log(objetoJson.msg);
      }
    })
    .catch((error) => {
      // Caso aconteça algum erro, o catch é chamado e o erro é apresentado no console do navegador
      console.error("Error:", error);
    });
}
