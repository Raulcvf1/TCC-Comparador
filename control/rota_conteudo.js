const path = require('path');
const { executeAndReturnContent } = require('../model/Conteudo');

const rota_conteudo = async (req, res) => {

    const nomeQuestao = req.body.questao;
    const registro = req.body.registro;
    const idDisciplina = req.body.idDisciplina;
    const linguagem = req.body.linguagem;
    const idAtividade = req.body.idAtividade;
  
    const professorDir = path.join(__dirname, '..', 'professor', registro, idDisciplina, idAtividade);

    // Executar e comparar arquivos
    try {
        const result = await executeAndReturnContent(nomeQuestao,  linguagem, professorDir);
        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }

};

module.exports = rota_conteudo;
