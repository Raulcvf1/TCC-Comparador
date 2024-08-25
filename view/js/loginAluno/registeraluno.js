// register.js

const btnRegister = document.getElementById("btnRegisterAluno");
const txtMatriculaRegister = document.getElementById("txtMatriculaRegisterAluno")
const txtRgRegister = document.getElementById("txtRgRegisterAluno")
const txtNomeRegister = document.getElementById("txtNomeRegisterAluno")
const txtEmailRegister = document.getElementById("txtEmailRegisterAluno");
const txtSenhaRegister = document.getElementById("txtSenhaRegisterAluno");

//vincula a função  onclick_btnLogin() ao click do botao de login
btnRegister.onclick = onclick_btnRegister;

//função que trata o evento de click do botão
function onclick_btnRegister() {
  //recupera os valores digitados no formulario
  const v_matricula = txtMatriculaRegister.value;
  const v_rg = txtRgRegister.value;
  const v_nome = txtNomeRegister.value;
  const v_email = txtEmailRegister.value;
  const v_senha = txtSenhaRegister.value;
  
  //constroi um objeto json que será enviado na requisição
  const objJson = {
    matricula: v_matricula,
    rg: v_rg,
    nome: v_nome,
    email: v_email,
    senha: v_senha,
  };
  //chama a função que enviara os dados para a api que
  //verificará o login
  fetch_post_createAluno(objJson);
  
}

//função assincrona para validar login
function fetch_post_createAluno(objJson) {
  //converte o objeto recebido em um texto json
  const stringJson = JSON.stringify(objJson);

  //determina a uri do serviço na api
  const uri = "/aluno";

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
        let stringJsonaluno = JSON.stringify(objetoJson.aluno);

        //recupera o novo token e armanzena no localStorage
        localStorage.setItem("token", objetoJson.token);

        //recupera o json no formato: {"email":"","nome":"","registro":""}
        //esses dados são armazenado no localStorage e potem ser utilizados
        //para verificações adicionais dentro do front-end
        localStorage.setItem("jsonAluno", stringJsonaluno);

        //redireciona para a pagina Painel.html
        window.location = "home.html";
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
