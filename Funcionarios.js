function renderFuncionarios() {
	const lista = document.getElementById('lista-funcionarios');
	lista.innerHTML = '';
	const funcionarios = getFuncionarios();
	const usuario = getUsuarioLogado();
	funcionarios.forEach(f => {
		lista.innerHTML += `<tr>
			<td>${f.nome}</td>
			<td>${f.email || '-'}</td>
			<td>${f.setor}</td>
			<td>${f.tipo || 'comum'}</td>
			<td>
				${usuario && usuario.tipo === 'admin' ? `<button onclick="editarFuncionarioUI('${f.id}')" class="btn" title="Editar" style="background:#e6e6e6;color:#234;padding:6px 12px;font-size:1.2em;gap:4px"><span>✏️</span></button>
				<button onclick="excluirFuncionarioUI('${f.id}')" class="btn" title="Excluir" style="background:#f3d6d6;color:#a33;padding:6px 12px;font-size:1.2em;gap:4px"><span>🗑️</span></button>` : ''}
			</td>
			<td><button onclick="abrirMetas('${f.id}','${f.nome}')">Metas</button></td>
			<td><button onclick="abrirCompetencias('${f.id}','${f.nome}')">Competências</button></td>
		</tr>`;
	});
}
// Metas e Competências UI
let funcionarioSelecionado = null;
function abrirMetas(id, nome) {
	const usuario = getUsuarioLogado();
	if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'gestor' && usuario.id !== id)) {
		alert('Apenas admin, gestor ou o próprio funcionário podem visualizar as metas.');
		return;
	}
	funcionarioSelecionado = id;
	document.getElementById('metas-competencias').style.display = '';
	document.getElementById('nome-meta').textContent = nome;
	renderMetas();
	document.getElementById('lista-competencias').style.display = 'none';
}
function abrirCompetencias(id, nome) {
	const usuario = getUsuarioLogado();
	if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'gestor')) {
		alert('Apenas admin ou gestor podem visualizar as competências.');
		return;
	}
	funcionarioSelecionado = id;
	document.getElementById('metas-competencias').style.display = '';
	document.getElementById('nome-meta').textContent = nome;
	renderCompetencias();
	document.getElementById('lista-metas').style.display = 'none';
}
function fecharMetasCompetencias() {
	document.getElementById('metas-competencias').style.display = 'none';
	document.getElementById('lista-metas').style.display = '';
	document.getElementById('lista-competencias').style.display = '';
}
function adicionarMetaUI() {
	const usuario = getUsuarioLogado();
	if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'gestor')) {
		alert('Apenas admin ou gestor podem adicionar metas.');
		return;
	}
	const desc = document.getElementById('metaDescricao').value;
	const peso = document.getElementById('metaPeso').value;
	if (!desc || !peso) return;
	adicionarMeta(funcionarioSelecionado, desc, peso);
	document.getElementById('metaDescricao').value = '';
	document.getElementById('metaPeso').value = '';
	renderMetas();
}
function renderMetas() {
	const ul = document.getElementById('lista-metas');
	ul.style.display = '';
	const metas = getMetas().filter(m => m.funcionarioId === funcionarioSelecionado);
	document.getElementById('cont-metas').textContent = metas.length;
	ul.innerHTML = metas.length ? metas.map((m,i)=>`<li style='display:flex;align-items:center;gap:8px'>${m.descricao} <span style='color:#888'>(Peso: ${m.peso})</span> <button onclick="removerMetaUI(${i})" title="Remover" style="background:none;border:none;color:#a33;font-size:1.1em;cursor:pointer">🗑️</button></li>`).join('') : '<li>Nenhuma meta cadastrada.</li>';
	document.getElementById('lista-competencias').style.display = 'none';
}
function adicionarCompetenciaUI() {
	const usuario = getUsuarioLogado();
	if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'gestor')) {
		alert('Apenas admin ou gestor podem adicionar competências.');
		return;
	}
	const nome = document.getElementById('compNome').value;
	const peso = document.getElementById('compPeso').value;
	if (!nome || !peso) return;
	adicionarCompetencia(nome, peso);
	document.getElementById('compNome').value = '';
	document.getElementById('compPeso').value = '';
	renderCompetencias();
}
function renderCompetencias() {
	const ul = document.getElementById('lista-competencias');
	ul.style.display = '';
	const competencias = getCompetencias();
	document.getElementById('cont-competencias').textContent = competencias.length;
	ul.innerHTML = competencias.length ? competencias.map((c,i)=>`<li style='display:flex;align-items:center;gap:8px'>${c.nome} <span style='color:#888'>(Peso: ${c.peso})</span> <button onclick="removerCompetenciaUI(${i})" title="Remover" style="background:none;border:none;color:#a33;font-size:1.1em;cursor:pointer">🗑️</button></li>`).join('') : '<li>Nenhuma competência cadastrada.</li>';
	document.getElementById('lista-metas').style.display = 'none';
}
// Remover meta por índice
function removerMetaUI(idx) {
	const usuario = getUsuarioLogado();
	if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'gestor')) {
		alert('Apenas admin ou gestor podem remover metas.');
		return;
	}
	let metas = getMetas();
	metas = metas.filter((m, i) => !(m.funcionarioId === funcionarioSelecionado && i === idx));
	setMetas(metas);
	renderMetas();
}
// Remover competência por índice
function removerCompetenciaUI(idx) {
	const usuario = getUsuarioLogado();
	if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'gestor')) {
		alert('Apenas admin ou gestor podem remover competências.');
		return;
	}
	let competencias = getCompetencias();
	competencias.splice(idx, 1);
	setCompetencias(competencias);
	renderCompetencias();
}

