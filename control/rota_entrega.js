//app e banco são recebidos quando fazemos a chamada

const Entrega = require("../model/Entrega");

// de rotas_funcionarios
module.exports = function (app, banco) {
    const JwtToken = require("../model/jwtToken");

    const Questao = require("../model/Questao");
    const Aluno = require("../model/Aluno");

    const fs = require('fs');
    const path = require('path');

    //no bloco de codigo do professor/insert como posso testar o jwttoken do usuario vindo do bearer

    /*

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const dadosUsuario = tokenValido.dados;

        }else{
            return response.status(401).json({ message: "Token inválido ou não fornecido" });
        }

    */

    /*
    CREATE
    */
    app.post("/entrega", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;

        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const entrega = new Entrega(banco);
            const questao = new Questao(banco);
            const aluno = new Aluno(banco);

            const path = request.body.path;
            const caixa = request.body.caixa;
            const Questao_idQuestao = request.body.Questao_idQuestao;
            const Aluno_matricula = request.body.Aluno_matricula;

            questao.setIdQuestao(Questao_idQuestao);
            aluno.setMatricula(Aluno_matricula);

            entrega.setPath(path);
            entrega.setCaixa(caixa);
            entrega.setQuestao(questao);
            entrega.setAluno(aluno);

            entrega.create().then((resultadosBanco) => {

                const lastInsertId = resultadosBanco.insertId;

                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    idEntrega: lastInsertId,
                    path_entrega: entrega.getPath(),
                    caixa: entrega.getCaixa()
                },
                };
                response.status(200).send(resposta);

            }).catch((erro) => {
                console.error("Error retrieving users:", erro);
            });
        
        }else{
            return response.status(401).json({ message: "Token inválido ou não fornecido" });
        }
    });

    /*
    get ALL
    */
    app.get("/entrega", function (request, response) {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const entrega = new Entrega(banco);

            entrega.read().then((resultadosBanco) => {

                const resposta = {
                    status: true,
                    msg: "Executado com sucesso",
                    dados: resultadosBanco,
                };

                response.status(200).send(resposta);

            }).catch((erro) => {
                const resposta = {
                    status: false,
                    msg: "erro ao executar",
                    dados: erro,
                };
                response.status(200).send(resposta);
            });

        }else{
            return response.status(401).json({ message: "Token inválido ou não fornecido" });
        }

    });

    /*
    get ID
    */
    app.get("/entrega/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const entrega = new Entrega(banco);

            const id = request.params.id;

            entrega.setIdEntrega(id);

            entrega.read().then((resultadosBanco) => {
                const resposta = {
                status: true,
                msg: "executado com sucesso",
                dados: resultadosBanco,
                };
                response.status(200).send(resposta);
            })
            .catch((erro) => {
                const resposta = {
                status: false,
                msg: "erro ao executar",
                codigo: "005",
                dados: erro,
                };
                response.status(200).send(resposta);
            });

        }else{
            return response.status(401).json({ message: "Token inválido ou não fornecido" });
        }
    });

    /*
    get NOTA IDQUESTAO
    */
    app.get("/entrega/nota/:id/:matricula/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const entrega = new Entrega(banco);
            const questao = new Questao(banco);
            const aluno = new Aluno(banco);

            const id = request.params.id;
            const matricula = request.params.matricula;

            questao.setIdQuestao(id);
            aluno.setMatricula(matricula);

            entrega.setQuestao(questao);
            entrega.setAluno(aluno);

            entrega.readNotaQuestao().then((resultadosBanco) => {
                const resposta = {
                status: true,
                msg: "executado com sucesso",
                dados: resultadosBanco,
                };
                response.status(200).send(resposta);
            })
            .catch((erro) => {
                const resposta = {
                status: false,
                msg: "erro ao executar",
                codigo: "005",
                dados: erro,
                };
                response.status(200).send(resposta);
            });

        }else{
            return response.status(401).json({ message: "Token inválido ou não fornecido" });
        }
    });

    /*
    update
    */
    app.put("/entrega/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const entrega = new Entrega(banco);
            const questao = new Questao(banco);
            const aluno = new Aluno(banco);

            const id = request.params.id;
            const nota = request.body.nota;
            const path = request.body.path;
            const caixa = request.body.caixa;
            const Questao_idQuestao = request.body.Questao_idQuestao;
            const Aluno_matricula = request.body.Aluno_matricula;

            questao.setIdQuestao(Questao_idQuestao);
            aluno.setMatricula(Aluno_matricula);

            entrega.setIdEntrega(id);
            entrega.setNota(nota);
            entrega.setPath(path);
            entrega.setCaixa(caixa);
            entrega.setQuestao(questao);
            entrega.setAluno(aluno);

            entrega.update().then((resultadosBanco) => {

                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    idEntrega: entrega.getIdEntrega(),
                    nota: entrega.getNota(),
                    path_entrega: entrega.getPath(),
                    caixa: entrega.getCaixa()
                },
                };
                response.status(200).send(resposta);

            }).catch((erro) => {
                console.error("Error retrieving users:", erro);
            });
        
        }else{
            return response.status(401).json({ message: "Token inválido ou não fornecido" });
        }
    });

    /*
    delete
    */
    app.delete("/entrega/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const entrega = new Entrega(banco);

            const id = request.params.id;

            entrega.setIdEntrega(id);

            entrega.delete().then((resultadosBanco) => {

                const resposta = {
                status: true,
                msg: "Excluido com sucesso",
                codigo: "004",
                dados: {
                    id: entrega.getIdEntrega(),
                },
                };
                response.status(200).send(resposta);
            }).catch((erro) => {
                console.error("Error retrieving users:", erro);
            });

        }else{
            return response.status(401).json({ message: "Token inválido ou não fornecido" });
        }
    });
};
