//app e banco são recebidos quando fazemos a chamada

const Professor = require("../model/Professor");

// de rotas_funcionarios
module.exports = function (app, banco) {
    const JwtToken = require("../model/jwtToken");

    const fs = require('fs');
    const path = require('path');

    /*
    login
    */
    app.post("/professor/login", (request, response) => {

        const email = request.body.email;
        const senha = request.body.senha;

        const professor = new Professor(banco);
        professor.setEmail(email);
        professor.setSenha(senha);

        professor.login()
        .then((respostaLogin) => {
            if (respostaLogin.status == true) {
                let usuario = {
                    registro: respostaLogin.registro,
                    nome: respostaLogin.nome,
                    email: respostaLogin.email,
                };

                const jwt = new JwtToken();
                const novoToken = jwt.gerarToken(usuario);

                const resposta = {
                    status: true,
                    msg: "Login efetuado com sucesso",
                    token: novoToken,
                    professor: usuario,
                };

                response.status(201).send(resposta);

            } else {

                const resposta = {
                    status: false,
                    msg: "Usuário não logado",
                    codigo: 401,
                };

                res.status(status).send(body)
            }
        })
        .catch((erro) => {

            const resposta = {
                status: false,
                msg: "erro ao executar",
                codigo: "005",
                dados: erro,
            };

            response.status(201).send(erro);
        });
    });

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
    app.post("/professor", (request, response) => {

        const nome = request.body.nome;
        const email = request.body.email;
        const senha = request.body.senha;

        if (!nome || !email || !senha) {
            return response.status(400).send({
                status: false,
                msg: "Nome, email e senha são obrigatórios"
            });
        }

        const professor = new Professor(banco);
        professor.setNome(nome);
        professor.setEmail(email);
        professor.setSenha(senha);

        professor.create()
        .then((resultadosBanco) => {
            const lastInsertId = resultadosBanco.insertId;

            // Criar subpasta com o ID do professor
            const professorDir = path.join(__dirname, '../professor', lastInsertId.toString());
            fs.mkdir(professorDir, (err) => {
                if (err) {
                    console.log("DEU ERRO");
                }

                console.log("DEU CERTO")
            });

            // Verificação para garantir que os valores estejam definidos
            if (!professor.getNome() || !professor.getEmail()) {
                return response.status(500).send({
                    status: false,
                    msg: "Erro ao obter dados do professor após inserção"
                });
            }

            const usuario = {
                registro: lastInsertId,
                nome: professor.getNome(),
                email: professor.getEmail()
            };

            const jwt = new JwtToken();
            const novoToken = jwt.gerarToken(usuario);

            const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                token: novoToken,
                professor: usuario
            };
            response.status(200).send(resposta);
        })
        .catch((erro) => {
            console.error("Erro ao cadastrar usuário:", erro);
            const resposta = {
                status: false,
                msg: "Erro ao cadastrar usuário",
                dados: erro,
            };
            response.status(500).send(resposta);
        });
    });

    /*
    get ALL
    */
    app.get("/professor", function (request, response) {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const professor = new Professor(banco);

            professor.read()
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
    app.get("/professor/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const professor = new Professor(banco);

            const registro = request.params.id;

            professor.setRegistro(registro);

            professor.read()
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
    get ID
    */
    app.get("/professor/foto/:id/", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const professor = new Professor(banco);

            const registro = request.params.id;

            professor.setRegistro(registro);

            professor.readPahtFoto()
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
    app.put("/professor/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const registro = request.params.id;
            const nome = request.body.nome;
            const email = request.body.email;
            const senha = request.body.senha;

            console.log(nome);

            const professor = new Professor(banco);

            professor.setRegistro(registro);
            professor.setNome(nome);
            professor.setEmail(email);
            professor.setSenha(senha);

            professor.update()
            .then((resultadosBanco) => {
                const resposta = {
                status: true,
                msg: "Executado com sucesso",
                codigo: "004",
                dados: {
                    registro: professor.getRegistro(),
                    nome: professor.getNome(),
                    email: professor.getEmail(),
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
    app.delete("/professor/:id", (request, response) => {

        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {

            const registro = request.params.id;

            const professor = new Professor(banco);

            professor.setRegistro(registro);

            professor.delete()
            .then((resultadosBanco) => {
                const resposta = {
                status: true,
                msg: "Excluido com sucesso",
                codigo: "004",
                dados: {
                    registro: professor.getRegistro(),
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
