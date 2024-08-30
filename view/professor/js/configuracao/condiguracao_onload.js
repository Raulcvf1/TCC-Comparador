window.onload = async function () {
    try {
        var professor = JSON.parse(localStorage.getItem("jsonProfessor"));

        const token = localStorage.getItem("token");
        console.log(token);

        const response = await fetch('/professor/foto/' + professor.matricula, {
            method: "GET",
            headers: {
                Accept: "application/json", // Aceita json como resposta da API
                "Content-Type": "application/json", // Informa que irá enviar para API conteúdo em json
                authorization: "Bearer " + token, // Envia o token de autenticação
            }
        });

        const jsonResposta = await response.json();

        if (jsonResposta.status) {
            console.log("Foto do professor obtida com sucesso:", jsonResposta.dados);
            if (jsonResposta.dados.path_foto) {
                document.getElementById('imgJumbo').src = jsonResposta.dados.path_foto;
            } else {
                document.getElementById('imgJumbo').src = "/img/user2.png"; // Caminho relativo
            }
        } else {
            console.error("Erro ao obter foto do professor:", jsonResposta.msg);
        }
    } catch (error) {
        console.error("Erro durante a obtenção da foto do professor:", error);
    }
}
