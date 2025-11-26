
function renderFuncionariosAvaliacao() {
	const select = document.getElementById('lista-funcionarios');
	select.innerHTML = '';
	getFuncionarios().forEach(f => {
		select.innerHTML += `<option value="${f.id}">${f.nome} (${f.email || '-'})</option>`;
	});
}

function salvarAvaliacao() {
	const usuario = getUsuarioLogado();
	if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'gestor')) {
		alert('Apenas admin ou gestor podem registrar avaliações.');
		return;
	}
	const funcionarioId = document.getElementById('lista-funcionarios').value;
	const criterio = document.getElementById('avaliacaoCriterio').value;
	const nota = document.getElementById('avaliacaoNota').value;
	const comentario = document.getElementById('avaliacaoComentario').value;
	if (!funcionarioId || !criterio || !nota) return;
	registrarAvaliacaoCompleta({ funcionarioId, criterio, nota, comentario });
	limparAvaliacao();
	renderAvaliacoes();
}

function renderAvaliacoes() {
	const lista = document.getElementById('lista-avaliacoes');
	lista.innerHTML = '';
	const avaliacoes = getAvaliacoes().slice(-10).reverse();
	avaliacoes.forEach(a => {
		const f = consultarFuncionario(a.funcionarioId);
		lista.innerHTML += `<tr>
			<td>${f ? f.nome + ' (' + (f.email || '-') + ')' : '-'}</td>
			<td>${a.criterio}</td>
			<td>${a.nota}</td>
			<td>${a.comentario || ''}</td>
			<td>${new Date(a.data).toLocaleDateString()}</td>
		</tr>`;
	});
}

function limparAvaliacao() {
	document.getElementById('avaliacaoCriterio').value = '';
	document.getElementById('avaliacaoNota').value = '';
	document.getElementById('avaliacaoComentario').value = '';
}

window.onload = function() {
	renderFuncionariosAvaliacao();
	renderAvaliacoes();
};
