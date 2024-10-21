window.onload = function() {
    var aluno = JSON.parse(localStorage.getItem("jsonAluno"));

    // Verifica se o objeto foi encontrado e se possui o atributo nome
    if (aluno && aluno.nome && aluno.email) {
        // Atribui o nome do professor ao elemento <p> com id txtNome_onload
        document.getElementById("txtNome_onload").textContent = aluno.nome;
        document.getElementById("txtEmail_onload").textContent = aluno.email;
    }
}