const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload'); // Remova se não for usar o express-fileupload

const compareController = require('./control/compareController');
const compareProfessor = require('./control/compareProfessor');
const rota_simulacao = require('./control/rota_simulacao');
const rota_conteudo = require('./control/rota_conteudo');
const rota_upload_input = require('./control/rota_upload_input');
const rota_contar_arquivos = require('./control/rota_contar_arquivos');
const rota_conteudo_input = require('./control/rota_conteudo_input');

const mysql = require('mysql');

const rota_upload_copia = require('./control/rota_upload_copia');
const rota_delete_path = require('./control/rota_delete_path');
const rota_professor = require('./control/rota_professor');
const rota_aluno = require('./control/rota_aluno');
const rota_disciplina = require('./control/rota_disciplina');
const rota_atividade = require('./control/rota_atividade');
const rota_questao = require('./control/rota_questao');
const rota_entrada = require('./control/rota_entrada');

const app = express();

app.use(express.static('js'));
app.use(express.json());
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

rota_upload_copia(app, banco);
rota_delete_path(app, banco);
rota_professor(app, banco);
rota_aluno(app, banco);
rota_disciplina(app, banco);
rota_atividade(app, banco);
rota_questao(app, banco);
rota_entrada(app, banco);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
    console.log(`http://localhost:${PORT}/new/index.html`);
    console.log(`http://localhost:${PORT}/new/login.html`);
});
