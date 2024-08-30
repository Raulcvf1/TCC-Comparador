document.getElementById('btnUploadInput').addEventListener('click', async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const files = fileInput.files;
  const formData = new FormData();

  const professor = JSON.parse(localStorage.getItem("jsonProfessor"));
  const disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
  const atividade = JSON.parse(localStorage.getItem("jsonAtividade"));
  
  // Mude aqui para remover o JSON.parse
  const questao = localStorage.getItem("nomeQuestao");  // Agora é tratado como string

  // Adiciona os arquivos ao FormData, mas com o nome da questão
  for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], `${questao}`);
  }

  formData.append('registro', professor.registro);
  formData.append('idDisciplina', disciplina.idDisciplina);
  formData.append('idAtividade', atividade.idAtividade);

  try {
      const response = await fetch('/uploadInput', {
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
