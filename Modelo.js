// ------------------------
// BANCO DE DADOS LOCAL
// ------------------------
let funcionarios = JSON.parse(localStorage.getItem("funcionarios") || "[]");
let avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");

// ------------------------
// ATUALIZAR TABELAS E SELECTS
// ------------------------
function atualizarInterface() {

    // Contadores
    document.getElementById("countFuncionarios").textContent = funcionarios.length;
    document.getElementById("countAvaliacoes").textContent = avaliacoes.length;

    // Tabela
    const tbody = document.querySelector("#tabelaFuncionarios tbody");
    tbody.innerHTML = "";
    funcionarios.forEach((f, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${f.nome}</td>
                <td>${f.setor}</td>
            </tr>
        `;
    });

    // Select Funcionários
    const sel = document.getElementById("avaliacaoFuncionario");
    sel.innerHTML = "";
    funcionarios.forEach(f => {
        sel.innerHTML += `<option>${f.nome}</option>`;
    });

    atualizarGrafico();
}

// ------------------------
// ADICIONAR FUNCIONÁRIO
// ------------------------
function adicionarFuncionario() {
    const nome = document.getElementById("nomeFuncionario").value;
    const setor = document.getElementById("setorFuncionario").value;

    if (!nome || !setor) {
        alert("Preencha os campos");
        return;
    }

    funcionarios.push({ nome, setor });
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

    document.getElementById("nomeFuncionario").value = "";
    document.getElementById("setorFuncionario").value = "";

    atualizarInterface();
}

// ------------------------
// REGISTRAR AVALIAÇÃO
// ------------------------
function registrarAvaliacao() {
    const funcionario = document.getElementById("avaliacaoFuncionario").value;
    const criterio = document.getElementById("avaliacaoCriterio").value;
    const nota = Number(document.getElementById("avaliacaoNota").value);

    if (!nota) {
        alert("Informe uma nota");
        return;
    }

    avaliacoes.push({ funcionario, criterio, nota, data: Date.now() });
    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));

    atualizarInterface();
}

// ------------------------
// GRÁFICO
// ------------------------
let grafico;
function atualizarGrafico() {

    const criterios = ["Pontualidade", "Produtividade", "Postura", "Agilidade"];
    const medias = [];

    criterios.forEach(c => {
        const notas = avaliacoes.filter(a => a.criterio === c).map(a => a.nota);
        const media = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
        medias.push(media.toFixed(2));
    });

    if (grafico) grafico.destroy();

    grafico = new Chart(document.getElementById("grafico"), {
        type: "bar",
        data: {
            labels: criterios,
            datasets: [{
                label: "Média",
                data: medias
            }]
        },
        options: { responsive: true }
    });
}

// Inicializa tudo ao carregar
atualizarInterface();
