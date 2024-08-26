const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const compareController = require('./control/compareController');
const compareProfessor = require('./control/compareProfessor');
const rota_simulacao = require('./control/rota_simulacao');
const rota_conteudo = require('./control/rota_conteudo');
const rota_upload_input = require('./control/rota_upload_input');
const rota_contar_arquivos = require('./control/rota_contar_arquivos')
const rota_conteudo_input = require('./control/rota_conteudo_input');

console.loq();

//importa o driver do mysql
const mysql = require('mysql');

const rota_professor = require('./control/rota_professor');  //module you want to include
const rota_aluno = require('./control/rota_aluno');
const rota_disciplina = require('./control/rota_disciplina');
const rota_atividade = require('./control/rota_atividade');

const app = express();

//O express permite que sejam enviados arquivos. js para o front-end
app.use(express.static('js'));

//quando for enviado um texto json no corpo da requisição o expresse irá transformar isso em um objeto json
//em request.body, ou seja request.body é um objeto json contendo o texto json recebido no corpo da requisição.
app.use(express.json())

app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'view')));

app.post('/compare', compareController);
app.post('/uploadProfessor', compareProfessor);
app.post('/simulacaoProfessor', rota_simulacao);
app.post('/conteudoProfessor', rota_conteudo);
app.post('/uploadInput', rota_upload_input);
app.post('/contarArquivos', rota_contar_arquivos);
app.post('/conteudoInput', rota_conteudo_input);

var banco = mysql.createPool({
    connectionLimit: 128,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'colegiosunivap'
});
  
//configuração de conexão com o banco de dados
rota_professor(app, banco);
rota_aluno(app, banco);
rota_disciplina(app, banco);
rota_atividade(app, banco);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}/`)
    console.log(`http://localhost:${PORT}/new/index.html`)
    console.log(`http://localhost:${PORT}/new/login.html`)
    console.log(`http://localhost:${PORT}/login.html`)
    console.log(`http://localhost:${PORT}/loginAluno.html`)
});
