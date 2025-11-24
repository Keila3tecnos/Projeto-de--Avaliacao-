function registrarAvaliacao() {
  const funcionario = document.getElementById("lista-funcionarios").value;
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

function carregarFuncionarios() {
  const listaFuncionarios = document.getElementById("lista-funcionarios");
  listaFuncionarios.innerHTML = "";
  funcionarios.forEach((funcionario) => {
    const option = document.createElement("option");
    option.value = funcionario.id;
    option.textContent = funcionario.nome;
    listaFuncionarios.appendChild(option);
  });
}

function atualizarInterface() {
  const totalFuncionarios = document.querySelector(".big");
  totalFuncionarios.textContent = funcionarios.length;

  const totalAvaliacoes = document.getElementById("avaliacoes-cont");
  totalAvaliacoes.textContent = avaliacoes.length;
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarInterface();
  carregarFuncionarios();
});
