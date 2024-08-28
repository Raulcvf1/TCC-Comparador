module.exports = class Disciplina {
    constructor(banco) {
      this.banco = banco;
      this.idAtividade = null;
      this.nome = null;
      this.status = null;
      this.Disciplina = {
        idDisciplina: null,
      };
    }
  
    async create() {  
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const nome = this.getNome();
        const status = this.getStatus();
        const disciplina = this.getDisciplina();
        const Disciplina_idDisciplina = disciplina.idDisciplina;
  
        let params = [nome, status, Disciplina_idDisciplina];
        let sql = "INSERT INTO colegiosunivap.atividade (nome, status, Disciplina_idDisciplina) VALUES (?, ?, ?);";

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
        const id = this.getIdAtividade();
        let params = [id];
        let SQL = "";
        if (id == null) {
          SQL = "SELECT nome, status FROM colegiosunivap.atividade;";
        } else {
          SQL = "SELECT nome, status FROM colegiosunivap.atividade WHERE idAtividade = ?;";
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
  
    
    async readAtividadeDisciplina() {
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const disciplina = this.getDisciplina();
        const Disciplina_idDisciplina = disciplina.idDisciplina;
  
        let params = [Disciplina_idDisciplina];
        
        let SQL = "SELECT idAtividade, nome, status FROM colegiosunivap.atividade WHERE Disciplina_idDisciplina = ?;";
  
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
    
    /*
    async readDisciplinaProfessor() {
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const professor = this.getProfessor();
        const professor_registro = professor.registro;
  
        let params = [professor_registro];
        
        let SQL = "SELECT nome, serie, ano, duplicado, linguagem, codigo_unico FROM colegiosunivap.disciplina WHERE Professor_registro = ?;";
  
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
  
    async readDisciplinaAluno() {
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const idDisciplina = this.getIdDisciplina();
  
        let params = [idDisciplina];
        
        let SQL = "SELECT ad.id_Aluno_matricula , a.matricula, a.rg, a.nome, a.email FROM Aluno a JOIN Aluno_Disciplina ad ON a.matricula = ad.Aluno_matricula WHERE ad.Disciplina_idDisciplina = ?;";
  
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
    */
  
    async update() {
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const idAtividade = this.getIdAtividade();
        const nome = this.getNome();
        const status = this.getStatus();
        const disciplina = this.getDisciplina();
        const Disciplina_idDisciplina = disciplina.idDisciplina;
  
        const params = [nome, status, Disciplina_idDisciplina, idAtividade];
  
        let sql = "UPDATE colegiosunivap.atividade SET nome = ?, status = ?, Disciplina_idDisciplina = ? WHERE idAtividade = ?;";
  
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
  
    async delete() {
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const id = this.getIdAtividade();
        let params = [id];
  
        let sql = "DELETE FROM colegiosunivap.atividade WHERE idAtividade = ?;";
  
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
  
    setIdAtividade(newIdAtividade) {
      this.idAtividade = newIdAtividade;
    }
    getIdAtividade() {
      return this.idAtividade;
    }
  
    setNome(newNome) {
      this.nome = newNome;
    }
    getNome() {
      return this.nome;
    }

    setStatus(newStatus){
      this.status = newStatus;
    }
    getStatus(){
      return this.status;
    }
  
    setDisciplina(newDisciplina) {
      this.Disciplina = newDisciplina;
    }
    getDisciplina() {
      return this.Disciplina;
    }
  };
  