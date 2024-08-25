const path = require('path');
const fs = require('fs');

const rota_upload_input = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const files = req.files.files;
    const registro = req.body.registro;
    const idDisciplina = req.body.idDisciplina;
    const idAtividade = req.body.idAtividade;

    const professorDir = path.join(__dirname, '..', 'professor', registro, idDisciplina, idAtividade, 'input');
    if (!fs.existsSync(professorDir)) {
        fs.mkdirSync(professorDir, { recursive: true });
    }

    const saveFile = (file, fileName) => {
        return new Promise((resolve, reject) => {
            const filePath = path.join(professorDir, fileName);
            file.mv(filePath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    };

    try {
        if (Array.isArray(files)) {
            await Promise.all(files.map((file, index) => saveFile(file, file.name)));
        } else {
            await saveFile(files, files.name);
        }
        res.send('Files uploaded successfully.');
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = rota_upload_input;
