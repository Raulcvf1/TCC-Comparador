module.exports = class Entrada {
    constructor(banco) {
      this.banco = banco;
      this.idEntrada = null;
      this.nome = null;
      this.paht_entrada = null;
      this.Questao = {
        idQuestao: null,
      };
    }
  
    async create() {  
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const nome = this.getNome();
        const path = this.getPath();
        const questao = this.getQuestao();
        const Questao_idQuestao = questao.idQuestao;
  
        let params = [nome, path, Questao_idQuestao];
        let sql = "INSERT INTO colegiosunivap.entrada (nome, path_entrada, Questao_idQuestao) VALUES (?, ?, ?);";

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
        const id = this.getIdEntrada();
        let params = [id];
        let SQL = "";
        if (id == null) {
          SQL = "SELECT nome, path_entrada FROM colegiosunivap.entrada;";
        } else {
          SQL = "SELECT nome, path_entrada FROM colegiosunivap.entrada WHERE idEntrada = ?;";
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
        const idEntrada = this.getIdEntrada();
        const nome = this.getNome();
        const path = this.getPath();
        const questao = this.getQuestao();
        const Questao_idQuestao = questao.idQuestao;
  
        const params = [nome, path, Questao_idQuestao, idEntrada];
  
        let sql = "UPDATE colegiosunivap.entrada SET nome = ?, path_entrada = ?, Questao_idQuestao = ? WHERE idEntrada = ?;";
  
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
        const id = this.getIdEntrada();
        let params = [id];
  
        let sql = "DELETE FROM colegiosunivap.entrada WHERE idEntrada = ?;";
  
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
  
    setIdEntrada(newIdEntrada) {
      this.idQuestao = newIdEntrada;
    }
    getIdEntrada() {
      return this.idEntrada;
    }
  
    setNome(newNome) {
      this.nome = newNome;
    }
    getNome() {
      return this.nome;
    }

    setPath(newPath){
      this.paht_entrada = newPath;
    }
    getPath(){
      return this.paht_entrada;
    }
  
    setQuestao(newQuestao) {
      this.Questao = newQuestao;
    }
    getQuestao() {
      return this.Questao;
    }
  };
  