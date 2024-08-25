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

// Função para obter os comandos de compilação e execução para cada linguagem
function getExecutionCommands(file, inputs, output, language) {
    switch (language) {
        case 'csharp':
            const exeFileCs = file.replace('.cs', '.exe');
            const compileCommand = `"C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe" ${file}`;
            const executeCommand = `"${exeFileCs}" < ${inputs} > ${output}`;
            return { compileCommand, executeCommand };
        case 'python':
            return {
                executeCommand: `python ${file} < ${inputs} > ${output}`
            };
        case 'c':
            const exeFileCpp = file.replace('.cpp', '');
            return {
                compileCommand: `g++ ${file} -o ${exeFileCpp}`,
                executeCommand: `${exeFileCpp} < ${inputs} > ${output}`
            };
        case 'java':
            const classFile = file.replace('.java', '');
            return {
                compileCommand: `javac ${file}`,
                executeCommand: `java ${classFile} < ${inputs} > ${output}`
            };
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
}

// Função principal para executar os scripts e comparar os resultados
async function executeAndReturnContent(file1, inputs, language, professorDir) {
    const output1 = 'outputsProfessor';

    try {
        const { compileCommand: compileCommand1, executeCommand: executeCommand1 } = getExecutionCommands(file1, inputs, output1, language);
        
        // Compilar arquivo1
        if (compileCommand1) {
            execSync(`cd ${professorDir} && ${compileCommand1}`);
        }

        // Executar arquivo1 e arquivo2 com redirecionamento de entrada e saída
        execSync(`cd ${professorDir} && ${executeCommand1}`);

        const content1 = readFileContent(path.join(professorDir, output1));
        const inputProfessor = readFileContent(path.join(professorDir, inputs));
        const nomeQuestao = readFileContent(path.join(professorDir, file1));


        if (content1) {
            return { success: true, outputProfessor: content1, inputProfessor: inputProfessor, scriptProfessor: nomeQuestao};
        } else {
            return { 
                success: false, 
                message: "deu erro",
                content1
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
