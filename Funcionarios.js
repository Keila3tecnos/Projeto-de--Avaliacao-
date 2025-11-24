function registrarFuncionario() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;

  const funcionariosExistentes = JSON.parse(
    localStorage.getItem("funcionarios")
  );
  const funcionarios = funcionariosExistentes || [];
  const funcionario = { nome, email };

  localStorage.setItem(
    "funcionarios",
    JSON.stringify([...funcionarios, funcionario])
  );

  mostrarFuncionarios();
  limparFuncionario();
}

function limparFuncionario() {
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
}

function mostrarFuncionarios() {
  const funcionariosExistentes =
    JSON.parse(localStorage.getItem("funcionarios")) || [];
  const tabelaBody = document.querySelector("#funcionarios tbody");
  let html = "";
  for (let i = 0; i < funcionariosExistentes.length; i++) {
    const funcionario = funcionariosExistentes[i];
    const row = `<tr><td><input id='chk_${funcionario.email}' type='checkbox'/></td><td>${funcionario.nome}</td><td>${funcionario.email}</td></tr>`;
    html += row;
  }

  tabelaBody.innerHTML = html;
}

function removerFuncionarios() {
  const funcionariosExistentes =
    JSON.parse(localStorage.getItem("funcionarios")) || [];
  const tabelaBody = document.querySelector("#funcionarios tbody");
  const inputs = tabelaBody.getElementsByTagName("input");

  let selecionado = false;
  for (let i = inputs.length - 1; i >= 0; i--) {
    const input = inputs[i];
    if (input.checked) {
      selecionado = true;
      const email = input.id.substring(4);
      const index = funcionariosExistentes.findIndex((f) => f.email === email);
      if (index !== -1) {
        funcionariosExistentes.splice(index, 1);
      }
    }
  }

  if (!selecionado) {
    alert("Selecione ao menos um funcionário para remover.");
    return;
  }

  localStorage.setItem("funcionarios", JSON.stringify(funcionariosExistentes));
  mostrarFuncionarios();
}

window.onload = function () {
  mostrarFuncionarios();
};
