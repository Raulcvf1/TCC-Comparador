let pieChart1 = null;
let pieChart2 = null;
let barChart = null;

document.getElementById('btnOpenGrafico').addEventListener('click', () => {
    var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
    const uri = "/disciplina/percentual/" + disciplina.idDisciplina;
    const token = localStorage.getItem("token");

    fetch(uri, {
        method: "get",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "bearer <" + token + ">",
        },
    })
    .then((response) => response.json())
    .then((jsonResposta) => {
        if (jsonResposta.status === true) {
            const atividades = jsonResposta.dados;
            const totalAcertos = atividades.reduce((sum, atividade) => sum + atividade.media_acertos, 0);
            const totalErros = atividades.reduce((sum, atividade) => sum + atividade.media_erros, 0);

            const dataPie1 = {
                labels: ['Acertos', 'Erros'],
                datasets: [{
                    data: [totalAcertos, totalErros],
                    backgroundColor: ['#36a2eb', '#ff6384'],
                }]
            };

            const configPie1 = {
                type: 'pie',
                data: dataPie1,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    }
                }
            };

            // Destruir gráfico anterior, se existir
            if (pieChart1) pieChart1.destroy();

            const ctxPie1 = document.getElementById('graficoPie1').getContext('2d');
            pieChart1 = new Chart(ctxPie1, configPie1);
        } else {
            console.log(jsonResposta.msg);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});

document.getElementById('btnGrafico').addEventListener('click', () => {
    
    const atividadeId = document.getElementById('comboBoxAtividade_grafico').value;

    if (atividadeId != "false"){
        const uri = "/disciplina/percentual/atividade/" + atividadeId;
        const token = localStorage.getItem("token");
    
        fetch(uri, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "bearer <" + token + ">",
            },
        })
        .then((response) => response.json())
        .then((jsonResposta) => {
            if (jsonResposta.status === true) {
                const atividade = jsonResposta.dados[0];
                const dataPie2 = {
                    labels: ['Acertos', 'Erros'],
                    datasets: [{
                        data: [atividade.taxa_acertos, atividade.taxa_erros],
                        backgroundColor: ['#36a2eb', '#ff6384'],
                    }]
                };
    
                const configPie2 = {
                    type: 'pie',
                    data: dataPie2,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                        }
                    }
                };
    
                // Destruir gráfico anterior, se existir
                if (pieChart2) pieChart2.destroy();
    
                document.getElementById("pie2").innerText = "Percentual de acertos e erros na Atividade";
                const ctxPie2 = document.getElementById('graficoPie2').getContext('2d');
                pieChart2 = new Chart(ctxPie2, configPie2);
            } else {
                console.log(jsonResposta.msg);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    
        fetch(`/disciplina/percentual/questao/${atividadeId}`, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "bearer <" + token + ">",
            },
        })
        .then((response) => response.json())
        .then((jsonResposta) => {
            if (jsonResposta.status === true) {
                const questoes = jsonResposta.dados;
    
                // Extrair labels e dados para o gráfico de barras
                const labels = questoes.map(q => q.nome_questao);
                const acertos = questoes.map(q => q.taxa_acertos);
                const erros = questoes.map(q => q.taxa_erros);
    
                const dataBar = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Percentual de Acertos',
                            data: acertos,
                            backgroundColor: '#4bc0c0',
                        },
                        {
                            label: 'Percentual de Erros',
                            data: erros,
                            backgroundColor: '#ff6384',
                        }
                    ]
                };
    
                const configBar = {
                    type: 'bar',
                    data: dataBar,
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100 // Limitar o máximo a 100%
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                        }
                    }
                };
    
                // Destruir gráfico anterior, se existir
                if (barChart) barChart.destroy();
    
                document.getElementById("bar1").innerText = "Percentual de acertos e erros em cada questão da Atividade";
                const ctxBar = document.getElementById('graficoBarra').getContext('2d');
                barChart = new Chart(ctxBar, configBar);
            } else {
                console.log(jsonResposta.msg);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    } else {
        document.getElementById("pie2").innerText = "";
        document.getElementById("bar1").innerText = "";

        pieChart2.destroy();
        barChart.destroy();
    }
});
