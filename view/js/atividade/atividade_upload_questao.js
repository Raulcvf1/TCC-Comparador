const btnQuestaoCreate = document.getElementById("btnQuestaoCreate");
const txtNomeQuestao = document.getElementById("txtNomeQuestao");
const formFile = document.getElementById("formFile");

btnQuestaoCreate.onclick = async function() {
  const professor = JSON.parse(localStorage.getItem("jsonProfessor"));
  const disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
  const atividade = JSON.parse(localStorage.getItem("jsonAtividade"));
  const v_nome = txtNomeQuestao.value;

  const customPath = `C:\\workspace tcc\\corretorFinalizado\\professor\\${professor.registro}\\${disciplina.idDisciplina}\\${atividade.idAtividade}\\${v_nome}`;

  // Cria um objeto JSON com o arquivo e o customPath
  const file = formFile.files[0];
  const data = {
    customPath: customPath,
    fileName: file.name,
    fileType: file.type,
    fileContent: await file.text() // Converte o arquivo para texto
  };

  try {
    const token = localStorage.getItem("token");

    const uploadResponse = await fetch('/upload', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        authorization: `bearer ${token}`,
      }
    });

    if (!uploadResponse.ok) {
      console.error("Erro ao fazer upload do arquivo");
      return;
    }

    const uploadResult = await uploadResponse.json();

    if (!uploadResult.status) {
      console.error("Erro ao fazer upload do arquivo");
      return;
    }

    const objJson = {
      nome: v_nome,
      path: uploadResult.filePath,
      Atividade_idAtividade: atividade.idAtividade
    };

    await fetch_post_createQuestao(objJson);

  } catch (error) {
    console.error("Erro durante o upload ou criação da questão:", error);
  }
};

async function fetch_post_createQuestao(objJson) {
  try {

    const token = localStorage.getItem("token");
    console.log(token);

    const response = await fetch('/questao', {
      method: "POST",
      body: JSON.stringify(objJson),
      headers: {
        Accept: "application/json", //Aceita json como resposta da api
        "Content-Type": "application/json", //Informa que irá enviar para api conteúdo em json
        authorization: "bearer <" + token + ">", //não envia token pq ainda não está logado
      }
    });

    const jsonResposta = await response.json();

    if (jsonResposta.status) {
      console.log("Questão criada com sucesso:", jsonResposta.dados);
      location.reload();
    } else {
      console.error("Erro ao criar questão:", jsonResposta.msg);
    }
  } catch (error) {
    console.error("Erro durante a criação da questão:", error);
  }
}
