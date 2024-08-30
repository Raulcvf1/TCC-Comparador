const btnEntregaCreate = document.getElementById("btnEntregaCreate");
const formFile = document.getElementById("formFile");

btnEntregaCreate.onclick = async function() {

    var meuModal = new bootstrap.Modal(btnEntregaCreate);
    meuModal.hide();

    const aluno = JSON.parse(localStorage.getItem("jsonAluno"));
    const disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
    const atividade = JSON.parse(localStorage.getItem("jsonAtividade"));
    const questao = JSON.parse(localStorage.getItem("jsonQuestao"));

    const customPath = `C:\\workspace tcc\\corretorFinalizado\\aluno\\${aluno.matricula}\\${disciplina.idDisciplina}\\${atividade.idAtividade}\\${questao.nome}`;

    const file = formFile.files[0];

    const data = {
        customPath: customPath,
        fileName: file.name,
        fileType: file.type,
        fileContent: await file.text()
    };

    try {
        const token = localStorage.getItem("token");

        const uploadResponse = await fetch('/upload', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${token}`,
            }
        });

        if (!uploadResponse.ok) {
            console.error("Erro ao fazer upload do arquivo");
            return;
        }

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.status) {
            console.error("Erro ao fazer upload do arquivo");
            return;
        }

        const objJson = {
            path: uploadResult.filePath,
            caixa: "enviar",
            Questao_idQuestao: questao.idQuestao,
            Aluno_matricula: aluno.matricula
        };

        await fetch_post_createEntrega(objJson);

    } catch (error) {
        console.error("Erro durante o upload ou criação da questão:", error);
    }
};

async function fetch_post_createEntrega(objJson) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch('/entrega', {
            method: "POST",
            body: JSON.stringify(objJson),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: `bearer ${token}`,
            }
        });

        const jsonResposta = await response.json();

        if (jsonResposta.status) {
            console.log("Entrega feita com sucesso:", jsonResposta.dados);

            const path_aluno = jsonResposta.dados.path_entrega;

            var questao = JSON.parse(localStorage.getItem("jsonQuestao"));
            const path_professor = questao.path_questao;

            var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
            const linguagem = disciplina.linguagem;

            const entradaResponse = await fetch(`/entrada/questao/${questao.idQuestao}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    authorization: `bearer ${token}`,
                }
            });

            const entradaJson = await entradaResponse.json();

            if (entradaJson.status) {
                const entradas = entradaJson.dados;
                let todasCorretas = true;

                for (let entrada of entradas) {
                    const comparacaoResponse = await fetch('/comparador', {
                        method: 'POST',
                        body: JSON.stringify({
                            language: linguagem,
                            path_professor: path_professor,
                            path_aluno: path_aluno,
                            path_entrada: entrada.path_entrada
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `bearer ${token}`,
                        }
                    });

                    const comparacaoResult = await comparacaoResponse.json();

                    if (!comparacaoResult.arquivosIguais) {
                        todasCorretas = false;
                        break;
                    }
                }

                if (todasCorretas) {

                    const questao = JSON.parse(localStorage.getItem("jsonQuestao"));
                    const aluno = JSON.parse(localStorage.getItem("jsonAluno"));
                    
                    const objJson = {
                        nota: 10,
                        path: path_aluno,
                        caixa: "enviar",
                        Questao_idQuestao: questao.idQuestao,
                        Aluno_matricula: aluno.matricula
                    };

                    const entregaResponse = await fetch(`/entrega/${jsonResposta.dados.idEntrega}`, {
                        method: "put",
                        body: JSON.stringify(objJson),
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            authorization: `bearer ${token}`,
                        }
                    });
        
                    const entregaPutJson = await entregaResponse.json();

                    if (entregaPutJson.status) {

                        console.log("update realizado com sucesso")
                        location.reload();

                    } else {
                        console.error("Erro ao obter entradas:", entregaPutJson.msg);
                    }

                    console.log("Questão correta");

                } else {

                    const questao = JSON.parse(localStorage.getItem("jsonQuestao"));
                    const aluno = JSON.parse(localStorage.getItem("jsonAluno"));
                    
                    const objJson = {
                        nota: 0,
                        path: path_aluno,
                        caixa: "enviar",
                        Questao_idQuestao: questao.idQuestao,
                        Aluno_matricula: aluno.matricula
                    };

                    const entregaResponse = await fetch(`/entrega/${jsonResposta.dados.idEntrega}`, {
                        method: "put",
                        body: JSON.stringify(objJson),
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            authorization: `bearer ${token}`,
                        }
                    });
        
                    const entregaPutJson = await entregaResponse.json();

                    if (entregaPutJson.status) {
                        
                        console.log("update realizado com sucesso")
                        location.reload();

                    } else {
                        console.error("Erro ao obter entradas:", entregaPutJson.msg);
                    }

                    console.log("Questão errada");
                }
            } else {
                console.error("Erro ao obter entradas:", entradaJson.msg);
            }
        } else {
            console.error("Erro ao efetuar entrega:", jsonResposta.msg);
        }
    } catch (error) {
        console.error("Erro durante a entrega da questão:", error);
    }
}
