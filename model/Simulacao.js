const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path'); 

module.exports = class Simulacao {
    constructor(language, pathQuestao, pathEntrada) {
        this.language = language;
        this.pathQuestao = pathQuestao;
        this.pathEntrada = pathEntrada;
        this.output = 'C:\\workspace tcc\\corretorFinalizado\\professor\\output.txt';  // Arquivo de saída padrão
    }

    getComandosExecucao() {
        switch (this.language) {
            case 'csharp':
                // Separar o caminho do diretório e o nome do arquivo
                const questaoPath = this.pathQuestao;
                const directoryPath = path.dirname(questaoPath);
                const fileNameWithoutExt = path.basename(questaoPath, '.cs');

                // Construir os comandos usando as partes separadas
                return {
                    compileCommand: `cd "${directoryPath}" && csc "${fileNameWithoutExt}.cs"`,
                    executeCommand: `"${path.join(directoryPath, fileNameWithoutExt + '.exe')}" < "${this.pathEntrada}" > "${this.output}"`
                };
            case 'python':
                return {
                    executeCommand: `python3 "${this.pathQuestao}" < "${this.pathEntrada}" > "${this.output}"`
                };
            case 'c':
                const exeFileCpp = this.pathQuestao.replace('.cpp', '');
                return {
                    compileCommand: `g++ "${this.pathQuestao}" -o "${exeFileCpp}"`,
                    executeCommand: `./"${exeFileCpp}" < "${this.pathEntrada}" > "${this.output}"`
                };
            case 'java':
                const className = this.pathQuestao.replace('.java', '');
                return {
                    compileCommand: `javac "${this.pathQuestao}"`,
                    executeCommand: `java -cp "${this.pathQuestao.substring(0, this.pathQuestao.lastIndexOf('\\'))}" ${className.split('\\').pop()} < "${this.pathEntrada}" > "${this.output}"`
                };
            default:
                throw new Error(`Unsupported language: ${this.language}`);
        }
    }

    lerConteudoArquivo(caminhoArquivo) {
        try {
            return fs.readFileSync(caminhoArquivo, 'utf-8').trim();
        } catch (err) {
            console.error(`Erro ao ler o arquivo ${caminhoArquivo}:`, err);
            throw err;
        }
    }

    async executar() {
        try {
            const { compileCommand, executeCommand } = this.getComandosExecucao();

            if (compileCommand) {
                execSync(compileCommand);
            }

            execSync(executeCommand);

            const outputContent = this.lerConteudoArquivo(this.output);
            const inputContent = this.lerConteudoArquivo(this.pathEntrada);
            const questaoContent = this.lerConteudoArquivo(this.pathQuestao);

            return {
                success: true,
                outputProfessor: outputContent,
                inputProfessor: inputContent,
                scriptProfessor: questaoContent
            };
        } catch (err) {
            return { success: false, message: err.message };
        } finally {
            // Limpeza de arquivos temporários, se necessário
        }
    }
};
