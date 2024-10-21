document.getElementById('btnAtualizarPerfil').addEventListener('click', () => {
    const obJson = {
        nome : document.getElementById("txtNomeAtualizar").value,
        email: document.getElementById("txtEmailAtualizar").value,
        senha: document.getElementById("txtSenhaAtualizar").value
    }

    const stringJson = JSON.stringify(obJson);

    var aluno = JSON.parse(localStorage.getItem("jsonAluno"));

    const uri = `/aluno/${aluno.matricula}`;

    const token = localStorage.getItem("token");

    fetch(uri, {
        method: "PUT",
        body: stringJson,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "bearer <" + token + ">",
        },
    })
    .then((response) => response.json())
    .then((jsonResposta) => {

        if (jsonResposta.status === true) {

            let stringJsonAluno = JSON.stringify(jsonResposta.dados);

            localStorage.removeItem("jsonAluno");
            localStorage.setItem("jsonAluno", stringJsonAluno);
            window.location.href = "home.html";

        } else {
            console.log(jsonResposta.msg);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});