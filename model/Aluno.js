var md5 = require('md5'); //npm install md5 --save  //https://www.npmjs.com/package/md5

module.exports = class Aluno {

    constructor(banco) {
        this.banco = banco;
        this.matricula = null;
        this.cpf=null;
        this.nome = null;
        this.email = null;
        this.senha = null;

    }

    async create() {
        const operacaoAssincrona = new Promise((resolve, reject) => {
            const matricula = this.getMatricula();
            const cpf = this.getCpf();
            const nome = this.getNome();
            const email = this.getEmail();
            const senha = md5(this.getSenha());
            

            const params = [matricula, cpf, nome, email, senha];

            let sql = "INSERT INTO aluno (matricula, cpf, nome, email, senha) VALUES (?, ?, ?, ?, ?);";

            this.banco.query(sql, params, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
        return operacaoAssincrona;
    }
    async read() {
        const operacaoAssincrona = new Promise((resolve, reject) => {

            const matricula = this.getMatricula();
            let params = [matricula];
            let SQL = "";
            if (matricula == null) {
                SQL = "SELECT matricula,cpf, nome, email FROM colegiosunivap.aluno;";
            } else {
                SQL = "SELECT matricula,cpf, nome, email FROM colegiosunivap.aluno WHERE matricula = ?;";
            }
            this.banco.query(SQL, params, function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {

                    resolve(result);
                }
            });
        });
        return operacaoAssincrona;
    }

    async update() {
        const operacaoAssincrona = new Promise((resolve, reject) => {
            const matricula = this.getMatricula();
            const cpf = this.getCpf();
            const nome = this.getNome();
            const email = this.getEmail();
            const senha = md5(this.getSenha());

            let parametros = [nome, email, senha, matricula];
            let sql = "update aluno set nome=?, email=?, senha=? where matricula = ?;";
            this.banco.query(sql, parametros, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
        return operacaoAssincrona;
    }

    async delete() {
        const operacaoAssincrona = new Promise((resolve, reject) => {
            const matricula = this.getMatricula();
            let parametros = [matricula];
            let sql = "delete from aluno where matricula = ?;";
            this.banco.query(sql, parametros, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
        return operacaoAssincrona;
    }

    async login() {
        const operacaoAssincrona = new Promise((resolve, reject) => {
            const email = this.getEmail();
            const senha = md5(this.getSenha());
            
            let parametros = [email, senha];
            let sql = "SELECT COUNT(*) AS qtd ,matricula,nome,email FROM aluno WHERE email =? AND senha =?";
            const result = this.banco.query(sql, parametros, (error, result) => {
                if (error) {
                    reject(error);
                } else {

                    if (result[0].qtd == 1) {
                        const resposta = {
                            status: true,
                            matricula: result[0].matricula,
                            nome: result[0].nome,
                            email: result[0].email
                        }
                        resolve(resposta);
                    } else {
                        const resposta = {
                            status: false,
                        }
                        resolve(resposta);
                    }

                }
            });
        });
        return operacaoAssincrona;
    }

    setMatricula(novoMatricula) {
        this.matricula = novoMatricula
    }
    getMatricula() {
        return this.matricula
    }
    setCpf(newCpf){
        this.cpf = newCpf
    }
    getCpf(){
        return this.cpf
    }
    setNome(name) {
        this.nome = name;
    }
    getNome() {
        return this.nome;
    }
    setEmail(email) {
        this.email = email;
    }
    getEmail() {
        return this.email;
    }
    setSenha(senha) {
        this.senha = senha;
    }
    getSenha() {
        return this.senha;
    }

}

