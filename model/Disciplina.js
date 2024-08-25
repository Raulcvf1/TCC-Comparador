module.exports = class Disciplina {
  constructor(banco) {
    this.banco = banco;
    this.idDisciplina = null;
    this.nome = null;
    this.serie = null;
    this.ano = null;
    this.duplicado = null;
    this.linguagem = null;
    this.codigo_unico = null;
    this.Professor = {
        registro: null,
    };
  }

  async create() {
    // Gera um código único antes de inserir no banco de dados
    const code = await this.generateUniqueCode();
    this.setCode(code);

    const operacaoAssincrona = new Promise((resolve, reject) => {
      const nome = this.getNome();
      const serie = this.getSerie();
      const ano = this.getAno();
      const duplicado = this.getDuplicado();
      const linguagem = this.getLinguagem();
      const code = this.getCode();
      const professor = this.getProfessor();
      const professor_registro = professor.registro;

      const params = [nome, serie, ano, duplicado, linguagem, code, professor_registro];

      let sql = "INSERT INTO colegiosunivap.disciplina (nome, serie, ano, duplicado, linguagem, codigo_unico, Professor_registro) VALUES (?, ?, ?, ?, ?, ?, ?);";

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
      const id = this.getIdDisciplina();
      let params = [id];
      let SQL = "";
      if (id == null) {
        SQL = "SELECT idDisciplina, nome, ano, codigo_unico, Professor_registro FROM colegiosunivap.disciplina;";
      } else {
        SQL = "SELECT idDisciplina, nome, ano, codigo_unico, Professor_registro FROM colegiosunivap.disciplina WHERE idDisciplina = ?;";
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

  async update() {
    const operacaoAssincrona = new Promise((resolve, reject) => {
      const idDisciplina = this.getIdDisciplina();
      const nome = this.getNome();
      const serie = this.getSerie();
      const ano = this.getAno();
      const duplicado = this.getDuplicado();
      const linguagem = this.getLinguagem();
      const code = this.getCode();
      const professor = this.getProfessor();
      const professor_registro = professor.registro;

      const params = [nome, serie, ano, duplicado, linguagem, code, professor_registro, idDisciplina];

      let sql = "UPDATE colegiosunivap.disciplina SET nome = ?, serie = ?, ano = ?, duplicado = ?, linguagem = ?, codigo_unico = ?, Professor_registro = ? WHERE idDisciplina = ?;";

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
      const id = this.getIdDisciplina();
      let params = [id];

      let sql = "DELETE FROM colegiosunivap.disciplina WHERE idDisciplina = ?;";

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

  setNome(newNome) {
    this.nome = newNome;
  }
  getNome() {
    return this.nome;
  }

  setSerie(newSerie) {
    this.serie = newSerie;
  }
  getSerie() {
    return this.serie;
  }

  setAno(newAno) {
    this.ano = newAno;
  }
  getAno() {
    return this.ano;
  }

  setDuplicado(newDuplicado){
    this.duplicado = newDuplicado;
  }
  getDuplicado(){
    return this.duplicado;
  }

  setLinguagem(newLinguagem){
    this.linguagem = newLinguagem;
  }
  getLinguagem(){
    return this.linguagem;
  }

  setCode(newCode) {
    this.codigo_unico = newCode;
  }
  getCode() {
    return this.codigo_unico;
  }

  setProfessor(newProfessor) {
    this.Professor = newProfessor;
  }
  getProfessor() {
    return this.Professor;
  }
};
