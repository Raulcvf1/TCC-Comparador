const path = require('path');
const { executeAndReturnContent } = require('../model/ConteudoInput');

const rota_conteudo_input = async (req, res) => {

    const nomeInput = req.body.input;
    const registro = req.body.registro;
    const idDisciplina = req.body.idDisciplina;
    const idAtividade = req.body.idAtividade;
  
    const inputDir = path.join(__dirname, '..', 'professor', registro, idDisciplina, idAtividade, 'input');

    // Executar e comparar arquivos
    try {
        const result = await executeAndReturnContent(nomeInput, inputDir);
        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }

};

module.exports = rota_conteudo_input;
