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

function getExtensao(linguagem){
    let extensao = ""

    switch(linguagem){
        case 'csharp':
            extensao = ".cs";
            return extensao;
        case 'python':
            extensao = ".py";
            return extensao;
        case 'c':
            extensao = ".cpp";
            return extensao;
        case 'java':
            extensao = ".java";
            return extensao;
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
}

// Função principal para executar os scripts e comparar os resultados
async function executeAndReturnContent(file1, linguagem, professorDir) {

    try {

        let extensao = getExtensao(linguagem);

        const conteudoQuestao = readFileContent(path.join(professorDir, file1 + extensao));

        if (conteudoQuestao) {
            return { success: true, scriptProfessor: conteudoQuestao};
        } else {
            return { 
                success: false, 
                message: "deu erro",
                nomeQuestao
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
