window.onload = async function() { // Torne a função assíncrona
    // Recupera o objeto do localStorage
    var atividade = JSON.parse(localStorage.getItem("jsonAtividade"));

    // Verifica se o objeto foi encontrado e se possui o atributo nome
    if (atividade && atividade.nome) {
        // Atribui o nome da atividade ao elemento <p> com id lblNomeAtividade
        document.getElementById("lblNomeAtividade").textContent = atividade.nome;
    }

    // Verifica se a quantidade de questões existe
    if (atividade && atividade.quantidade_exercicios) {
        // Seleciona o elemento onde os itens da lista serão adicionados
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group mb-3';

        // Cria os itens da lista de acordo com a quantidade
        for (let i = 1; i <= atividade.quantidade_exercicios; i++) {
            const listItem = document.createElement('a');
            listItem.href = '#';
            if(i == 1){ listItem.className = 'list-group-item list-group-item-action active'; }
            else { listItem.className = 'list-group-item list-group-item-action'; }
            listItem.textContent = `Questão ${i}`;
            listItem.value = `questao${i}`; // Atribui o value

            // Vincula o evento de clique
            listItem.addEventListener('click', async function() {
                localStorage.setItem("nomeQuestao", listItem.value);

                var professor = JSON.parse(localStorage.getItem("jsonProfessor"));
                var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));

                const formData = new FormData();
                formData.append('questao', listItem.value);
                formData.append('registro', professor.registro);
                formData.append('idDisciplina', disciplina.idDisciplina);
                formData.append('linguagem', disciplina.linguagem);
                formData.append('idAtividade', atividade.idAtividade);

                const formData1 = new FormData();
                formData1.append('input', listItem.value);
                formData1.append('registro', professor.registro);
                formData1.append('idDisciplina', disciplina.idDisciplina);
                formData1.append('idAtividade', atividade.idAtividade);

                try {
                    const response = await fetch('/conteudoProfessor', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json(); // Se você espera uma resposta JSON
                        console.log('Resposta recebida:', result);

                        // Insere o conteúdo retornado da API na área designada
                        const conteudoArea = document.querySelector('.scrollspy-item .mt-4.p-5.bg-dark.text-white.rounded');
                        conteudoArea.innerHTML = ''; // Limpa o conteúdo anterior
                        conteudoArea.innerHTML = `<pre><code>${result.scriptProfessor}</code></pre>`; // Formata o conteúdo como código
                    } else {
                        console.error('Erro ao enviar dados:', response.statusText);
                    }

                    const response1 = await fetch('/conteudoInput', {
                        method: 'POST',
                        body: formData1
                    });

                    // Aqui é a correção
                    if (response1.ok) {
                        const result1 = await response1.json(); // Se você espera uma resposta JSON
                        console.log('Resposta recebida:', result1);

                        // Insere o conteúdo retornado da API na área designada
                        const conteudoArea1 = document.getElementById('txtInput');
                        conteudoArea1.innerHTML = ''; // Limpa o conteúdo anterior
                        conteudoArea1.innerHTML = `${result1.input}`; // Formata o conteúdo como código
                    } else {
                        console.error('Erro ao enviar dados:', response1.statusText);
                    }

                } catch (error) {
                    console.error('Erro:', error);
                }
            });

            // Adiciona o item à lista
            listGroup.appendChild(listItem);
        }

        // Adiciona a lista criada à área designada
        const scrollspyItem = document.querySelector('.scrollspy-item');
        scrollspyItem.insertBefore(listGroup, scrollspyItem.firstChild);

        // Simula um clique no primeiro item da lista automaticamente
        if (listGroup.children.length > 0) {
            listGroup.children[0].click();
        }
    }
};
