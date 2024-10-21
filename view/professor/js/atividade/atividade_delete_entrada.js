const btnEntradaDelete = document.getElementById("btnEntradaDelete");

btnEntradaDelete.onclick = onclick_btnEntradaDelete;

function onclick_btnEntradaDelete() {
    fetch_delete_deleteEntrada();
}

//função assincrona para validar login
function fetch_delete_deleteEntrada() {

    var entrada = JSON.parse(localStorage.getItem("jsonEntrada"));

    //determina a uri do serviço na api
    const uri = "/entrada/" + entrada.idEntrada;
    
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

            const path = entrada.path_entrada;

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
                localStorage.removeItem("jsonEntrada");
                location.reload();

            }).catch((error) => {
                console.error("Erro ao excluir o caminho:", error);

                // Mesmo em caso de erro na exclusão do caminho, remove jsonAtividade e redireciona
                localStorage.removeItem("jsonEntrada");
                window.location.href = "disciplina.html";

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
  