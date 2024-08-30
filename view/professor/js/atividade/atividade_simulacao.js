const btnSimlucao = document.getElementById("btnSimlucao");

btnSimlucao.onclick = onclick_btnSimlucao;

function onclick_btnSimlucao() {
    var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
    var questao = JSON.parse(localStorage.getItem("jsonQuestao"));
    var entrada = JSON.parse(localStorage.getItem("jsonEntrada"));
        
    const objJson = {
        language: disciplina.linguagem,
        path_questao: questao.path_questao,
        path_entrada: entrada.path_entrada
    };

    fetch_post_Simulacao(objJson);
}

//função assincrona para validar login
function fetch_post_Simulacao(objJson) {
    //converte o objeto recebido em um texto json
    const stringJson = JSON.stringify(objJson);

    //determina a uri do serviço na api
    const uri = "/simulacao";
    
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
        return response.json(); // Convertendo a resposta diretamente para JSON
    }).then((objetoJson) => {
        //é executado quando a api responde

        //mostra o contúdo recebido da api no console do navegador
        console.log("RECEBIDO:", objetoJson);

        //caso o status da resposta seja true
        if (objetoJson.success == true) {
            // Adiciona o conteúdo ao elemento com ID "txtSaida"
            document.getElementById("txtSaida").textContent = objetoJson.outputProfessor;
        } else {
            //caso o status da resposta não seja true
            //escreve a mensagem que veio da api
            console.log(objetoJson.msg);
        }
    }).catch((error) => {
        //caso aconteça algum erro o catch é chamado e o erro é apresentado no console do navegador
        console.error("Error:", error);
    });
}
