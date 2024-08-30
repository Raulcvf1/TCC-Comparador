const btnTrocarFoto = document.getElementById("btnTrocarFoto");
const formFile = document.getElementById("formFile");

btnTrocarFoto.onclick = async function() {
    const professor = JSON.parse(localStorage.getItem("jsonProfessor"));

    const customPath = `C:\\workspace tcc\\corretorFinalizado\\foto_professor`;
    const file = formFile.files[0];

    if (!file) {
        console.error("Nenhum arquivo selecionado.");
        return;
    }

    const formData = new FormData();
    formData.append('customPath', customPath);
    formData.append('file', file);

    try {
        const token = localStorage.getItem("token");

        const uploadResponse = await fetch('/uploadFoto', {
            method: 'POST',
            body: formData,
            headers: {
                authorization: `bearer ${token}`,
            }
        });

        if (!uploadResponse.ok) {
            throw new Error("Erro ao fazer upload do arquivo");
        }

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.status) {
            throw new Error("Erro ao fazer upload do arquivo");
        }

        console.log("Foto do professor obtida com sucesso:", uploadResult.filePath);

    } catch (error) {
        console.error("Erro durante o upload ou criação da questão:", error);
    }
};

async function fetch_post_createQuestao(objJson, id) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch('/professor/' + id, {
            method: "PUT",
            body: JSON.stringify(objJson),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
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
