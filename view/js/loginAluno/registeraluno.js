// registeraluno.js

const btnRegister = document.getElementById("btnRegisterAluno");
const txtNomeRegister = document.getElementById("txtNomeRegisterAluno");
const txtEmailRegister = document.getElementById("txtEmailRegisterAluno");
const txtMatriculaRegister = document.getElementById("txtMatriculaRegisterAluno");
const txtCpfRegister = document.getElementById("txtCpfRegisterAluno");
const txtSenhaRegister = document.getElementById("txtSenhaRegisterAluno");

// Vincula a função onclick_btnRegister() ao click do botão de registro
btnRegister.onclick = onclick_btnRegister;

// Função que trata o evento de click do botão
function onclick_btnRegister(event) {
  event.preventDefault(); // Previne o envio padrão do formulário

  // Recupera os valores digitados no formulário
  const v_matricula = txtMatriculaRegister.value;
  const v_cpf = txtCpfRegister.value;
  const v_nome = txtNomeRegister.value;
  const v_email = txtEmailRegister.value;
  const v_senha = txtSenhaRegister.value;

  // Função para validar CPF
  function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se o CPF possui 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i), 10) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);
    digito1 = digito1 >= 10 ? 0 : digito1;

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i), 10) * (11 - i);
    }
    let digito2 = 11 - (soma % 11);
    digito2 = digito2 >= 10 ? 0 : digito2;

    // Verifica se os dígitos verificadores estão corretos
    return cpf.charAt(9) == digito1 && cpf.charAt(10) == digito2;
  }

  // Verifica se o CPF é válido
  if (!validarCPF(v_cpf)) {
    alert("CPF inválido! Por favor, insira um CPF válido.");
    return; // Para a execução se o CPF não for válido
  }

  // Constrói um objeto JSON que será enviado na requisição
  const objJson = {
    matricula: v_matricula,
    cpf: v_cpf,
    nome: v_nome,
    email: v_email,
    senha: v_senha,
  };

  // Chama a função que enviará os dados para a API que verificará o login
  fetch_post_createAluno(objJson);
}

// Função assíncrona para criar o aluno
function fetch_post_createAluno(objJson) {
  // Converte o objeto recebido em um texto JSON
  const stringJson = JSON.stringify(objJson);

  // Determina a URI do serviço na API
  const uri = "/aluno";

  const requisicao_assincrona = fetch(uri, {
    method: "post",
    body: stringJson,
    headers: {
      Accept: "application/json", // Aceita JSON como resposta da API
      "Content-Type": "application/json", // Informa que irá enviar para a API conteúdo em JSON
      Authorization: "", // Não envia token porque ainda não está logado
    },
  });

  // Caso seja retornada uma resposta da API, ela será processada abaixo
  requisicao_assincrona
    .then((response) => response.text())
    .then((jsonResposta) => {
      // É executado quando a API "JS" responde.
      console.log("RECEBIDO:", jsonResposta);

      // Converte a resposta da API para um objeto JSON.
      const objetoJson = JSON.parse(jsonResposta);

      // Caso o status da resposta seja true entra no if
      if (objetoJson.status == true) {
        let stringJsonaluno = JSON.stringify(objetoJson.aluno);

        // Recupera o novo token e armazena no localStorage
        localStorage.setItem("token", objetoJson.token);

        // Recupera o JSON no formato: {"email":"","nome":"","registro":""}
        localStorage.setItem("jsonAluno", stringJsonaluno);

        // Redireciona para a página index.html
        window.location = "index.html";
      } else {
        // Caso o status da resposta não seja true
        // Escreve a mensagem que veio da API
        console.log(objetoJson.msg);
      }
    })
    .catch((error) => {
      // Caso aconteça algum erro, o catch é chamado e o erro é apresentado no console do navegador
      console.error("Error:", error);
    });
}
