document.getElementById('btnAtualizarPerfil').addEventListener('click', () => {

    console.log(document.getElementById("txtNomeAtualizar").value);
    console.log(document.getElementById("txtEmailAtualizar").value);
    console.log(document.getElementById("txtSenhaAtualizar").value);

    const obJson = {
        nome : document.getElementById("txtNomeAtualizar").value,
        email: document.getElementById("txtEmailAtualizar").value,
        senha: document.getElementById("txtSenhaAtualizar").value
    }

    const stringJson = JSON.stringify(obJson);

    var professor = JSON.parse(localStorage.getItem("jsonProfessor"));

    const uri = `/professor/${professor.registro}`;

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

            let stringJsonProfessor = JSON.stringify(jsonResposta.dados);

            localStorage.removeItem("jsonProfessor");
            localStorage.setItem("jsonProfessor", stringJsonProfessor);
            window.location.href = "home.html";

        } else {
            console.log(jsonResposta.msg);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});