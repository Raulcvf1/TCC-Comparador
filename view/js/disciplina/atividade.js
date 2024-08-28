const btnAtividade = document.getElementById("btnAtividade");
const txtNomeAtividade = document.getElementById("txtNomeAtividade");

btnAtividade.onclick = onclick_btnAtividade;

function onclick_btnAtividade() {
  const v_nome = txtNomeAtividade.value;

  var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
      
  const objJson = {
      nome: v_nome,
      status: 0,
      Disciplina_idDisciplina: disciplina.idDisciplina
  };

  fetch_post_createAtividade(objJson);
}

//função assincrona para validar login
function fetch_post_createAtividade(objJson) {
  //converte o objeto recebido em um texto json
  const stringJson = JSON.stringify(objJson);

  //determina a uri do serviço na api
  const uri = "/atividade";
  
  const token = localStorage.getItem("token");
  console.log(token);

  const requisicao_assincrona = fetch(uri, {
    method: "post",
    body: stringJson,
    headers: {
      Accept: "application/json", //Aceita json como resposta da api
      "Content-Type": "application/json", //Informa que irá enviar para api conteúdo em json
      authorization: "bearer <" + token + ">", //não envia token pq ainda não está logado
    },
  });

  //caso seja retornada uma resposta da api, ela será processada abaixo
  requisicao_assincrona.then((response) => {
      return response.text();
  }).then((jsonResposta) => {
    //é execudado quando a api "js" responde.

    //mostra o contúdo recebido da api no console do navegador.
    console.log("RECEBIDO:", jsonResposta);

    //converte a resposta da api para um objeto json.
    const objetoJson = JSON.parse(jsonResposta);

    //caso o status da resposta seja true entra no if
    if (objetoJson.status == true) {
      location.reload();
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