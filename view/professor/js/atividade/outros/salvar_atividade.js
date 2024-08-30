// register.js

const btnSalvar = document.getElementById("btnSalvar");

//vincula a função  onclick_btnLogin() ao click do botao de login
btnSalvar.onclick = onclick_btnSalvar;

//função que trata o evento de click do botão
function onclick_btnSalvar() {
  //recupera os valores digitados no formulario
  const atividade = JSON.parse(localStorage.getItem("jsonAtividade"));

  const v_idAtividade = atividade.idAtividade;
  
  //constroi um objeto json que será enviado na requisição
  const objJson = {
    id: v_idAtividade,
  };
  //chama a função que enviara os dados para a api que
  //verificará o login
  fetch_get_selectAtividade(objJson);
  
}

//função assincrona para validar login
function fetch_get_selectAtividade(objJson) {
  //converte o objeto recebido em um texto json
  const stringJson = JSON.stringify(objJson);

  //determina a uri do serviço na api
  const uri = "/atividade/" + stringJson.id;

  const requisicao_assincrona = fetch(uri, {
    method: "post",
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

        const atividade = JSON.parse(localStorage.getItem("jsonAtividade"));
        const disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"))

        let stringJsonAtividade = JSON.stringify(objetoJson.dados);

        const jsonAtividade = {
            nome: stringJsonAtividade.nome,
            status: stringJsonAtividade.status,
            quantidade_exercicios: quantidade_exercicios,
            Disciplina_idDisciplina: disciplina.idDisciplina,
        };

        //determina a uri do serviço na api
        const uri = "/atividade/" + atividade.idAtividade;

        const requisicao_assincrona = fetch(uri, {
            method: "post",
            body: jsonAtividade,
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
