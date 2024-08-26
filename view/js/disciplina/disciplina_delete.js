const btnDisciplinaDelete = document.getElementById("btnDisciplinaDelete");

btnDisciplinaDelete.onclick = onclick_btnDisciplina;

function onclick_btnDisciplinaDelete() {
    fetch_delete_deleteDisciplina();
}

//função assincrona para validar login
function fetch_delete_deleteDisciplina() {

    var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
  
    //determina a uri do serviço na api
    const uri = "/disciplina/" + disciplina.idDisciplina;
    
    const token = localStorage.getItem("token");
    console.log(token);

    const requisicao_assincrona = fetch(uri, {
      method: "delete",
      body: stringJson,
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
            window.location.href = "index.html";
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
  