const btnDisciplina = document.getElementById("btnDisciplina");
const txtNomeDisciplina = document.getElementById("txtNomeDisciplina");
const txtSerieDisciplina = document.getElementById("inputGroupSelect01");
const txtLinguagemDisciplina = document.getElementById("inputGroupSelect02");

btnDisciplina.onclick = onclick_btnDisciplina;

function onclick_btnDisciplina() {
    const v_nome = txtNomeDisciplina.value;
    const v_serie = txtSerieDisciplina.value;
    const v_linguagem = txtLinguagemDisciplina.value;

    const jsonProfessorString = localStorage.getItem("jsonProfessor");
    let jsonProfessor = null;
    if (jsonProfessorString !== null) {
        jsonProfessor = JSON.parse(jsonProfessorString);
        if (jsonProfessor !== null) {
            const v_professor_registro = jsonProfessor.registro;
        
            const objJson = {
                nome: v_nome,
                serie: v_serie,
                duplicado: 0,
                linguagem: v_linguagem,
                professor_registro: v_professor_registro
            };

            fetch_post_createDisciplina(objJson);
        }
    }
}

//função assincrona para validar login
function fetch_post_createDisciplina(objJson) {
    //converte o objeto recebido em um texto json
    const stringJson = JSON.stringify(objJson);
  
    //determina a uri do serviço na api
    const uri = "/disciplina";
    
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
  