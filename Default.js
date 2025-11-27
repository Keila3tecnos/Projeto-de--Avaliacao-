function mostrarDashboard() {
	const usuario = getUsuarioLogado();
	// Totais
	document.getElementById('count-funcionarios').textContent = getFuncionarios().length;
	document.getElementById('count-avaliacoes').textContent = getAvaliacoes().length;

	// Médias por critério
	const avaliacoes = getAvaliacoes();
	const criterios = {};
	avaliacoes.forEach(a => {
		if (!criterios[a.criterio]) criterios[a.criterio] = [];
		criterios[a.criterio].push(Number(a.nota));
	});
	const mediasBody = document.getElementById('medias-criterios');
	mediasBody.innerHTML = '';
	Object.keys(criterios).forEach(c => {
		const notas = criterios[c];
		const media = notas.length ? (notas.reduce((a,b)=>a+b,0)/notas.length).toFixed(2) : '-';
		mediasBody.innerHTML += `<tr><td>${c}</td><td>${media}</td></tr>`;
	});

	// Destaques (funcionários com média >= 8)
	const funcionarios = getFuncionarios();
	const destaques = [];
	funcionarios.forEach(f => {
		const avs = avaliacoes.filter(a => a.funcionarioId === f.id);
		if (avs.length) {
			const media = avs.reduce((a,b)=>a+Number(b.nota),0)/avs.length;
			if (media >= 8) destaques.push(`${f.nome} (${media.toFixed(2)})`);
		}
	});
	const ul = document.getElementById('destaques');
	ul.innerHTML = destaques.length ? destaques.map(d=>`<li>${d}</li>`).join('') : '<li>Nenhum destaque no momento.</li>';

	// Exibe relatórios apenas para admin e gestor
	const relatorioDiv = document.getElementById('relatorio-individual');
	const relatorioGeralDiv = document.getElementById('relatorio-geral');
	const relatorioFuncionarioSelect = document.getElementById('relatorioFuncionario');
	if (usuario && (usuario.tipo === 'admin' || usuario.tipo === 'gestor')) {
		if (relatorioDiv) relatorioDiv.style.display = '';
		if (relatorioGeralDiv) relatorioGeralDiv.style.display = '';
		if (relatorioFuncionarioSelect) relatorioFuncionarioSelect.style.display = '';
	} else {
		if (relatorioDiv) relatorioDiv.style.display = 'none';
		if (relatorioGeralDiv) relatorioGeralDiv.style.display = 'none';
		if (relatorioFuncionarioSelect) relatorioFuncionarioSelect.style.display = 'none';
	}
}

function mostrarRelatorioFuncionario() {
	const usuario = getUsuarioLogado();
	if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'gestor')) return;
	const id = document.getElementById('relatorioFuncionario').value;
	const div = document.getElementById('relatorio-individual');
	if (!id) { div.innerHTML = ''; return; }
	const f = consultarFuncionario(id);
	if (!f) { div.innerHTML = 'Funcionário não encontrado.'; return; }
	const avs = getAvaliacoesFuncionario(id);
	let html = `<h4>${f.nome} (${f.setor})</h4>`;
	if (!avs.length) { html += '<p>Nenhuma avaliação registrada.</p>'; }
	else {
		html += '<ul>' + avs.map(a=>`<li><b>${a.criterio}</b>: Nota ${a.nota} (${a.comentario||''})</li>`).join('') + '</ul>';
		const media = (avs.reduce((a,b)=>a+Number(b.nota),0)/avs.length).toFixed(2);
		html += `<p><b>Média:</b> ${media}</p>`;
	}
	div.innerHTML = html;
}

function mostrarRelatorioGeral() {
	const usuario = getUsuarioLogado();
	if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'gestor')) return;
	const avs = getAvaliacoes();
	if (!avs.length) { document.getElementById('relatorio-geral').innerHTML = 'Nenhuma avaliação registrada.'; return; }
	const funcionarios = getFuncionarios();
	let html = '<table style="width:100%"><tr><th>Funcionário</th><th>Qtd</th><th>Média</th></tr>';
	funcionarios.forEach(f => {
		const fa = avs.filter(a=>a.funcionarioId===f.id);
		if (fa.length) {
			const media = (fa.reduce((a,b)=>a+Number(b.nota),0)/fa.length).toFixed(2);
			html += `<tr><td>${f.nome}</td><td>${fa.length}</td><td>${media}</td></tr>`;
		}
	});
	html += '</table>';
	document.getElementById('relatorio-geral').innerHTML = html;
}

function preencherSelectRelatorio() {
	const usuario = getUsuarioLogado();
	if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'gestor')) return;
	const select = document.getElementById('relatorioFuncionario');
	select.innerHTML = '<option value="">Selecione</option>';
	getFuncionarios().forEach(f => {
		select.innerHTML += `<option value="${f.id}">${f.nome}</option>`;
	});
}

window.onload = function() {
	mostrarDashboard();
	preencherSelectRelatorio();
	mostrarRelatorioGeral();
};