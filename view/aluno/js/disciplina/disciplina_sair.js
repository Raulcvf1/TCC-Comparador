const btnDiciplinaSair = document.getElementById('btnDisciplinaSair');

btnDiciplinaSair.onclick = onclick_btnDisciplinaSair;

function onclick_btnDisciplinaSair(){
    
    const aluno = JSON.parse(localStorage.getItem("jsonAluno"));
    const disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));

    const objJson = {
        matricula: aluno.matricula,
        idDisciplina: disciplina.idDisciplina,
    };

    fetch_get_idAlunoDisciplina(objJson);
}

// Função assíncrona para validar login
function fetch_get_idAlunoDisciplina (objJson) {
  // Determina a URI do serviço na API

  console.log("MATRICULA = " + objJson.matricula);
  console.log("ID DISCIPLINA = " + objJson.idDisciplina);

  const uri = "/idAlunoDisciplina/" + objJson.matricula + "/" + objJson.idDisciplina;

  const token = localStorage.getItem("token");
  console.log(token);

  const requisicao_assincrona = fetch(uri, {
      method: "GET",
      headers: {
          Accept: "application/json", // Aceita json como resposta da API
          "Content-Type": "application/json", // Informa que irá enviar para API conteúdo em JSON
          Authorization: "Bearer " + token, // Envia o token de autorização
      },
  });

  // Caso seja retornada uma resposta da API, ela será processada abaixo
  requisicao_assincrona.then((response) => {
    return response.text();
  })
  .then((jsonResposta) => {
    // Mostra o conteúdo recebido da API no console do navegador
    console.log("RECEBIDO:", jsonResposta);

    // Converte a resposta da API para um objeto JSON
    const objetoJson = JSON.parse(jsonResposta);

    // Caso o status da resposta seja true entra no if
    if (objetoJson.status === true) {
      // Pegar o idDisciplina
      const idAlunoDisciplina = objetoJson.dados[0].id_Aluno_matricula;

      const objJson = {
          idAlunoDisciplina: idAlunoDisciplina
      };

      fetch_delete_AlunoDisciplina(objJson);

      // Aqui você pode usar o idDisciplina como precisar
    } else {
        // Caso o status da resposta não seja true, escreve a mensagem que veio da API
        console.log(objetoJson.msg);
    }
  })
  .catch((error) => {
      // Caso aconteça algum erro, o catch é chamado e o erro é apresentado no console do navegador
      console.error("Error:", error);
  });
}

//função assincrona para validar login
function fetch_delete_AlunoDisciplina(objJson) {
  //determina a uri do serviço na api
  const uri = "/alunoDisciplina/" + objJson.idAlunoDisciplina;
  
  const token = localStorage.getItem("token");
  console.log(token);

  const requisicao_assincrona = fetch(uri, {
    method: "delete",
    headers: {
      Accept: "application/json", //Aceita json como resposta da api
      "Content-Type": "application/json", //Informa que irá enviar para api conteúdo em json
      authorization: "bearer <" + token + ">", //não envia token pq ainda não está logado
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
          window.location = "home.html"
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
  