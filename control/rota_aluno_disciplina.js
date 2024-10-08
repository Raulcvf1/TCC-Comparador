//app e banco são recebidos quando fazemos a chamada

const AlunoDisciplina = require("../model/AlunoDisciplina");

// de rotas_funcionarios
module.exports = function (app, banco) {
    const JwtToken = require("../model/jwtToken");

    const Aluno = require("../model/Aluno");

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
    app.post("/alunodisciplina", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;

        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const matricula = request.body.matricula;
            const id = request.body.id;
            const disciplinaid = request.body.disciplinaid;
     
  
            const alunodisciplina = new AlunoDisciplina(banco);

            alunodisciplina.setId(id);
            alunodisciplina.setIdDisciplina(disciplinaid);
            
            const aluno = new Aluno(banco);

            aluno.setMatricula(matricula);

            alunodisciplina.setAluno(aluno);
            
            alunodisciplina.create()

            .then((resultadosBanco) => {

                const lastInsertId = resultadosBanco.insertId;

                /* Criar subpasta com o ID do professor
                const disciplinaDir = path.join(__dirname, '../professor/' + professor_registro, lastInsertId.toString());
                fs.mkdir(disciplinaDir, (err) => {
                    if (err) {
                        console.log("DEU ERRO");
                    }
                    console.log("DEU CERTO")
                });*/

                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    id: lastInsertId,
                    idaluno: alunodisciplina.getId(),
                    iddadisciplina: alunodisciplina.getIdDisciplina(),
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
    app.get("/alunodisciplina", function (request, response) {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const alunodisciplina = new AlunoDisciplina(banco);

            alunodisciplina.read()
            
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
    app.get("/alunodisciplina/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const alunodisciplina = new AlunoDisciplina(banco);
    
            const id = request.params.id;

            alunodisciplina.setId(id);


            alunodisciplina.read()

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
    app.get("/disciplina/alunodisciplina/:code/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const disciplina = new Disciplina(banco);

            const codeDisciplina = request.params.code;

            disciplina.setCode(codeDisciplina);

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
    app.put("/alunodisciplina/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const matricula = request.body.matricula;
            const id = request.body.id;
            const disciplinaid = request.body.disciplinaid;
     
  
            const alunodisciplina = new AlunoDisciplina(banco);

            alunodisciplina.setId(id);
            alunodisciplina.setIdDisciplina(disciplinaid);
            
            const aluno = new Aluno(banco);

            aluno.setMatricula(matricula);

            alunodisciplina.setAluno(aluno);
            
            alunodisciplina.update()

            .then((resultadosBanco) => {
                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    idaluno: alunodisciplina.getId(),
                    iddadisciplina: alunodisciplina.getIdDisciplina(),
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

            const alunodisciplina = new AlunoDisciplina(banco);

            alunodisciplina.setId(id);

            alunodisciplina.delete()
            
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
