module.exports = class Entrada {
    constructor(banco) {
      this.banco = banco;
      this.idEntrada = null;
      this.paht_entrada = null;
      this.Questao = {
        idQuestao: null,
      };
    }
  
    async create() {  
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const path = this.getPath();
        const questao = this.getQuestao();
        const Questao_idQuestao = questao.idQuestao;
  
        let params = [path, Questao_idQuestao];
        let sql = "INSERT INTO colegiosunivap.entrada (path_entrada, Questao_idQuestao) VALUES (?, ?);";

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
          SQL = "SELECT path_entrada FROM colegiosunivap.entrada;";
        } else {
          SQL = "SELECT path_entrada FROM colegiosunivap.entrada WHERE idEntrada = ?;";
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

    async readEntradaQuestao() {
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const questao = this.getQuestao();
        const Questao_idQuestao = questao.idQuestao;
        let params = [Questao_idQuestao];
        let SQL = "SELECT idEntrada, path_entrada FROM colegiosunivap.entrada WHERE Questao_idQuestao = ?;";

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
        const path = this.getPath();
        const questao = this.getQuestao();
        const Questao_idQuestao = questao.idQuestao;
  
        const params = [path, Questao_idQuestao, idEntrada];
  
        let sql = "UPDATE colegiosunivap.entrada SET path_entrada = ?, Questao_idQuestao = ? WHERE idEntrada = ?;";
  
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
  