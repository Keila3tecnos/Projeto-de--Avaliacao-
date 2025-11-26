window.logoutUsuario = function() {
	localStorage.removeItem('usuarioLogado');
	location.reload();
};

// Modal de login/cadastro admin
function showLoginModal(adminMode) {
	if (document.getElementById('modal-login')) return;
	const modal = document.createElement('div');
	modal.id = 'modal-login';
	modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;z-index:99999;';
	modal.innerHTML = `
		<div style="background:#fff;padding:32px 28px;border-radius:12px;box-shadow:0 2px 16px #0002;min-width:320px;max-width:90vw">
			<h2 style="margin-top:0">${adminMode ? 'Cadastro do primeiro Admin' : 'Login'}</h2>
			<form id="form-login-modal" autocomplete="off">
				   <div id="login-nome-div" style="margin-bottom:12px;${adminMode ? '' : 'display:none;'}">
					   <label>Nome</label>
					   <input type="text" id="login-nome" style="width:100%" ${adminMode ? 'required' : ''}>
				   </div>
				<div style="margin-bottom:12px">
					<label>Email</label>
					<input type="email" id="login-email" style="width:100%" required>
				</div>
				<div style="margin-bottom:12px">
					<label>Setor</label>
					<input type="text" id="login-setor" style="width:100%" required>
				</div>
				<button type="submit" class="btn" style="width:100%;margin-top:10px">${adminMode ? 'Cadastrar Admin' : 'Entrar'}</button>
			</form>
		</div>
	`;
	document.body.appendChild(modal);
	document.getElementById('form-login-modal').onsubmit = function(e) {
		e.preventDefault();
		const nome = document.getElementById('login-nome').value.trim();
		const email = document.getElementById('login-email').value.trim();
		const setor = document.getElementById('login-setor').value.trim();
		if (adminMode) {
			if (!nome || !email || !setor) return;
			adicionarFuncionarioCompleto(nome, email, setor, 'admin');
			setUsuarioLogado({ nome, email, setor, tipo: 'admin' });
			document.body.removeChild(modal);
			location.reload();
		} else {
			const funcionarios = getFuncionarios();
			const usuario = funcionarios.find(f => f.email === email && f.setor === setor);
			if (!usuario) {
				alert('Usuário não encontrado ou setor incorreto.');
				return;
			}
			setUsuarioLogado(usuario);
			document.body.removeChild(modal);
			location.reload();
		}
	};
}

// Controle de sessão e bootstrap de admin
document.addEventListener('DOMContentLoaded', function() {
	if (!existeAdmin()) {
		showLoginModal(true);
	} else if (!getUsuarioLogado()) {
		showLoginModal(false);
	}
});
