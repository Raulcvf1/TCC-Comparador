window.onload = function() {
    // Recupera o objeto do localStorage
    var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
    var professor = JSON.parse(localStorage.getItem("jsonProfessor"));

    if (disciplina.ano != new Date().getFullYear()){
        document.getElementById('btnCreateAtividade').disabled = true;
    }

    // Verifica se o objeto foi encontrado e se possui o atributo nome
    if (disciplina && disciplina.nome) {
        // Atribui o nome do professor ao elemento <p> com id txtNome_onload
        document.getElementById("lblAlunoDisciplina").textContent = "Alunos na Disciplina " + disciplina.nome ;
        document.getElementById("lblNomeDisciplina").textContent = disciplina.nome;
        document.getElementById("lblCodeDisciplina").textContent = "Código: " + disciplina.codigoUnico;
        document.getElementById("lblCodeExpand").textContent = disciplina.codigoUnico;

        document.getElementById("txtNome_onload").textContent = professor.nome;
        document.getElementById("txtEmail_onload").textContent = professor.email;

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
                    populateComboBoxAtividade(jsonResposta.dados)
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

    // Função para popular a comboBoxAluno com os valores retornados
    function populateComboBoxAluno(alunos) {
        const comboBoxAluno = document.getElementById("comboBoxAluno");
        comboBoxAluno.innerHTML = '<option selected>Selecione o nome do Aluno</option>'; // Limpa e define a opção padrão

        alunos.forEach(aluno => {
            const option = document.createElement("option");
            option.value = aluno.matricula; // O value será a matrícula do aluno
            option.textContent = aluno.nome; // O texto será o nome do aluno
            comboBoxAluno.appendChild(option);
        });
    }

    // Função para popular a comboBoxAtividade com os valores retornados
    function populateComboBoxAtividade(atividades) {
        const comboBoxAtividade = document.getElementById("comboBoxAtividade");
        comboBoxAtividade.innerHTML = '<option selected value="false">Selecione a Atividade</option>'; // Limpa e define a opção padrão

        atividades.forEach(atividade => {
            const option = document.createElement("option");
            option.value = atividade.idAtividade; // O value será o id da atividade
            option.textContent = atividade.nome; // O texto será o nome da atividade
            comboBoxAtividade.appendChild(option);
        });

        const comboBoxAtividade_grafico = document.getElementById("comboBoxAtividade_grafico");
        comboBoxAtividade_grafico.innerHTML = '<option selected value="false">Selecione a Atividade</option>'; // Limpa e define a opção padrão

        atividades.forEach(atividade => {
            const option = document.createElement("option");
            option.value = atividade.idAtividade; // O value será o id da atividade
            option.textContent = atividade.nome; // O texto será o nome da atividade
            comboBoxAtividade_grafico.appendChild(option);
        });

        const checkBoxArea = document.getElementById("checkBoxArea");

        atividades.forEach(atividade => {
            checkBoxArea.innerHTML += `
                <div class="col">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${atividade.idAtividade}" >
                        <label class="form-check-label" for="flexCheckDefault">
                            ${atividade.nome}
                        </label>
                    </div>
                </div>
            `;
        });        

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

            const row1 = document.createElement('div');
            row1.className = "row";

            const col1 = document.createElement('div');
            col1.className = "col";

            const title = document.createElement('h3');
            title.textContent = atividade.nome;

            const col2 = document.createElement('div');
            col2.className = "col justify-content-end d-flex ";

            const btnPut = document.createElement('button');

            if(atividade.status == 0){
                btnPut.value = 1;
                btnPut.className = "btn btn-danger";
                btnPut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="32" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/></svg>`; 
            }
            else{
                btnPut.value = 0;
                btnPut.className = "btn btn-success";
                btnPut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="32" fill="currentColor" class="bi bi-unlock" viewBox="0 0 16 16"><path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2M3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg>`;
            }

            btnPut.onclick = () => {
                statusAtividade_put(atividade.idAtividade, btnPut.value);
            };

            const description4 = document.createElement('p');
            description4.textContent = "Acesse a " + atividade.nome + " clicando no botão abaixo";

            const button = document.createElement('button');
            button.className = "btn btn-primary";
            button.textContent = "Acessar";
            button.onclick = () => {
                handleDisciplinaClick(atividade.idAtividade, atividade.nome, atividade.status);
            };

            col1.appendChild(title);
            col2.appendChild(btnPut)
            row1.appendChild(col1);
            row1.appendChild(col2);
            jumbotron.appendChild(row1);
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

    
    function statusAtividade_put(idAtividade, status){
        const objJson ={
            status: status
        }

        //converte o objeto recebido em um texto json
        const stringJson = JSON.stringify(objJson);

        //determina a uri do serviço na api
        const uri = `/atividade/status/${idAtividade}`;
        
        const token = localStorage.getItem("token");
        console.log(token);

        const requisicao_assincrona = fetch(uri, {
            method: "PUT",
            body: stringJson,
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

    // Função para lidar com o clique na atividade
    function handleDisciplinaClick(id, nome, status) {
        // Cria o dicionário com as informações
        const atividadeInfo = {
            idAtividade: id,
            nome: nome,
            status: status,
        };
    
        // Armazena no localStorage
        localStorage.setItem("jsonAtividade", JSON.stringify(atividadeInfo));
    
        // Redireciona para a página "disciplina.html"
        window.location.href = "atividade.html";
    }

    function fetch_get_selectDisciplinaAluno(id) {
        // Converte o objeto recebido em um texto json
        // Determina a uri do serviço na API
        const uri = "/aluno/disciplina/" + id;

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
                populateComboBoxAluno(jsonResposta.dados);
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
            tr.appendChild(createCell(disciplina.nome));
            tr.appendChild(createCell(disciplina.email));
            tr.appendChild(createButtonCell(disciplina.matricula));

            tbody.appendChild(tr);
        });
    }

    function createCell(text) {
        const td = document.createElement("td");
        td.textContent = text;
        return td;
    }

    function createButtonCell(matricula) {
        const td = document.createElement("td");
        const button = document.createElement("button");
        button.textContent = "Excluir";
        button.className = "btn btn-danger";
        button.onclick = () => handleClick(matricula);
        td.appendChild(button);
        return td;
    }

    function handleClick(matricula) {

        console.log("Excluir disciplina com id:", matricula);

        const disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));

        const objJson = {
            matricula: matricula,
            idDisciplina: disciplina.idDisciplina,
        };

        fetch_get_idAlunoDisciplina(objJson);
    }
};

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