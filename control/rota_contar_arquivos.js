const fs = require('fs');
const path = require('path');

const rota_contar_arquivos = async (req, res) => {

    const dirPath = path.join(__dirname, 'professor', '1', '1', '11', 'input');

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).send('Erro ao ler o diretório');
        }
        // Filtra apenas arquivos (excluindo diretórios)
        const fileCount = files.filter(file => fs.statSync(path.join(dirPath, file)).isFile()).length;
        console.log(fileCount);
        res.json({ count: fileCount });
    });
};

module.exports = rota_contar_arquivos;
