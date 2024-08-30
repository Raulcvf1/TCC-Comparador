const Comparador = require('../model/Comparador');
const JwtToken = require("../model/jwtToken");

module.exports = function (app) {
    app.post('/comparador', async (req, res) => {
        const jwt = new JwtToken();
        const token = req.headers.authorization;
        const tokenValido = jwt.validarToken(token);

        if (tokenValido.status == true) {
            const { language, path_professor, path_aluno, path_entrada } = req.body;

            try {
                // Simulação para o professor
                const comparadorProfessor = new Comparador(language, path_professor, path_entrada);
                const resultadoProfessor = await comparadorProfessor.executar();

                if (!resultadoProfessor.success) {
                    return res.status(500).json({ message: "Erro na execução do script do professor", detalhes: resultadoProfessor.message });
                }

                // Simulação para o aluno
                const comparadorAluno = new Comparador(language, path_aluno, path_entrada);
                const resultadoAluno = await comparadorAluno.executar();

                if (!resultadoAluno.success) {
                    return res.status(500).json({ message: "Erro na execução do script do aluno", detalhes: resultadoAluno.message });
                }

                // Comparação dos outputs
                const arquivosIguais = resultadoProfessor.outputProfessor === resultadoAluno.outputProfessor;

                res.status(200).json({
                    success: true,
                    arquivosIguais,
                    mensagem: arquivosIguais ? "As respostas são idênticas." : "As respostas são diferentes."
                });
            } catch (erro) {
                res.status(500).json({ message: erro.message });
            }
        } else {
            res.status(401).json({ message: "Token inválido ou não fornecido" });
        }
    });
};
