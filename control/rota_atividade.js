//app e banco são recebidos quando fazemos a chamada

const Atividade = require("../model/Atividade");

// de rotas_funcionarios
module.exports = function (app, banco) {
    const JwtToken = require("../model/jwtToken");

    const Disciplina = require("../model/Disciplina");

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
    app.post("/atividade", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;

        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const nome = request.body.nome;
            const status = request.body.status;
            const Disciplina_idDisciplina = request.body.Disciplina_idDisciplina;

            const atividade = new Atividade(banco);

            atividade.setNome(nome);
            atividade.setStatus(status);

            const disciplina = new Disciplina(banco);
            disciplina.setIdDisciplina(Disciplina_idDisciplina);

            atividade.setDisciplina(disciplina);

            atividade.create()
            .then((resultadosBanco) => {

                const lastInsertId = resultadosBanco.insertId;

                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    id: lastInsertId,
                    nome: atividade.getNome(),
                    status: atividade.getStatus(),
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
    app.get("/atividade", function (request, response) {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const atividade = new Atividade(banco);

            atividade.read()
            .then((resultadosBanco) => {
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
    app.get("/atividade/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const atividade = new Atividade(banco);

            const id = request.params.id;

            atividade.setIdAtividade(id);

            atividade.read()
            .then((resultadosBanco) => {
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
    get ATIVIDADE POR DISCIPLINA
    */
    
    app.get("/atividade/disciplina/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const Disciplina_idDisciplina = request.params.id;

            const atividade = new Atividade(banco);

            const disciplina = new Disciplina(banco);
            disciplina.setIdDisciplina(Disciplina_idDisciplina);

            atividade.setDisciplina(disciplina);

            atividade.readAtividadeDisciplina()
            .then((resultadosBanco) => {
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
    get ATIVIDADE POR DISCIPLINA ALUNO
    */
    
    app.get("/atividade/disciplina/aluno/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const Disciplina_idDisciplina = request.params.id;

            const atividade = new Atividade(banco);

            const disciplina = new Disciplina(banco);
            disciplina.setIdDisciplina(Disciplina_idDisciplina);

            atividade.setDisciplina(disciplina);

            atividade.readAtividadeDisciplina_aluno()
            .then((resultadosBanco) => {
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
    get Disciplina Professor
    */

    /*
    app.get("/disciplina/professor/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const disciplina = new Disciplina(banco);

            const professor_registro = request.params.id;

            const professor = new Professor(banco);
            professor.setRegistro(professor_registro);

            disciplina.setProfessor(professor);

            disciplina.readDisciplinaProfessor()
            .then((resultadosBanco) => {
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

    */
    /*
    get Disciplina Aluno
    */

    /*
    app.get("/disciplina/aluno/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const disciplina = new Disciplina(banco);

            const idDisciplina = request.params.id;

            disciplina.setIdDisciplina(idDisciplina);

            disciplina.readDisciplinaAluno()
            .then((resultadosBanco) => {
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

    */

    /*
    update
    */
    app.put("/atividade/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const id = request.params.id;
            const nome = request.body.nome;
            const status = request.body.status;
            const Disciplina_idDisciplina = request.body.Disciplina_idDisciplina;

            const atividade = new Atividade(banco);

            atividade.setIdAtividade(id);
            atividade.setNome(nome);
            atividade.setStatus(status);

            const disciplina = new Disciplina(banco);
            disciplina.setIdDisciplina(Disciplina_idDisciplina);

            atividade.setDisciplina(disciplina);

            atividade.update()
            .then((resultadosBanco) => {
                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    id: atividade.getIdAtividade(),
                    nome: atividade.getNome(),
                    status: atividade.getStatus()
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
    update status
    */
    app.put("/atividade/status/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const id = request.params.id;
            const status = request.body.status;

            const atividade = new Atividade(banco);

            atividade.setIdAtividade(id);
            atividade.setStatus(status);

            atividade.update_status()
            .then((resultadosBanco) => {
                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    id: atividade.getIdAtividade(),
                    status: atividade.getStatus()
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
    app.delete("/atividade/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const id = request.params.id;

            const atividade = new Atividade(banco);

            atividade.setIdAtividade(id);

            atividade.delete()
            .then((resultadosBanco) => {
                const resposta = {
                status: true,
                msg: "Excluido com sucesso",
                codigo: "004",
                dados: {
                    registro: atividade.getIdAtividade(),
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
