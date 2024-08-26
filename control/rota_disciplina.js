//app e banco são recebidos quando fazemos a chamada

const Disciplina = require("../model/Disciplina");

// de rotas_funcionarios
module.exports = function (app, banco) {
    const JwtToken = require("../model/jwtToken");

    const Professor = require("../model/Professor");

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
    app.post("/disciplina", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;

        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const nome = request.body.nome;
            const serie = request.body.serie;
            const ano = new Date().getFullYear();
            const duplicado = request.body.duplicado;
            const linguagem = request.body.linguagem;
            const professor_registro = request.body.professor_registro;

            const disciplina = new Disciplina(banco);

            disciplina.setNome(nome);
            disciplina.setSerie(serie);
            disciplina.setAno(ano);
            disciplina.setDuplicado(duplicado);
            disciplina.setLinguagem(linguagem);

            const professor = new Professor(banco);
            professor.setRegistro(professor_registro);

            disciplina.setProfessor(professor);

            disciplina.create()
            .then((resultadosBanco) => {

                const lastInsertId = resultadosBanco.insertId;

                // Criar subpasta com o ID do professor
                const disciplinaDir = path.join(__dirname, '../professor/' + professor_registro, lastInsertId.toString());
                fs.mkdir(disciplinaDir, (err) => {
                    if (err) {
                        console.log("DEU ERRO");
                    }
                    console.log("DEU CERTO")
                });

                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    id: lastInsertId,
                    nome: disciplina.getNome(),
                    serie: disciplina.getSerie(),
                    ano: disciplina.getAno(),
                    duplicado: disciplina.getDuplicado(),
                    linguagem: disciplina.getLinguagem(),
                    codigo: disciplina.getCode(),
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
    app.get("/disciplina", function (request, response) {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const disciplina = new Disciplina(banco);

            disciplina.read()
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
    app.get("/disciplina/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const disciplina = new Disciplina(banco);

            const id = request.params.id;

            disciplina.setIdDisciplina(id);

            disciplina.read()
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
    get ID POR CODE UNICO
    */
    app.get("/disciplina/code/:codeunico/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const disciplina = new Disciplina(banco);

            const code = request.params.codeunico;

            disciplina.setCode(code);

            disciplina.readCodeUnicoDisciplina()
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
    get Disciplina Professor atual
    */
    app.get("/disciplina/professor/atual/:id/:ano", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const disciplina = new Disciplina(banco);

            const professor_registro = request.params.id;
            const ano = request.params.ano;

            const professor = new Professor(banco);
            professor.setRegistro(professor_registro);

            disciplina.setProfessor(professor);
            disciplina.setAno(ano);

            disciplina.readDisciplinaProfessor_ano_atual()
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
    get Disciplina Professor antiga
    */
    app.get("/disciplina/professor/antigo/:id/:ano", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const disciplina = new Disciplina(banco);

            const professor_registro = request.params.id;
            const ano = request.params.ano;

            const professor = new Professor(banco);
            professor.setRegistro(professor_registro);

            disciplina.setProfessor(professor);
            disciplina.setAno(ano);

            disciplina.readDisciplinaProfessor_ano_antigo()
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
    get Disciplina Aluno
    */
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

    /*
    update
    */
    app.put("/disciplina/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const id = request.params.id;
            const nome = request.body.nome;
            const serie = request.body.serie;
            const ano = request.body.ano;
            const duplicado = request.body.duplicado;
            const linguagem = request.body.linguagem;
            const code = request.body.code;
            const professor_registro = request.body.professor_registro;

            const disciplina = new Disciplina(banco);

            disciplina.setIdDisciplina(id);
            disciplina.setNome(nome);
            disciplina.setSerie(serie);
            disciplina.setAno(ano);
            disciplina.setDuplicado(duplicado);
            disciplina.setLinguagem(linguagem);
            disciplina.setCode(code);

            const professor = new Professor(banco);
            professor.setRegistro(professor_registro);

            disciplina.setProfessor(professor);

            disciplina.update()
            .then((resultadosBanco) => {
                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    id: disciplina.getIdDisciplina(),
                    nome: disciplina.getNome(),
                    serie: disciplina.getSerie(),
                    ano: disciplina.getAno(),
                    duplicado: disciplina.getDuplicado(),
                    linguagem: disciplina.getLinguagem(),
                    codigo: disciplina.getCode(),
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
    app.delete("/disciplina/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const id = request.params.id;

            const disciplina = new Disciplina(banco);

            disciplina.setIdDisciplina(id);

            disciplina.delete()
            .then((resultadosBanco) => {
                const resposta = {
                status: true,
                msg: "Excluido com sucesso",
                codigo: "004",
                dados: {
                    registro: disciplina.getIdDisciplina(),
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
