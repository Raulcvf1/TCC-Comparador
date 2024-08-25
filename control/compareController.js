const path = require('path');
const { executeAndCompare } = require('../model/compare');

const compareController = async (req, res) => {
    const file1 = req.files.file1;
    const file2 = req.files.file2;
    const inputs = req.files.inputs;
    const language = req.body.language;

    const file1Path = path.join(__dirname, '..', 'uploads', file1.name);
    const file2Path = path.join(__dirname, '..', 'uploads', file2.name);
    const inputsPath = path.join(__dirname, '..', 'uploads', inputs.name);

    // Salvar arquivos na pasta uploads
    file1.mv(file1Path, (err) => {
        if (err) return res.status(500).send(err);
        file2.mv(file2Path, (err) => {
            if (err) return res.status(500).send(err);
            inputs.mv(inputsPath, async (err) => {
                if (err) return res.status(500).send(err);

                // Executar e comparar arquivos
                try {
                    const result = await executeAndCompare(file1.name, file2.name, inputs.name, language);
                    res.json(result);
                } catch (err) {
                    res.status(500).send(err.message);
                }
            });
        });
    });
};

module.exports = compareController;
