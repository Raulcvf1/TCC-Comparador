//app e banco são recebidos quando fazemos a chamada

const Entrada = require("../model/Entrada");

// de rotas_funcionarios
module.exports = function (app, banco) {
    const JwtToken = require("../model/jwtToken");

    const Questao = require("../model/Questao");

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
    app.post("/entrada", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;

        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const path = request.body.path;
            const Questao_idQuestao = request.body.Questao_idQuestao;

            const entrada = new Entrada(banco);

            entrada.setPath(path);

            const questao = new Questao(banco);
            questao.setIdQuestao(Questao_idQuestao);

            entrada.setQuestao(questao);

            entrada.create().then((resultadosBanco) => {

                const lastInsertId = resultadosBanco.insertId;

                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    id: lastInsertId,
                    path: questao.getPath()
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
    app.get("/entrada", function (request, response) {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const entrada = new Entrada(banco);

            entrada.read().then((resultadosBanco) => {

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
    app.get("/entrada/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const entrada = new Entrada(banco);

            const id = request.params.id;

            entrada.setIdEntrada(id);

            entrada.read().then((resultadosBanco) => {
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
    get Entrada Questao
    */
    app.get("/entrada/questao/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const questao = new Questao(banco);
            const entrada = new Entrada(banco);

            const id = request.params.id;

            questao.setIdQuestao(id);
            entrada.setQuestao(questao);

            entrada.readEntradaQuestao().then((resultadosBanco) => {
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
    app.put("/questao/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const id = request.params.id;
            const path = request.body.path;
            const Questao_idQuestao = request.body.Questao_idQuestao;

            const entrada = new Entrada(banco);

            entrada.setIdEntrada(id);
            entrada.setNome(nome);
            entrada.setPath(path);

            const questao = new Questao(banco);
            questao.setIdQuestao(Questao_idQuestao);

            entrada.setQuestao(questao);

            entrada.update().then((resultadosBanco) => {

                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    id: entrada.getIdQuestao(),
                    path: entrada.getPath()
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
    app.delete("/entrada/:idEntrada", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {
            const idEntrada = request.params.idEntrada;

            const entrada = new Entrada(banco);

            entrada.setIdEntrada(idEntrada);

            entrada.delete().then((resultadosBanco) => {

                const resposta = {
                status: true,
                msg: "Excluido com sucesso",
                codigo: "004",
                dados: {
                    id: entrada.getIdEntrada(),
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
