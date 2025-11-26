
// ------------------------
// BANCO DE DADOS LOCAL
// ------------------------
function getFuncionarios() {
    return JSON.parse(localStorage.getItem("funcionarios") || "[]");
}
function setFuncionarios(arr) {
    localStorage.setItem("funcionarios", JSON.stringify(arr));
}

function getUsuarioLogado() {
    return JSON.parse(localStorage.getItem("usuarioLogado") || "null");
}
function setUsuarioLogado(usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
}

// Retorna true se já existe pelo menos um admin cadastrado
function existeAdmin() {
    return getFuncionarios().some(f => f.tipo === 'admin');
}

// Adiciona funcionário com tipo (admin, gestor, comum)
function adicionarFuncionarioCompleto(nome, email, setor, tipo) {
    if (!nome || !email || !setor || !tipo) return false;
    const funcionarios = getFuncionarios();
    if (funcionarios.some(f => f.email === email)) return false; // evitar duplicidade
    const id = Date.now().toString();
    funcionarios.push({ id, nome, email, setor, tipo, historico: [], status: "ativo" });
    setFuncionarios(funcionarios);
    return true;
}
function getAvaliacoes() {
    return JSON.parse(localStorage.getItem("avaliacoes") || "[]");
}
function setAvaliacoes(arr) {
    localStorage.setItem("avaliacoes", JSON.stringify(arr));
}
function getMetas() {
    return JSON.parse(localStorage.getItem("metas") || "[]");
}
function setMetas(arr) {
    localStorage.setItem("metas", JSON.stringify(arr));
}
function getCompetencias() {
    return JSON.parse(localStorage.getItem("competencias") || "[]");
}
function setCompetencias(arr) {
    localStorage.setItem("competencias", JSON.stringify(arr));
}

// ------------------------
// FUNCIONÁRIOS CRUD
// ------------------------

// Compatibilidade: mantém função antiga, mas agora exige email e tipo
function adicionarFuncionarioSimples(nome, email, setor) {
    return adicionarFuncionarioCompleto(nome, email, setor, 'comum');
}

function editarFuncionario(id, dados) {
    const funcionarios = getFuncionarios();
    const idx = funcionarios.findIndex(f => f.id === id);
    if (idx === -1) return false;
    funcionarios[idx] = { ...funcionarios[idx], ...dados };
    setFuncionarios(funcionarios);
    return true;
}

function excluirFuncionario(id) {
    let funcionarios = getFuncionarios();
    funcionarios = funcionarios.filter(f => f.id !== id);
    setFuncionarios(funcionarios);
}

function consultarFuncionario(id) {
    return getFuncionarios().find(f => f.id === id);
}

function getTiposUsuario() {
    return ["admin", "gestor", "comum"];
}

// ------------------------
// METAS E COMPETÊNCIAS
// ------------------------
function adicionarMeta(funcionarioId, descricao, peso) {
    const metas = getMetas();
    metas.push({ funcionarioId, descricao, peso: Number(peso) });
    setMetas(metas);
}
function adicionarCompetencia(nome, peso) {
    const competencias = getCompetencias();
    competencias.push({ nome, peso: Number(peso) });
    setCompetencias(competencias);
}

// ------------------------
// AVALIAÇÕES
// ------------------------
function registrarAvaliacaoCompleta({ funcionarioId, criterio, nota, comentario, data }) {
    const avaliacoes = getAvaliacoes();
    avaliacoes.push({ funcionarioId, criterio, nota: Number(nota), comentario: comentario || "", data: data || Date.now() });
    setAvaliacoes(avaliacoes);
}

// ------------------------
// RELATÓRIOS E FEEDBACK
// ------------------------
function getAvaliacoesFuncionario(funcionarioId) {
    return getAvaliacoes().filter(a => a.funcionarioId === funcionarioId);
}
function getRelatorioGeral() {
    return getAvaliacoes();
}

// ------------------------
// PLANOS DE MELHORIA E RECONHECIMENTO
// ------------------------
function criarPlanoMelhoria(funcionarioId, descricao) {
    const funcionario = consultarFuncionario(funcionarioId);
    if (!funcionario) return false;
    funcionario.planoMelhoria = descricao;
    editarFuncionario(funcionarioId, funcionario);
    return true;
}
function registrarReconhecimento(funcionarioId, descricao) {
    const funcionario = consultarFuncionario(funcionarioId);
    if (!funcionario) return false;
    funcionario.reconhecimento = descricao;
    editarFuncionario(funcionarioId, funcionario);
    return true;
}

// ------------------------
// ATUALIZAR INTERFACE (placeholder)
// ------------------------
function atualizarInterface() {
    // Esta função pode ser sobrescrita em cada tela para atualizar a UI
}
