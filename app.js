const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload'); // Remova se não for usar o express-fileupload

const compareController = require('./control/compareController');
const compareProfessor = require('./control/compareProfessor');
const rota_conteudo = require('./control/rota_conteudo');

const mysql = require('mysql');

const rota_upload_foto = require('./control/rota_upload_foto.js');
const rota_comparador = require('./control/rota_comparador.js');
const rota_entrega = require('./control/rota_entrega');
const rota_aluno_disciplina = require('./control/rota_aluno_disciplina');
const rota_simulacao = require('./control/rota_simulacao');
const rota_conteudo_arquivo = require('./control/rota_conteudo_arquivo');
const rota_upload_copia = require('./control/rota_upload_copia');
const rota_delete_path = require('./control/rota_delete_path');
const rota_professor = require('./control/rota_professor');
const rota_aluno = require('./control/rota_aluno');
const rota_disciplina = require('./control/rota_disciplina');
const rota_atividade = require('./control/rota_atividade');
const rota_questao = require('./control/rota_questao');
const rota_entrada = require('./control/rota_entrada');

const app = express();

// Configuração do middleware para processamento de arquivos
app.use(fileUpload());
app.use(express.static('js'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'view')));

app.post('/compare', compareController);
app.post('/uploadProfessor', compareProfessor);
app.post('/conteudoProfessor', rota_conteudo);

var banco = mysql.createPool({
    connectionLimit: 128,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'colegiosunivap'
});

rota_upload_foto(app, banco);
rota_comparador(app, banco);
rota_entrega(app, banco);
rota_aluno_disciplina(app, banco);
rota_simulacao(app, banco);
rota_conteudo_arquivo(app, banco)
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
    console.log(`http://localhost:${PORT}/professor/home.html`);
    console.log(`http://localhost:${PORT}/professor/login.html`);
    console.log(`http://localhost:${PORT}/aluno/home.html`);
    console.log(`http://localhost:${PORT}/aluno/login.html`);
});
