document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file1', document.getElementById('file1').files[0]);
    formData.append('file2', document.getElementById('file2').files[0]);
    formData.append('inputs', document.getElementById('inputs').files[0]);

    const response = await fetch('/compare', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    let table = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">Resultado</th>
                    <th scope="col">Mensagem</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${result.success ? 'Sucesso' : 'Falha'}</td>
                    <td>${result.message}</td>
                </tr>
            </tbody>
        </table>
    `;

    if (!result.success && result.content1 && result.content2) {
        table += `
            <h3>Conteúdo dos Arquivos</h3>
            <div>
                <h4>Arquivo 1 (Professor)</h4>
                <pre>${result.content1}</pre>
            </div>
            <div>
                <h4>Arquivo 2 (Aluno)</h4>
                <pre>${result.content2}</pre>
            </div>
        `;
    }

    document.getElementById('result').innerHTML = table;
});
