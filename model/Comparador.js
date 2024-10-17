const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = class Comparador {
    constructor(language, pathQuestao, pathEntrada) {
        this.language = language;
        this.pathQuestao = pathQuestao;
        this.pathEntrada = pathEntrada;
        this.output = path.join(path.dirname(this.pathQuestao), 'output.txt');  // Define o arquivo de saída baseado no diretório do arquivo da questão
    }

    getComandosExecucao() {
        switch (this.language) {
            case 'csharp':
                const directoryPath = path.dirname(this.pathQuestao);
                const fileNameWithoutExt = path.basename(this.pathQuestao, '.cs');
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
                    executeCommand: `java -cp "${path.dirname(this.pathQuestao)}" ${className.split('/').pop()} < "${this.pathEntrada}" > "${this.output}"`
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
            return {
                success: true,
                outputProfessor: outputContent,
            };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
};
