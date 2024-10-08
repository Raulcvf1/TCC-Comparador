window.onload = function() {
    // Recupera o objeto do localStorage
    var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));

    // Verifica se o objeto foi encontrado e se possui o atributo nome
    if (disciplina && disciplina.nome) {
        // Atribui o nome do professor ao elemento <p> com id txtNome_onload
        document.getElementById("lblAlunoDisciplina").textContent = "Alunos na Disciplina " + disciplina.nome ;
        document.getElementById("lblNomeDisciplina").textContent = disciplina.nome;
        document.getElementById("lblCodeDisciplina").textContent = "Código: " + disciplina.codigoUnico;
        document.getElementById("lblCodeExpand").textContent = disciplina.codigoUnico;

        fetch_get_selectDisciplinaAluno(disciplina.idDisciplina);
        fetch_get_selectDisciplinaAtividade(disciplina.idDisciplina);
    }


    function fetch_get_selectDisciplinaAtividade(id) {
        // Converte o objeto recebido em um texto json
        // Determina a uri do serviço na API
        const uri = "/atividade/disciplina/" + id;
    
        const token = localStorage.getItem("token");
    
        const requisicao_assincrona = fetch(uri, {
            method: "get",
            headers: {
                Accept: "application/json", // Aceita json como resposta da API
                "Content-Type": "application/json", // Informa que irá enviar para API conteúdo em json
                authorization: "bearer <" + token + ">", // Envia token para autenticação
            },
        });
    
        // Caso seja retornada uma resposta da API, ela será processada abaixo
        requisicao_assincrona
            .then((response) => {
                return response.json();
            })
            .then((jsonResposta) => {
                // É executado quando a API responde
                console.log("RECEBIDO:", jsonResposta);
                // Caso o status da resposta seja true, entra no if
                if (jsonResposta.status == true) {
                    createAtividadeJumbotrons(jsonResposta.dados);
                } else {
                    // Caso o status da resposta não seja true
                    // Escreve a mensagem que veio da API
                    console.log(jsonResposta.msg);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
    
    // Função para formatar a data e hora
    function formatDateTime(dateTimeStr) {
        const date = new Date(dateTimeStr);
        const options = {
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit'
        };
        return date.toLocaleString('pt-BR', options);
    }

    // Função para criar os jumbotrons das atividades
    function createAtividadeJumbotrons(atividades) {
        const container = document.createElement('div');
        container.className = "row";

        atividades.forEach((atividade) => {
            const col = document.createElement('div');
            col.className = "col-4";

            const jumbotron = document.createElement('div');
            jumbotron.className = "mt-4 p-5 text-white rounded";

            jumbotron.style = "background: #333;"

            const title = document.createElement('h3');
            title.textContent = atividade.nome;

            const description4 = document.createElement('p');
            description4.textContent = "Acesse a " + atividade.nome + " clicando no botão abaixo";

            const button = document.createElement('button');
            button.className = "btn btn-primary";
            button.textContent = "Acessar";
            button.onclick = () => {
                handleDisciplinaClick(atividade.idAtividade, atividade.nome, atividade.status, atividade.quantidade_exercicios);
            };

            jumbotron.appendChild(title);
            jumbotron.appendChild(description4);
            jumbotron.appendChild(button);

            col.appendChild(jumbotron);
            container.appendChild(col);
        });

        // Adiciona o container criado na posição desejada no documento
        const targetElement = document.getElementById('jumbotrons-container'); // Local onde deseja inserir
        targetElement.innerHTML = ''; // Limpa o conteúdo existente antes de adicionar novos
        targetElement.appendChild(container);
    }

    
    // Função para lidar com o clique na atividade
    function handleDisciplinaClick(id, nome, status, quantidade) {
        // Cria o dicionário com as informações
        const atividadeInfo = {
            idAtividade: id,
            nome: nome,
            status: status,
            quantidade_exercicios: quantidade,
        };
    
        // Armazena no localStorage
        localStorage.setItem("jsonAtividade", JSON.stringify(atividadeInfo));
    
        // Redireciona para a página "disciplina.html"
        window.location.href = "atividade.html";
    }



    function fetch_get_selectDisciplinaAluno(id) {
        // Converte o objeto recebido em um texto json
        // Determina a uri do serviço na API
        const uri = "/disciplina/aluno/" + id;

        const token = localStorage.getItem("token");

        const requisicao_assincrona = fetch(uri, {
            method: "get",
            headers: {
                Accept: "application/json", // Aceita json como resposta da API
                "Content-Type": "application/json", // Informa que irá enviar para API conteúdo em json
                authorization: "bearer <" + token + ">", // Envia token para autenticação
            },
        });

        // Caso seja retornada uma resposta da API, ela será processada abaixo
        requisicao_assincrona
        .then((response) => {
            return response.json();
        })
        .then((jsonResposta) => {
            // É executado quando a API responde
            console.log("RECEBIDO:", jsonResposta);
            // Caso o status da resposta seja true, entra no if
            if (jsonResposta.status == true) {
                populateTable(jsonResposta.dados);
            } else {
                // Caso o status da resposta não seja true
                // Escreve a mensagem que veio da API
                console.log(jsonResposta.msg);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    function populateTable(disciplinas) {
        const tbody = document.getElementById("disciplina-aluno-tbody");
        tbody.innerHTML = ""; // Limpa o conteúdo existente

        disciplinas.forEach((disciplina) => {
            const tr = document.createElement("tr");

            // Cria e popula as células da linha da tabela
            tr.appendChild(createCell(disciplina.matricula));
            tr.appendChild(createCell(disciplina.rg));
            tr.appendChild(createCell(disciplina.nome));
            tr.appendChild(createCell(disciplina.email));
            tr.appendChild(createButtonCell(disciplina.idDisciplina));

            tbody.appendChild(tr);
        });
    }

    function createCell(text) {
        const td = document.createElement("td");
        td.textContent = text;
        return td;
    }

    function createButtonCell(id) {
        const td = document.createElement("td");
        const button = document.createElement("button");
        button.textContent = "Excluir";
        button.className = "btn btn-danger";
        button.onclick = () => handleClick(id);
        td.appendChild(button);
        return td;
    }

    function handleClick(id) {
        // Lógica para lidar com a exclusão da disciplina
        console.log("Excluir disciplina com id:", id);
        // Aqui você pode adicionar a lógica para excluir a disciplina usando a API
    }
};
