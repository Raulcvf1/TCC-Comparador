const Simulacao = require('../model/Simulacao');

module.exports = function (app) {
    const JwtToken = require("../model/jwtToken");

    app.post('/simulacao', async (req, res) => {
        const jwt = new JwtToken();
        const token = req.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {
            const { language, path_questao, path_entrada } = req.body;

            try {
                const simulacao = new Simulacao(language, path_questao, path_entrada);
                const resultado = await simulacao.executar();
                res.status(200).json(resultado);
            } catch (erro) {
                res.status(500).json({ message: erro.message });
            }
        } else {
            res.status(401).json({ message: "Token inválido ou não fornecido" });
        }
    });
};
