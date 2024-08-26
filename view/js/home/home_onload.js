window.onload = function() {
    // Recupera o objeto do localStorage
    var professor = JSON.parse(localStorage.getItem("jsonProfessor"));

    // Verifica se o objeto foi encontrado e se possui o atributo nome
    if (professor && professor.nome && professor.registro) {
        // Atribui o nome do professor ao elemento <p> com id txtNome_onload
        document.getElementById("txtNome_onload").textContent = professor.nome;

        fetch_get_selectDisciplinaProfessor(professor.registro);
        fetch_get_selectDisciplinaProfessor_antiga(professor.registro);
    }

    //função assincrona para validar login
    function fetch_get_selectDisciplinaProfessor(id) {
        //converte o objeto recebido em um texto json

        const ano = new Date().getFullYear();

        //determina a uri do serviço na api
        const uri = "/disciplina/professor/atual/" + id + "/" + ano;
       
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
                createDisciplinasJumbotrons(jsonResposta.dados, "disciplinaAtual");
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

    //função assincrona para validar login
    function fetch_get_selectDisciplinaProfessor_antiga(id) {
        //converte o objeto recebido em um texto json

        const ano = new Date().getFullYear();

        //determina a uri do serviço na api
        const uri = "/disciplina/professor/antigo/" + id + "/" + ano;
       
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
                createDisciplinasJumbotrons(jsonResposta.dados, "disciplinaAntiga");
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

}

function createDisciplinasJumbotrons(disciplinas, idDiv) {
    const container = document.createElement('div');
    container.className = "row";

    disciplinas.forEach((disciplina) => {
        const col = document.createElement('div');
        col.className = "col-4";

        const jumbotron = document.createElement('div');
        jumbotron.className = "mt-4 p-5 text-white rounded";

        jumbotron.style = "background: #333;"

        const title = document.createElement('h3');
        title.textContent = disciplina.serie + "° ano " + disciplina.nome + " - " + disciplina.ano; 

        const description1 = document.createElement('p');
        description1.textContent = "Code: " + disciplina.codigo_unico;

        const description2 = document.createElement('p');
        description2.textContent = "Acesse a disciplina de " + disciplina.nome + " clicando no botão abaixo";

        const button = document.createElement('button');
        button.className = "btn btn-primary";
        button.textContent = "Acessar";
        button.onclick = () => {
            handleDisciplinaClick(disciplina.codigo_unico, disciplina.nome, disciplina.serie, disciplina.ano, disciplina.duplicado, disciplina.linguagem);
        };

        jumbotron.appendChild(title);
        jumbotron.appendChild(description1);
        jumbotron.appendChild(description2);
        jumbotron.appendChild(button);

        col.appendChild(jumbotron);
        container.appendChild(col);
    });

    // Adiciona o container criado na posição desejada no documento
    const targetElement = document.getElementById(idDiv); // Local onde deseja inserir
    targetElement.appendChild(container);
}

function handleDisciplinaClick(codigoUnico, nome, serie, ano, duplicado, linguagem) {

    //determina a uri do serviço na api
    const uri = "/disciplina/code/" + codigoUnico;
        
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
        if (jsonResposta.status == true) {
            const idDisciplina = jsonResposta.dados[0].idDisciplina;

            // Cria o dicionário com as informações
            const disciplinaInfo = {
                idDisciplina: idDisciplina,
                nome: nome,
                serie: serie,
                ano: ano,
                duplicado: duplicado,
                linguagem: linguagem,
                codigoUnico: codigoUnico
            };

            // Armazena no localStorage
            localStorage.setItem("jsonDisciplina", JSON.stringify(disciplinaInfo));

            // Redireciona para a página "disciplina.html"
            window.location.href = "disciplinaNew.html";
        } else {
            console.log(jsonResposta.msg);
        }
    });

    //caso aconteça algum erro o catch é chamado e o erro é apresentado no console do navegador
    requisicao_assincrona.catch((error) => {
        console.error("Error:", error);
    });
}
