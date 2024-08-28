module.exports = function (app, banco) {
    const JwtToken = require("../model/jwtToken");
    const fs = require('fs').promises; // Usar versão de promessas do fs

    app.post("/deletePath", async (request, response) => {
        const jwt = new JwtToken();
        const token = request.headers.authorization;

        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {
            const path = request.body.path;

            try {
                // Verifica se o caminho existe
                await fs.access(path);

                // Se existir, remove o caminho
                await fs.rm(path, { recursive: true, force: true });
                console.log(`${path} foi removido com sucesso.`);

                response.status(200).send("Caminho removido com sucesso.");

            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`${path} não existe.`);
                    response.status(404).send("Caminho não encontrado.");
                } else {
                    console.error(`Erro ao tentar remover ${path}:`, error);
                    response.status(500).send("Erro ao tentar remover o caminho.");
                }
            }
        } else {
            return response.status(401).json({ message: "Token inválido ou não fornecido" });
        }
    });
};
