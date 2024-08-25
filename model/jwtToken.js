const _jwt = require('jsonwebtoken'); // npm install jsonwebtoken --save        https://www.npmjs.com/package/jsonwebtoken
module.exports = class JwtToken {
  Jsonwebtoken = _jwt;
  JWT_KEY = "09ac8db5a84d6cfd979521700cb600fa";
  JWT_DURACAO = 60 * 60 * 24;

  constructor() {}

  gerarToken(payload) {
    const novoToken = this.Jsonwebtoken.sign(
      { data: payload },
      this.JWT_KEY,
      { expiresIn: this.JWT_DURACAO }
    );
    return novoToken;
  }

  validarToken(token) {
    const retorno = {
      status: false,
      dados: null
    };

    if (!token || token.trim() === "") {
      return retorno;
    }

    let TokenArray = token.split(" ");
    if (TokenArray.length < 2) {
      return retorno;
    }

    token = TokenArray[1];
    token = token.replace("<", "").replace(">", "");
    
    try {
      var decoded = this.Jsonwebtoken.verify(token, this.JWT_KEY);
      retorno.status = true;
      retorno.dados = decoded;
    } catch (err) {
      console.error('Erro ao verificar o token:', err);
    }

    return retorno;
  }
}
