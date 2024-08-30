const btnExpandCode = document.getElementById('btnExpandCode');

btnExpandCode.onclick = onclick_btnExpandCode;

function onclick_btnExpandCode(){
    var disciplina = JSON.parse(localStorage.getItem("jsonDisciplina"));
    document.getElementById('lblCodeExpand').innerText = disciplina.codigoUnico;
}
