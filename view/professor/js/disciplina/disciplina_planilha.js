document.getElementById('btnPlanilha').addEventListener('click', () => {

    const dados = [, 1, 6];

    const uri = `/disciplina/planilha/[${dados}]`;

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

            console.log("RECEBIDO: " + jsonResposta.dados[0].matricula);

        } else {
            console.log(jsonResposta.msg);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});
