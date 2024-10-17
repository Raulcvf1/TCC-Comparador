module.exports = class Entrega {
    constructor(banco) {
        this.banco = banco;
        this.idEntrega = null;
        this.nota = null;
        this.path_entrega = null;
        this.caixa = null;
        this.Questao = {
            idQuestao: null,
        };
        this.Aluno = {
            matricula: null,
        }
    }
  
    async create() {  
        const operacaoAssincrona = new Promise((resolve, reject) => {
            const path = this.getPath();
            const caixa = this.getCaixa();
            const questao = this.getQuestao();
            const Questao_idQuestao = questao.idQuestao;
            const aluno = this.getAluno();
            const Aluno_matricula = aluno.matricula;
    
            let params = [path, caixa, Questao_idQuestao, Aluno_matricula];
            let sql = "INSERT INTO colegiosunivap.entrega (path_entrega, caixa, Questao_idQuestao, Aluno_matricula) VALUES (?, ?, ?, ?);";

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
            const id = this.getIdEntrega();
            let params = [id];
            let SQL = "";
            if (id == null) {
                SQL = "SELECT idEntrega, path_entrega, caixa FROM colegiosunivap.entrega;";
            } else {
                SQL = "SELECT idEntrega, path_entrega, caixa FROM colegiosunivap.entrega WHERE idEntrega = ?;";
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

    async readNotaQuestao() {
      const operacaoAssincrona = new Promise((resolve, reject) => {
        const questao = this.getQuestao();
        const Questao_idQuestao = questao.idQuestao;
        const aluno = this.getAluno();
        const Aluno_matricula = aluno.matricula;

        let params = [Questao_idQuestao, Aluno_matricula];
        
        let SQL = "SELECT nota, path_entrega FROM colegiosunivap.entrega WHERE Questao_idQuestao = ? AND Aluno_matricula = ?;";

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
        const idEntrega = this.getIdEntrega();
        const nota = this.getNota();
        const path = this.getPath();
        const caixa = this.getCaixa();
        const questao = this.getQuestao();
        const Questao_idQuestao = questao.idQuestao;
        const aluno = this.getAluno();
        const Aluno_matricula = aluno.matricula;
  
        let params = [nota, path, caixa, Questao_idQuestao, Aluno_matricula, idEntrega];
  
        let sql = "UPDATE colegiosunivap.entrega SET nota = ?, path_entrega = ?, caixa = ?, Questao_idQuestao = ?, Aluno_matricula = ? WHERE idEntrega = ?;";
  
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
        const id = this.getIdEntrega();
        let params = [id];
  
        let sql = "DELETE FROM colegiosunivap.entrega WHERE idEntrega = ?;";
  
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

    setIdEntrega(newIdEntrega){
        this.idEntrega = newIdEntrega;
    }
    getIdEntrega(){
        return this.idEntrega;
    }

    setNota(newNota){
        this.nota = newNota;
    }
    getNota(){
        return this.nota;
    }

    setPath(newPath){
      this.path_entrega = newPath;
    }
    getPath(){
      return this.path_entrega;
    }
  
    setCaixa(newCaixa) {
      this.caixa = newCaixa;
    }
    getCaixa() {
      return this.caixa;
    }

    setQuestao(newQuestao){
        this.Questao = newQuestao;
    }
    getQuestao(){
        return this.Questao;
    }

    setAluno(newAluno){
        this.Aluno = newAluno;
    }
    getAluno(){
        return this.Aluno;
    }
  };
  