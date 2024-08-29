const btnQuestaoDelete = document.getElementById("btnQuestaoDelete");

btnQuestaoDelete.onclick = onclick_btnQuestaoDelete;

function onclick_btnQuestaoDelete() {
    fetch_delete_deleteQuestao();
}

//função assincrona para validar login
function fetch_delete_deleteQuestao() {

    var questao = JSON.parse(localStorage.getItem("jsonQuestao"));

    //determina a uri do serviço na api
    const uri = "/questao/" + questao.idQuestao;
    
    const token = localStorage.getItem("token");
    console.log(token);

    const requisicao_assincrona = fetch(uri, {
        method: "DELETE",
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

            // Obter os dados do professor, disciplina e atividade do localStorage
            const professor = JSON.parse(localStorage.getItem("jsonProfessor"));
            const disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
            const atividade = JSON.parse(localStorage.getItem("jsonAtividade"));
            var questao = JSON.parse(localStorage.getItem("jsonQuestao"));

            const path = `C:\\workspace tcc\\corretorFinalizado\\professor\\${professor.registro}\\${disciplina.idDisciplina}\\${atividade.idAtividade}\\${questao.nome}`;

            // Configura os dados para a requisição de exclusão do caminho
            const deletePathRequest = {
                method: "POST",
                body: JSON.stringify({ path: path }),
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "bearer <" + token + ">",
                },
            };

            // Chama a rota de exclusão de caminho
            fetch("/deletePath", deletePathRequest).then((deleteResponse) => deleteResponse.text()).then((deleteResult) => {
                console.log("Resultado da exclusão do caminho:", deleteResult);

                // Independentemente do resultado da exclusão do caminho, remove jsonAtividade e redireciona
                localStorage.removeItem("jsonQuestao");
                window.location.href = "atividadeNew.html";

            }).catch((error) => {
                console.error("Erro ao excluir o caminho:", error);

                // Mesmo em caso de erro na exclusão do caminho, remove jsonAtividade e redireciona
                localStorage.removeItem("jsonAtividade");
                window.location.href = "disciplinaNew.html";

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
  