function salvarFuncionario() {
	const usuario = getUsuarioLogado();
	if (!usuario || usuario.tipo !== 'admin') {
		alert('Apenas administradores podem cadastrar ou editar funcionários.');
		return;
	}
	const id = document.getElementById('funcionarioId').value;
	const nome = document.getElementById('nomeFuncionario').value;
	const email = document.getElementById('emailFuncionario').value;
	const setor = document.getElementById('setorFuncionario').value;
	const tipo = document.getElementById('tipoFuncionario').value;
	if (!nome || !email || !setor || !tipo) return;
	if (id) {
		editarFuncionario(id, { nome, email, setor, tipo });
	} else {
		adicionarFuncionarioCompleto(nome, email, setor, tipo);
	}
	limparFormulario();
	renderFuncionarios();
}

function editarFuncionarioUI(id) {
	const f = consultarFuncionario(id);
	if (!f) return;
	document.getElementById('funcionarioId').value = f.id;
	document.getElementById('nomeFuncionario').value = f.nome;
	document.getElementById('emailFuncionario').value = f.email || '';
	document.getElementById('setorFuncionario').value = f.setor;
	document.getElementById('tipoFuncionario').value = f.tipo || 'comum';
}

function excluirFuncionarioUI(id) {
	const usuario = getUsuarioLogado();
	if (!usuario || usuario.tipo !== 'admin') {
		alert('Apenas administradores podem excluir funcionários.');
		return;
	}
	if (confirm('Excluir este funcionário?')) {
		excluirFuncionario(id);
		renderFuncionarios();
		limparFormulario();
	}
}

function limparFormulario() {
	document.getElementById('funcionarioId').value = '';
	document.getElementById('nomeFuncionario').value = '';
	document.getElementById('emailFuncionario').value = '';
	document.getElementById('setorFuncionario').value = '';
}

window.onload = function() {
	renderFuncionarios();
	// Exibe campo de tipo apenas para admin
	setTimeout(() => {
		const usuario = getUsuarioLogado();
		const tipoDiv = document.getElementById('div-tipo-funcionario');
		if (tipoDiv) {
			tipoDiv.style.display = (usuario && usuario.tipo === 'admin') ? '' : 'none';
		}
	}, 200);
};