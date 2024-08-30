module.exports = function (app, banco) {
    const JwtToken = require("../model/jwtToken");
    const fs = require('fs');
    const path = require('path');

    app.post("/uploadFoto", (req, res) => {
        const jwt = new JwtToken();
        const token = req.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (!tokenValido.status) {
            return res.status(401).json({ message: "Token inválido ou não fornecido" });
        }

        const data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });

        req.on('end', () => {
            const buffer = Buffer.concat(data);

            // Parse boundary
            const boundary = '--' + req.headers['content-type'].split('; ')[1].replace('boundary=', '');

            // Split parts by boundary
            const parts = buffer.toString().split(boundary).slice(1, -1);

            let customPath, fileName, fileType, fileContent;

            parts.forEach(part => {
                const headersBody = part.split('\r\n\r\n');
                const headers = headersBody[0].split('\r\n');
                const body = headersBody[1];

                if (headers[0].includes('filename=')) {
                    fileName = headers[0].match(/filename="(.+)"/)[1];
                    fileType = headers[2].split(': ')[1];
                    fileContent = Buffer.from(body, 'binary');
                } else if (headers[0].includes('name="customPath"')) {
                    customPath = body.trim();
                }
            });

            if (!customPath || !fileName || !fileContent) {
                return res.status(400).json({ status: false, msg: 'Dados incompletos.' });
            }

            if (!fs.existsSync(customPath)) {
                try {
                    fs.mkdirSync(customPath, { recursive: true });
                } catch (error) {
                    return res.status(500).json({ status: false, msg: 'Erro ao criar diretório.' });
                }
            }

            const filePath = path.join(customPath, `${Date.now()}_${fileName}`);

            fs.writeFile(filePath, fileContent, (err) => {
                if (err) {
                    console.error("Erro ao salvar o arquivo:", err.message);
                    return res.status(500).json({ status: false, msg: 'Erro ao salvar o arquivo.' });
                }

                res.json({ status: true, filePath: filePath });
            });
        });

        req.on('error', (err) => {
            console.error("Erro na requisição:", err.message);
            return res.status(500).json({ status: false, msg: 'Erro na requisição: ' + err.message });
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
