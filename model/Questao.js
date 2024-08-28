module.exports = class Questao {
    constructor(banco) {
      this.banco = banco;
      this.idQuestao = null;
      this.nome = null;
      this.paht_questao = null;
      this.Atividade = {
        idAtividade: null,
      };
    }
  
    async create() {  
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const nome = this.getNome();
        const path = this.getPath();
        const atividade = this.getAtividade();
        const Atividade_idAtividade = atividade.idAtividade;
  
        let params = [nome, path, Atividade_idAtividade];
        let sql = "INSERT INTO colegiosunivap.questao (nome, path_questao, Atividade_idAtividade) VALUES (?, ?, ?);";

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
        const id = this.getIdQuestao();
        let params = [id];
        let SQL = "";
        if (id == null) {
          SQL = "SELECT nome, path_questao FROM colegiosunivap.questao;";
        } else {
          SQL = "SELECT nome, path_questao FROM colegiosunivap.questao WHERE idQuestao = ?;";
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

    async readQuestaoAtividade() {
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const id = this.getIdQuestao();
        let params = [id];
        let SQL = "SELECT idQuestao, nome, path_questao FROM colegiosunivap.questao WHERE Atividade_idAtividade = ?;";

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
        const idQuestao = this.getIdQuestao();
        const nome = this.getNome();
        const path = this.getPath();
        const atividade = this.getAtividade();
        const Atividade_idAtividade = atividade.idAtividade;
  
        const params = [nome, path, Atividade_idAtividade, idQuestao];
  
        let sql = "UPDATE colegiosunivap.questao SET nome = ?, path_questao = ?, Atividade_idAtividade = ? WHERE idQuestao = ?;";
  
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
        const id = this.getIdQuestao();
        let params = [id];
  
        let sql = "DELETE FROM colegiosunivap.questao WHERE idQuestao = ?;";
  
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
  
    setIdQuestao(newIdQuestao) {
      this.idQuestao = newIdQuestao;
    }
    getIdQuestao() {
      return this.idQuestao;
    }
  
    setNome(newNome) {
      this.nome = newNome;
    }
    getNome() {
      return this.nome;
    }

    setPath(newPath){
      this.paht_questao = newPath;
    }
    getPath(){
      return this.paht_questao;
    }
  
    setAtividade(newAtividade) {
      this.Atividade = newAtividade;
    }
    getAtividade() {
      return this.Atividade;
    }
  };
  