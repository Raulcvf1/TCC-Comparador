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

// Função para comparar conteúdos
function compareContents(content1, content2) {
    return content1 === content2;
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

// Função para limpar todos os arquivos da pasta uploads
function cleanUploadsFolder() {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    try {
        const files = fs.readdirSync(uploadsDir);
        files.forEach(file => {
            const filePath = path.join(uploadsDir, file);
            fs.unlinkSync(filePath);
            console.log(`Deleted ${file}`);
        });
        console.log('Uploads folder cleaned.');
    } catch (err) {
        console.error('Error cleaning uploads folder:', err);
    }
}

// Função principal para executar os scripts e comparar os resultados
async function executeAndCompare(file1, file2, inputs, language) {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const output1 = 'outputsProfessor';
    const output2 = 'outputsAluno';
    const filePath1 = path.join(uploadsDir, file1);
    const filePath2 = path.join(uploadsDir, file2);
    const inputsPath = path.join(uploadsDir, inputs);

    try {
        const { compileCommand: compileCommand1, executeCommand: executeCommand1 } = getExecutionCommands(file1, inputs, output1, language);
        const { compileCommand: compileCommand2, executeCommand: executeCommand2 } = getExecutionCommands(file2, inputs, output2, language);
        
        // Compilar arquivo1
        if (compileCommand1) {
            execSync(`cd ${uploadsDir} && ${compileCommand1}`);
        }

        // Compilar arquivo2
        if (compileCommand2) {
            execSync(`cd ${uploadsDir} && ${compileCommand2}`);
        }

        // Executar arquivo1 e arquivo2 com redirecionamento de entrada e saída
        execSync(`cd ${uploadsDir} && ${executeCommand1}`);
        execSync(`cd ${uploadsDir} && ${executeCommand2}`);

        const content1 = readFileContent(path.join(uploadsDir, output1));
        const content2 = readFileContent(path.join(uploadsDir, output2));

        if (compareContents(content1, content2)) {
            return { success: true, message: "Os arquivos são idênticos." };
        } else {
            return { 
                success: false, 
                message: "Os arquivos são diferentes.",
                content1,
                content2
            };
        }
    } catch (err) {
        return { success: false, message: err.message };
    } finally {
        //cleanUploadsFolder(); // Limpar a pasta uploads após a execução
    }
}

module.exports = {
    executeAndCompare
};
