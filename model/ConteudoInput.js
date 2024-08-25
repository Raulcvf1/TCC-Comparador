const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Função para ler o conteúdo do arquivo
function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8').trim();
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
        throw err;
    }
}

// Função principal para executar os scripts e comparar os resultados
async function executeAndReturnContent(file1, inputDir) {

    try {

        const conteudoScript = readFileContent(path.join(inputDir, file1));

        if (conteudoScript) {
            return { success: true, input: conteudoScript};
        } else {
            return { 
                success: false, 
                message: "deu erro",
                conteudoScript
            };
        }
    } catch (err) {
        return { success: false, message: err.message };
    } finally {
        //cleanUploadsFolder(); // Limpar a pasta uploads após a execução
    }
}

module.exports = {
    executeAndReturnContent
};
