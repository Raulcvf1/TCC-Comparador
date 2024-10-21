const checkBoxArea = document.getElementById("checkBoxArea");

function getCheckedCheckboxes() {
    // Inicia o array com a primeira posição vazia
    let checkedValues = [''];

    // Seleciona todos os checkboxes dentro de checkBoxArea
    const checkboxes = checkBoxArea.querySelectorAll('input[type="checkbox"]');

    // Itera sobre cada checkbox e verifica se está marcada
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Adiciona o valor do checkbox marcado ao array
            checkedValues.push(checkbox.value);
        }
    });

    return checkedValues;
}

document.getElementById('btnExportar').addEventListener('click', () => {

    const checkedValues = getCheckedCheckboxes();

    const uri = `/disciplina/planilha/[${checkedValues}]`;

    console.log("uri = " + uri);

    const token = localStorage.getItem("token");

    fetch(uri, {
        method: "get",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "bearer <" + token + ">",
        },
    })
    .then((response) => response.json())
    .then((jsonResposta) => {
        if (jsonResposta.status === true) {
            const dados = jsonResposta.dados;
            gerarExcel(dados);

        } else {
            console.log(jsonResposta.msg);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});

// Função para gerar o Excel
function gerarExcel(dados) {
    const ws_data = [
        ["Matrícula", "Nome do Aluno", "Série", "Turma", "Média Nota Atividades"]
    ];

    // Preencher os dados no formato adequado
    dados.forEach(aluno => {
        ws_data.push([
            aluno.matricula,
            aluno.nome_aluno,
            aluno.serie,
            aluno.turma,
            aluno.media_nota_atividades
        ]);
    });

    // Criar a planilha
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alunos");

    // Exportar para Excel
    XLSX.writeFile(wb, "planilha_notas_alunos.xlsx");
}
