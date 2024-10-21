window.onload = function() {
    var professor = JSON.parse(localStorage.getItem("jsonProfessor"));

    // Verifica se o objeto foi encontrado e se possui o atributo nome
    if (professor && professor.nome && professor.registro) {
        // Atribui o nome do professor ao elemento <p> com id txtNome_onload
        document.getElementById("txtNome_onload").textContent = professor.nome;
        document.getElementById("txtEmail_onload").textContent = professor.email;
    }
}