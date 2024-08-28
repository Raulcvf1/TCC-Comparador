module.exports = function (app, banco) {
    const JwtToken = require("../model/jwtToken");
    const fs = require('fs');
    const path = require('path');

    app.post("/uploadQuestao", (request, response) => {
        const jwt = new JwtToken();
        const token = request.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (!tokenValido.status) {
            return response.status(401).json({ message: "Token inválido ou não fornecido" });
        }

        const { customPath, fileName, fileType, fileContent } = request.body;

        if (!customPath || !fileName || !fileContent) {
            return response.status(400).json({ status: false, msg: 'Dados incompletos.' });
        }

        if (!fs.existsSync(customPath)) {
            try {
                fs.mkdirSync(customPath, { recursive: true });
            } catch (error) {
                return response.status(500).json({ status: false, msg: 'Erro ao criar diretório.' });
            }
        }

        const filePath = path.join(customPath, `${Date.now()}_${fileName}`);

        fs.writeFile(filePath, fileContent, (err) => {
            if (err) {
                console.error("Erro ao salvar o arquivo:", err.message);
                return response.status(500).json({ status: false, msg: 'Erro ao salvar o arquivo.' });
            }

            response.json({ status: true, filePath: filePath });
        });
    });

    // Tratamento de erros de upload
    app.use((err, req, res, next) => {
        if (err) {
            console.error("Erro no upload:", err.message);
            return res.status(500).json({ status: false, msg: 'Erro no upload: ' + err.message });
        }
        next();
    });
};
