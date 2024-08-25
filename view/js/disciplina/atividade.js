document.getElementById('btnAtividade').addEventListener('click', async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const files = fileInput.files;
  const formData = new FormData();

  const txtNomeAtividade = document.getElementById("txtNomeAtividade");
  const v_nome = txtNomeAtividade.value;

  const professor = JSON.parse(localStorage.getItem("jsonProfessor"));
  var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));

  const objJson = {
    nome: v_nome,
    status: 0, // 0 = false | 1 = true
    quantidade_exercicios: files.length,
    Disciplina_idDisciplina: disciplina.idDisciplina,
    professor_registro: professor.registro
  };

  // Aguarde a execução da função e obtenha o ID retornado
  const idAtividade = await fetch_post_createDisciplina(objJson);

  // Continue com o resto do código após obter o ID
  for (let i = 0; i < files.length; i++) {
    const fileExt = files[i].name.split('.').pop(); // Pega a extensão do arquivo
    formData.append('files', files[i], `questao${i + 1}.${fileExt}`);
  }

  formData.append('registro', professor.registro);
  formData.append('idDisciplina', disciplina.idDisciplina); 
  formData.append('idAtividade', idAtividade); 

  try {
    const response = await fetch('/uploadProfessor', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      console.log('Arquivos enviados com sucesso');
      location.reload();
    } else {
      console.error('Erro ao enviar os arquivos');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
});

// Função assíncrona para validar login
async function fetch_post_createDisciplina(objJson) {
  // Converte o objeto recebido em um texto json
  const stringJson = JSON.stringify(objJson);

  // Determina a URI do serviço na API
  const uri = "/atividade";

  const token = localStorage.getItem("token");
  console.log(token);

  try {
    const response = await fetch(uri, {
      method: "post",
      body: stringJson,
      headers: {
        Accept: "application/json", // Aceita json como resposta da API
        "Content-Type": "application/json", // Informa que irá enviar para API conteúdo em json
        authorization: "bearer <" + token + ">", // Envia o token de autorização
      },
    });

    const jsonResposta = await response.text();
    // Mostra o conteúdo recebido da API no console do navegador
    console.log("RECEBIDO:", jsonResposta);

    // Converte a resposta da API para um objeto json
    const objetoJson = JSON.parse(jsonResposta);

    // Caso o status da resposta seja true, retorna o ID
    if (objetoJson.status == true) {
      console.log(objetoJson);
      return objetoJson.dados.id;
    } else {
      // Caso o status da resposta não seja true, escreve a mensagem que veio da API
      console.log(objetoJson.msg);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return null; // Retorna null se algo deu errado
}
