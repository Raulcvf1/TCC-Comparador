window.onload = function() { 
    // Recupera o objeto do localStorage
    var aluno = JSON.parse(localStorage.getItem("jsonAluno"));
    const atividade = JSON.parse(localStorage.getItem("jsonAtividade"));

    if (atividade && atividade.nome) {
        // Atribui o nome da atividade ao elemento <p> com id lblNomeAtividade
        document.getElementById("lblNomeAtividade").textContent = atividade.nome;

        document.getElementById("txtNome_onload").textContent = aluno.nome;
        document.getElementById("txtEmail_onload").textContent = aluno.email;

        fetch_get_selectQuestaoAtividade();
    }

    function fetch_get_selectQuestaoAtividade() {
        const atividade = JSON.parse(localStorage.getItem("jsonAtividade"));
        const uri = `/questao/atividade/${atividade.idAtividade}`;
        const token = localStorage.getItem("token");

        fetch(uri, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: `bearer <${token}>`,
            },
        })
        .then((response) => response.json())
        .then((jsonResposta) => {
            if (jsonResposta.status) {
                createQuestaoListGroup(jsonResposta.dados, "listGroup");
            } else {
                console.log(jsonResposta.msg);
            }
        })
        .catch((error) => {
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

        item.onclick = () => {
            listGroup.querySelectorAll('.list-group-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            handleQuestaoClick(elemento.idQuestao, elemento.nome, elemento.path_questao);
        };

        listGroup.appendChild(item);
    });

    const firstItem = listGroup.querySelector('.list-group-item');
    if (firstItem) {
        firstItem.click();
    }
}

function handleQuestaoClick(idQuestao, nome, path_questao) {
    const questaoInfo = { idQuestao, nome, path_questao };
    localStorage.setItem("jsonQuestao", JSON.stringify(questaoInfo));
    fetch_get_NotaQuestao();
}

function fetch_get_NotaQuestao() {
    const questao = JSON.parse(localStorage.getItem("jsonQuestao"));
    const aluno = JSON.parse(localStorage.getItem("jsonAluno"));
    const uri = `/entrega/nota/${questao.idQuestao}/${aluno.matricula}`;
    const token = localStorage.getItem("token");

    fetch(uri, {
        method: "get",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `bearer <${token}>`,
        },
    })
    .then((response) => response.json())
    .then((jsonResposta) => {
        if (jsonResposta.status) {
            processNotaResponse(jsonResposta.dados[0]);
        } else {
            console.log(jsonResposta.msg);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function processNotaResponse(dados) {
    try{
        const nota = dados.nota;
        const corTabela = document.getElementById("corTabela");
        const lblStatus = document.getElementById('lblStatus');
        const lblMensagem = document.getElementById('lblMensagem');
        const btnEnviar = document.getElementById("btnEnviar");
    
        if (nota === 10) {
            updateTable("table-success", "Nota: 10", "Exercício correto");
            
            codigoEnviado(dados.path_entrega);

        } else if (nota === 0) {
            updateTable("table-danger", "Nota: 0", "Exercício incorreto");
        } else {
            resetTable();
        }
    
        function updateTable(cor, statusMsg, mensagem) {
            corTabela.className = `${cor}`;
            lblStatus.innerHTML = statusMsg;
            lblMensagem.innerHTML = mensagem;
            btnEnviar.disabled = true;
        }
    
        function resetTable() {
            corTabela.className = "table-light";
            lblStatus.innerHTML = "";
            lblMensagem.innerHTML = "";
            btnEnviar.disabled = false;
        }
    } catch {
        corTabela.className = "table-light";
        lblStatus.innerHTML = "";
        lblMensagem.innerHTML = "";
        btnEnviar.disabled = false;
    }
}

function codigoEnviado(path){

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

        const areaCodeEnviado = document.getElementById('areaCodeEnviado');
        areaCodeEnviado.innerHTML = "";
        areaCodeEnviado.innerHTML = `
        <div class="mt-4 p-5 text-white rounded scrollspy-item" style="background: #333;">
            <div class="row">
                <div class="col">
                    <h2>Código Enviado</h2>
                    <div class="mt-4 p-5 text-white rounded scrollspy-item" style="background: #1a1a1a; font-size: 24px;" id="lblQuestao">
                        <pre><code>${conteudoResult}</code></pre>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).catch((error) => {
        console.error("Erro ao carregar conteudo:", error);
    });
}