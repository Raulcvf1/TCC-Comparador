window.onload = function() { // Torne a função assíncrona
    // Recupera o objeto do localStorage
    var atividade = JSON.parse(localStorage.getItem("jsonAtividade"));

    // Verifica se o objeto foi encontrado e se possui o atributo nome
    if (atividade && atividade.nome) {
        // Atribui o nome da atividade ao elemento <p> com id lblNomeAtividade
        document.getElementById("lblNomeAtividade").textContent = atividade.nome;
    }

    
};
