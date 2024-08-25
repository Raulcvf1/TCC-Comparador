const path = require('path');
const { executeAndReturnContent } = require('../model/Simulacao');

const compareController = async (req, res) => {

    const language = req.body.language;
    const registro = req.body.registro;
    const idDisciplina = req.body.idDisciplina;
    const idAtividade = req.body.idAtividade;
  
    const professorDir = path.join(__dirname, '..', 'professor', registro, idDisciplina, idAtividade);

    // Executar e comparar arquivos
    try {
        const result = await executeAndReturnContent(file1.name, inputs.name, language, professorDir);
        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }

};

module.exports = compareController;
