window.onload = function() { // Torne a função assíncrona
    // Recupera o objeto do localStorage
    var atividade = JSON.parse(localStorage.getItem("jsonAtividade"));

    // Verifica se o objeto foi encontrado e se possui o atributo nome
    if (atividade && atividade.nome) {
        // Atribui o nome da atividade ao elemento <p> com id lblNomeAtividade
        document.getElementById("lblNomeAtividade").textContent = atividade.nome;

        fetch_get_selectQuestaoAtividade();
    }

    //função assincrona para validar login
    function fetch_get_selectQuestaoAtividade() {
        //converte o objeto recebido em um texto json

        var atividade = JSON.parse(localStorage.getItem("jsonAtividade"));

        //determina a uri do serviço na api
        const uri = "/questao/atividade/" + atividade.idAtividade;
        
        const token = localStorage.getItem("token");

        const requisicao_assincrona = fetch(uri, {
            method: "get",
            headers: {
                Accept: "application/json", //Aceita json como resposta da api
                "Content-Type": "application/json", //Informa que irá enviar para api conteúdo em json
                authorization: "bearer <" + token + ">", //não envia token pq ainda não está logado
            },
        });
    
        //caso seja retornada uma resposta da api, ela será processada abaixo
        requisicao_assincrona
        .then((response) => {
            return response.json();
        })
        .then((jsonResposta) => {
            //é execudado quando a api "js" responde.
    
            //mostra o contúdo recebido da api no console do navegador.
            console.log("RECEBIDO:", jsonResposta);
    
            //caso o status da resposta seja true entra no if
            if (jsonResposta.status == true) {
                createQuestaoListGroup(jsonResposta.dados, "listGroup");
            } else {
                //caso o status da resposta não seja true
                //escreve a mensagem que veio da api
                console.log(jsonResposta.msg);
            }
        });
    
        //caso aconteça algum erro o catch é chamado e o erro é apresentado no console do navegador
        requisicao_assincrona.catch((error) => {
            console.error("Error:", error);
        });
    }
};

function createQuestaoListGroup(questao, idDiv) {
    const listGroup = document.getElementById(idDiv);
    listGroup.innerHTML = ''; 
    
    questao.forEach(elemento => {
        const item = document.createElement('a');
        item.className = "list-group-item list-group-item-action";
        item.textContent = elemento.nome;
    
        // Adiciona o evento de clique
        item.onclick = () => {
            // Remove a classe active de todos os itens
            const items = listGroup.querySelectorAll('.list-group-item');
            items.forEach(i => i.classList.remove('active'));
    
            // Adiciona a classe active ao item clicado
            item.classList.add('active');
    
            // Executa a função ao clicar na questão
            handleQuestaoClick(elemento.idQuestao, elemento.nome, elemento.path_questao);
        };
    
        // Adiciona o item à lista
        listGroup.appendChild(item);
    });
    
    // Dispara o clique no primeiro item da lista após carregá-la
    const firstItem = listGroup.querySelector('.list-group-item');
    if (firstItem) {
        firstItem.click();
    }     
}

function handleQuestaoClick(idQuestao, nome, path_questao) {

    const questaoInfo = {
        idQuestao: idQuestao,
        nome: nome,
        path_questao: path_questao
    };

    localStorage.setItem("jsonQuestao", JSON.stringify(questaoInfo));

    const path = path_questao;

    const token = localStorage.getItem("token");

    const conteudoPathRequest = {
        method: "POST",
        body: JSON.stringify({ path: path }),
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "bearer <" + token + ">",
        },
    };

    fetch("/conteudo", conteudoPathRequest).then((conteudoResponse) => conteudoResponse.text()).then((conteudoResult) => {
        console.log("conteudo do arquivo:", conteudoResult);

        const lblQuestao = document.getElementById('lblQuestao');
        lblQuestao.innerHTML = "";
        lblQuestao.innerHTML = `<pre><code>${conteudoResult}</code></pre>`;

        const txtEntrada = document.getElementById("txtEntrada");
        txtEntrada.innerHTML = "";

        //determina a uri do serviço na api
        const uri = "/entrada/questao/" + idQuestao;

        const token = localStorage.getItem("token");

        const requisicao_assincrona = fetch(uri, {
            method: "get",
            headers: {
                Accept: "application/json", //Aceita json como resposta da api
                "Content-Type": "application/json", //Informa que irá enviar para api conteúdo em json
                authorization: "bearer <" + token + ">", //não envia token pq ainda não está logado
            },
        });
    
        //caso seja retornada uma resposta da api, ela será processada abaixo
        requisicao_assincrona
        .then((response) => {
            return response.json();
        })
        .then((jsonResposta) => {
            //é execudado quando a api "js" responde.
    
            //mostra o contúdo recebido da api no console do navegador.
            console.log("RECEBIDO:", jsonResposta);
    
            //caso o status da resposta seja true entra no if
            if (jsonResposta.status == true) {
                createEntradaListGroup(jsonResposta.dados, "listGroupEntrada");
            } else {
                //caso o status da resposta não seja true
                //escreve a mensagem que veio da api
                console.log(jsonResposta.msg);
            }
        });
    
        //caso aconteça algum erro o catch é chamado e o erro é apresentado no console do navegador
        requisicao_assincrona.catch((error) => {
            console.error("Error:", error);
        });


    }).catch((error) => {
        console.error("Erro ao carregar conteudo:", error);
    });
}

function createEntradaListGroup(entrada, idDiv) {
    const listGroup = document.getElementById(idDiv);
    listGroup.innerHTML = ''; 
    
    let i = 1;

    entrada.forEach(elemento => {
        const item = document.createElement('a');
        item.className = "list-group-item list-group-item-action";
        item.textContent = "Input " + i;
        
        i++;

        // Adiciona o evento de clique
        item.onclick = () => {
            // Remove a classe active de todos os itens
            const items = listGroup.querySelectorAll('.list-group-item');
            items.forEach(i => i.classList.remove('active'));
    
            // Adiciona a classe active ao item clicado
            item.classList.add('active');
    
            // Executa a função ao clicar na questão
            handleEntradaClick(elemento.idEntrada, elemento.path_entrada);
        };
    
        // Adiciona o item à lista
        listGroup.appendChild(item);
    });
    
    // Dispara o clique no primeiro item da lista após carregá-la
    const firstItem = listGroup.querySelector('.list-group-item');
    if (firstItem) {
        firstItem.click();
    }     
}

function handleEntradaClick(idEntrada, path_entrada) {

    const entradaInfo = {
        idEntrada: idEntrada,
        path_entrada: path_entrada
    };

    localStorage.setItem("jsonEntrada", JSON.stringify(entradaInfo));

    const path = path_entrada;

    const token = localStorage.getItem("token");

    const conteudoPathRequest = {
        method: "POST",
        body: JSON.stringify({ path: path }),
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "bearer <" + token + ">",
        },
    };

    fetch("/conteudo", conteudoPathRequest).then((conteudoResponse) => conteudoResponse.text()).then((conteudoResult) => {
        console.log("conteudo do arquivo:", conteudoResult);

        const txtEntrada = document.getElementById('txtEntrada');
        txtEntrada.innerHTML = "";
        txtEntrada.innerHTML = `${conteudoResult}`;

    }).catch((error) => {
        console.error("Erro ao carregar conteudo:", error);
    });
}