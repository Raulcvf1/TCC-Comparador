module.exports = function (app, banco) {
    const JwtToken = require("../model/jwtToken");
    const fs = require('fs').promises; // Usar versão de promessas do fs

    app.post("/conteudo", async (request, response) => {
        const jwt = new JwtToken();
        const token = request.headers.authorization;

        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {
            try {
                const path = request.body.path;

                // Verifica se o caminho foi fornecido
                if (!path) {
                    return response.status(400).send("Caminho não fornecido.");
                }

                // Lê o conteúdo do arquivo no caminho especificado
                const conteudo = await fs.readFile(path, 'utf8');

                // Retorna o conteúdo do arquivo
                response.status(200).send(conteudo);
            } catch (error) {
                response.status(500).send("Erro ao tentar ler o arquivo.");
            }
        } else {
            return response.status(401).json({ message: "Token inválido ou não fornecido" });
        }
    });
};
