module.exports = class Disciplina {
  constructor(banco) {
    this.banco = banco;
    this.id = null;
    this.idDisciplina = null;
    this.aluno = {
        matricula: null,
    };
    this.code =null;

  }

  async create() {
    // Gera um código único antes de inserir no banco de dados
    const code = await this.generateUniqueCode();
    this.setCode(code);

    const operacaoAssincrona = new Promise((resolve, reject) => {
      const aluno = this.getAluno();
      const matricula = aluno.matricula;
      const id = this.getId();
      const disciplinaid = this.getIdDisciplina();
   
      const params = [id, matricula, disciplinaid];

      let sql = "INSERT INTO colegiosunivap.aluno_disciplina (id_Aluno_matricula, Aluno_matricula, Disciplina_idDisciplina) VALUES (?, ?, ?);";

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
      const id = this.getId();
      let params = [id];
      let SQL = "";
      if (id == null) {
        SQL = "SELECT id_Aluno_matricula, Aluno_matricula, Disciplina_idDisciplina FROM colegiosunivap.aluno_disciplina;";
      } else {
        SQL = "SELECT id_Aluno_matricula, Aluno_matricula, Disciplina_idDisciplina FROM colegiosunivap.aluno_disciplina WHERE id_Aluno_matricula = ?;";
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

  async readCodeUnicoDisciplina() {
    const operacaoAssincrona = new Promise((resolve, reject) => {
      const code = this.getCode();

      let params = [code];
      
      let SQL = "SELECT idDisciplina FROM colegiosunivap.disciplina WHERE codigo_unico = ?;";

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

  async readCodigoUnico() {
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const codigo= this.getCode();
  
        let params = [codigo];
        
        let SQL = "SELECT idDisciplina FROM colegiosunivap.disciplina  WHERE codigo_unico = ?;";
  
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
      const aluno = this.getAluno();
      const matricula = aluno.matricula;
      const id = this.getId();
      const disciplinaid = this.getIdDisciplina();
   
      const params = [id, matricula, disciplinaid, id];

      let sql = "UPDATE colegiosunivap.aluno_disciplina SET id_Aluno_matricula = ?, Aluno_matricula = ?, Disciplina_idDisciplina = ? WHERE id_Aluno_matricula = ?;";

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
      const id = this.getId();
      let params = [id];

      let sql = "DELETE FROM colegiosunivap.aluno_disciplina WHERE id_Aluno_matricula = ?;";

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

  // Função para verificar a existência da chave no banco de dados
  async checkKeyInDatabase(key) {
    const operacaoAssincrona = new Promise((resolve, reject) => {
      let sql = "SELECT COUNT(*) AS qtd FROM colegiosunivap.disciplina WHERE codigo_unico = ?;";
      this.banco.query(sql, [key], function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result[0].qtd > 0);
        }
      });
    });
    return operacaoAssincrona;
  }

  // Função para gerar um código único
  async generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8;
    let code = '';

    // Gerar código alfanumérico
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    // Verificar se o código já existe no banco de dados
    const existsInDatabase = await this.checkKeyInDatabase(code);
    if (existsInDatabase) {
      // Se o código já existe, gerar um novo
      return this.generateUniqueCode();
    }

    // Retornar o código único
    return code;
  }

  setIdDisciplina(newIdDisciplina) {
    this.idDisciplina = newIdDisciplina;
  }
  getIdDisciplina() {
    return this.idDisciplina;
  }

  setId(newId){
   this.id=Id;
  }
  getId(){
      return this.id;
  }

  setAluno(newAluno) {
    this.aluno = newAluno;
  }
  getAluno() {
    return this.aluno;
  }
  setCode(newCode){
      this.code = newCode;
  }
  getCode(){
      return this.code;
  }
};
