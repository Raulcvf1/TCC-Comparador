const btnNota = document.getElementById("btnNota");
const comboBoxAluno = document.getElementById("comboBoxAluno");
const comboBoxAtividade = document.getElementById("comboBoxAtividade");

btnNota.onclick = btnResposta_onclick;

function btnResposta_onclick() {

    document.getElementById("tabelaNotaIndividual").innerHTML = "";
    document.getElementById("areaCodeNotaIndividual").innerHTML = "";
    document.getElementById("lblNomeNota").innerHTML = "";

    const matricula = comboBoxAluno.value;
    const idAtividade = comboBoxAtividade.value;
    var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
    const idDisciplina = disciplina.idDisciplina;

    if (matricula && idDisciplina) {
        fetch_get_notaAluno(matricula, idAtividade, idDisciplina);
    }
}

function fetch_get_notaAluno(matricula, idAtividade, idDisciplina) {
    const uri = idAtividade
        ? `/disciplina/nota/${matricula}/${idAtividade}/${idDisciplina}`
        : `/disciplina/nota/${matricula}/null/${idDisciplina}`;

    const token = localStorage.getItem("token");

    fetch(uri, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "bearer <" + token + ">",
        },
    })
    .then((response) => response.text())
    .then((jsonResposta) => {
        console.log("RECEBIDO:", jsonResposta);
        const objetoJson = JSON.parse(jsonResposta);

        if (objetoJson.status === true) {
            // Verifica se o idAtividade foi informado (não é vazio ou null)
            const idAtividadeInformado = !!idAtividade;
            // Chama a função para gerar a tabela com base nos dados e a flag
            gerarTabelaNotas(objetoJson.dados, idAtividadeInformado);
        } else {
            console.log(objetoJson.msg);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function gerarTabelaNotas(dados, idAtividadeInformado) {
    let tabelaHTML = `
        <table class="table table-hover table-bordered">
            <thead class="table-light">
                <tr>
                    <th>Matrícula</th>
                    <th>Nome</th>
                    <th>Série</th>
                    <th>Turma</th>`;

    if (idAtividadeInformado) {
        tabelaHTML += `<th>Atividade</th>`;
        // Cria cabeçalhos adicionais para cada questão
        dados.forEach((questao, index) => {
            tabelaHTML += `<th>Questão ${index + 1}</th>`;
        });
    } else {
        // Cria cabeçalhos para cada atividade e a média de nota
        dados.forEach((atividade, index) => {
            tabelaHTML += `<th>Atividade ${index + 1}</th><th>Média Nota</th>`;
        });
    }

    tabelaHTML += `
                </tr>
            </thead>
            <tbody>
                <tr class="table-success">`;

    if (idAtividadeInformado) {
        // Adiciona dados do aluno e da atividade em uma única linha

        tabelaHTML += `
                    <td>${dados[0].matricula}</td>
                    <td>${dados[0].nomeAluno}</td>
                    <td>${dados[0].serie}</td>
                    <td>${dados[0].turma}</td>
                    <td>${dados[0].nomeAtividade}</td>`;

        // Adiciona informações de cada questão com o botão "Visualizar"
        dados.forEach((questao) => {
            tabelaHTML += `
                    <td>${questao.nota} 
                        <button type="button" class="btn btn-primary visualizar-btn" data-path="${questao.path_entrega}">
                            Visualizar
                        </button>
                    </td>`;
        });
    } else {
        // Adiciona dados do aluno em uma única linha
        tabelaHTML += `
                    <td>${dados[0].matricula}</td>
                    <td>${dados[0].nomeAluno}</td>
                    <td>${dados[0].serie}</td>
                    <td>${dados[0].turma}</td>`;

        // Adiciona nome e média da nota para cada atividade
        dados.forEach((atividade) => {
            tabelaHTML += `<td>${atividade.nomeAtividade}</td><td>${atividade.mediaNota}</td>`;
        });
    }

    tabelaHTML += `
                </tr>
            </tbody>
        </table>`;

    // Insere a tabela no div com id "tabelaNotaIndividual"
    document.getElementById("tabelaNotaIndividual").innerHTML = tabelaHTML;

    // Adiciona o evento de clique para todos os botões "Visualizar"
    const buttons = document.querySelectorAll(".visualizar-btn");
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const path = button.getAttribute("data-path");
            visualizarQuestao(path);
        });
    });
}

function visualizarQuestao(path) {

    document.getElementById("lblNomeNota").innerText = "Código Enviado";

    const token = localStorage.getItem("token");

    console.log("Abrindo arquivo:", path);

    const conteudoPathRequest = {
        method: "POST",
        body: JSON.stringify({ path: path }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "bearer <" + token + ">",
        },
    };

    fetch("/conteudo", conteudoPathRequest)
        .then((conteudoResponse) => conteudoResponse.text())
        .then((conteudoResult) => {
            console.log("Conteúdo do arquivo:", conteudoResult);

            const areaCodeNotaIndividual = document.getElementById('areaCodeNotaIndividual');
            areaCodeNotaIndividual.innerHTML = `
            <div class="text-white rounded scrollspy-item p-5" style="background: #1a1a1a; font-size: 24px;" id="lblQuestao">
                <pre><code>${conteudoResult}</code></pre>
            </div>`;
        })
        .catch((error) => {
            console.error("Erro ao carregar conteúdo:", error);
        });
}