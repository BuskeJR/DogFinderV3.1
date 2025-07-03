// Inicialização
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let caes = JSON.parse(localStorage.getItem("caesDesaparecidos")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let historico = JSON.parse(localStorage.getItem("historico")) || [];

// Mock inicial de dados se vazio
if (caes.length === 0) {
  caes = [
    {
      id: Date.now(),
      nome: "Rex",
      descricao: "Desapareceu após sair para passear.",
      idade: "4",
      raca: "Labrador",
      caracteristicas: "Muito dócil",
      sexo: "Macho",
      estado: "SC",
      localizacao: "Florianópolis",
      imagem: "https://place-puppy.com/300x300",
      recompensa: "R$300",
      prioridade: true,
      dataCadastro: new Date().toLocaleString(),
      localizacoesAvisadas: [],
      comentarios: []
    },
    {
      id: Date.now() + 1,
      nome: "Luna",
      descricao: "Assustada com barulhos.",
      idade: "2",
      raca: "Poodle",
      caracteristicas: "",
      sexo: "Fêmea",
      estado: "SC",
      localizacao: "São José",
      imagem: "https://place-puppy.com/301x301",
      recompensa: "",
      prioridade: false,
      dataCadastro: new Date().toLocaleString(),
      localizacoesAvisadas: [],
      comentarios: []
    }
  ];
  localStorage.setItem("caesDesaparecidos", JSON.stringify(caes));
}

// Overlay login
if (localStorage.getItem("logado") === "true") {
  document.getElementById("authOverlay").style.display = "none";
  mostrarConteudo();
} else {
  document.getElementById("authOverlay").style.display = "flex";
}

// Cadastro usuário
function fazerCadastro() {
  const novoUsuario = document.getElementById("novoUsuario").value.trim();
  const novaSenha = document.getElementById("novaSenha").value.trim();
  if (!novoUsuario || !novaSenha) {
    alert("Preencha todos os campos.");
    return;
  }
  if (usuarios.find(u => u.usuario === novoUsuario)) {
    alert("Usuário já existe.");
    return;
  }
  usuarios.push({ usuario: novoUsuario, senha: novaSenha });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  mostrarToast("Usuário cadastrado!");
}

// Login
function fazerLogin() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();
  const valido = usuarios.find(u => u.usuario === user && u.senha === pass);
  if (valido) {
    localStorage.setItem("logado", "true");
    document.getElementById("authOverlay").style.display = "none";
    mostrarConteudo();
  } else {
    alert("Usuário ou senha incorretos.");
  }
}

// Logout
function fazerLogout() {
  localStorage.removeItem("logado");
  location.reload();
}

// Mostrar conteúdo
function mostrarConteudo() {
  atualizarLista();
  voltarInicio();
}

// Cadastro cão
function cadastrarCao() {
  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const idade = document.getElementById("idade").value.trim();
  const raca = document.getElementById("raca").value.trim();
  const caracteristicas = document.getElementById("caracteristicas").value.trim();
  const sexo = document.getElementById("sexo").value;
  const estado = document.getElementById("estado").value.trim();
  const localizacao = document.getElementById("localizacao").value.trim();
  const imagem = document.getElementById("imagem").value.trim();
  const recompensa = document.getElementById("recompensa").value.trim();
  const prioridade = document.getElementById("prioridade").checked;

  if (!nome || !descricao || !idade || !sexo || !estado || !localizacao || !imagem || !raca) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const cao = {
    id: Date.now(),
    nome,
    descricao,
    idade,
    raca,
    caracteristicas,
    sexo,
    estado,
    localizacao,
    imagem,
    recompensa,
    prioridade,
    dataCadastro: new Date().toLocaleString(),
    localizacoesAvisadas: [],
    comentarios: []
  };

  caes.unshift(cao);
  localStorage.setItem("caesDesaparecidos", JSON.stringify(caes));
  adicionarHistorico(`Cadastrou o cão ${nome}.`);
  mostrarToast("Cão cadastrado!");
  document.getElementById("cadastroCaoForm").reset();
  voltarInicio();
  atualizarLista();
}

// Atualizar lista
function atualizarLista(filtro = "") {
  const lista = document.getElementById("listaSection");
  lista.innerHTML = "";

  const sexoFiltro = document.getElementById("filtroSexo").value;
  const idadeFiltro = document.getElementById("filtroIdade").value;
  const estadoFiltro = document.getElementById("filtroEstado").value;
  const racaFiltro = document.getElementById("filtroRaca").value;

  const filtrados = caes.filter(c => {
    const termo = filtro.toLowerCase();
    const nomeMatch = c.nome.toLowerCase().includes(termo);
    const localMatch = c.localizacao.toLowerCase().includes(termo);
    const sexoMatch = !sexoFiltro || c.sexo === sexoFiltro;
    const estadoMatch = !estadoFiltro || c.estado === estadoFiltro;
    const racaMatch = !racaFiltro || c.raca === racaFiltro;
    let idadeMatch = true;
    if (idadeFiltro) {
      const idade = parseInt(c.idade);
      if (idadeFiltro === "0-2") idadeMatch = idade <= 2;
      else if (idadeFiltro === "3-5") idadeMatch = idade >=3 && idade <=5;
      else if (idadeFiltro === "6+") idadeMatch = idade >=6;
    }
    return (nomeMatch || localMatch) && sexoMatch && estadoMatch && idadeMatch && racaMatch;
  });

  if (filtrados.length === 0) {
    lista.innerHTML = "<p>Nenhum cão encontrado.</p>";
    document.getElementById("contadorCaes").innerText = "";
    return;
  }

  filtrados.forEach(cao => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      ${cao.prioridade ? `<div class="badge">Prioridade</div>` : ""}
      <img src="${cao.imagem}" alt="${cao.nome}">
      <div class="card-content">
        <h3>${cao.nome} (${cao.sexo})</h3>
        <p><strong>Raça:</strong> ${cao.raca}</p>
        <p><strong>Idade:</strong> ${cao.idade}</p>
        <p><strong>Estado:</strong> ${cao.estado}</p>
        <p><strong>Localização:</strong> ${cao.localizacao}</p>
        <p>${cao.descricao}</p>
        ${cao.recompensa ? `<p class="recompensa"><strong>Recompensa:</strong> ${cao.recompensa}</p>` : ""}
      </div>
      <div class="card-actions">
        <button onclick="favoritar(${cao.id})" title="Favoritar"><i class="fas fa-star"></i></button>
        <button onclick="avisarLocalizacao(${cao.id})" title="Avisar localização"><i class="fas fa-map-marker-alt"></i></button>
        <button onclick="confirmarAchado(${cao.id})" title="Marcar como encontrado"><i class="fas fa-check"></i></button>
      </div>
      <div class="comentarios">
        <input type="text" placeholder="Comentar..." onkeypress="comentar(event,${cao.id})"/>
      </div>
    `;
    lista.appendChild(div);
  });

  document.getElementById("contadorCaes").innerText = `Total de cães: ${caes.length}`;
}

// Buscar cães
function buscarCao() {
  const termo = document.getElementById("buscaInput").value.trim();
  atualizarLista(termo);
}

// Aplicar filtros
function aplicarFiltros() {
  buscarCao();
}

// Limpar filtros
function limparFiltros() {
  document.getElementById("buscaInput").value = "";
  document.getElementById("filtroSexo").value = "";
  document.getElementById("filtroIdade").value = "";
  document.getElementById("filtroEstado").value = "";
  document.getElementById("filtroRaca").value = "";
  atualizarLista();
}

// Favoritar
function favoritar(id) {
  if (!favoritos.includes(id)) {
    favoritos.push(id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    adicionarHistorico(`Favoritou o cão ID ${id}.`);
    mostrarToast("Adicionado aos favoritos!");
  }
}

// Avisar localização
function avisarLocalizacao(id) {
  const local = prompt("Digite onde o cão foi visto:");
  if (local) {
    const index = caes.findIndex(c => c.id === id);
    caes[index].localizacoesAvisadas.push(local);
    localStorage.setItem("caesDesaparecidos", JSON.stringify(caes));
    adicionarHistorico(`Avisou localização de ${caes[index].nome}.`);
    mostrarToast("Localização registrada!");
  }
}

// Confirmar achado
function confirmarAchado(id) {
  const index = caes.findIndex(c => c.id === id);
  if (confirm(`Confirmar que ${caes[index].nome} foi encontrado?`)) {
    caes.splice(index, 1);
    localStorage.setItem("caesDesaparecidos", JSON.stringify(caes));
    adicionarHistorico(`Confirmou achado.`);
    atualizarLista();
    mostrarToast("Cão removido.");
  }
}

// Comentários
function comentar(e, id) {
  if (e.key === "Enter") {
    const text = e.target.value.trim();
    if (text) {
      const index = caes.findIndex(c => c.id === id);
      caes[index].comentarios.push(text);
      localStorage.setItem("caesDesaparecidos", JSON.stringify(caes));
      e.target.value = "";
      mostrarToast("Comentário adicionado!");
    }
  }
}

// Histórico
function abrirHistorico() {
  esconderTelas();
  document.getElementById("historicoSection").style.display = "block";
  const ul = document.getElementById("historicoLista");
  ul.innerHTML = "";
  historico.forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    ul.appendChild(li);
  });
}

// Adicionar histórico
function adicionarHistorico(texto) {
  historico.unshift(`${new Date().toLocaleString()}: ${texto}`);
  localStorage.setItem("historico", JSON.stringify(historico));
}

// Perfil
function abrirPerfil() {
  esconderTelas();
  document.getElementById("perfilSection").style.display = "block";
  const perfil = JSON.parse(localStorage.getItem("perfil")) || {};
  document.getElementById("perfilNome").value = perfil.nome || "";
  document.getElementById("perfilEmail").value = perfil.email || "";
  document.getElementById("perfilTelefone").value = perfil.telefone || "";
}

function salvarPerfil() {
  const perfil = {
    nome: document.getElementById("perfilNome").value.trim(),
    email: document.getElementById("perfilEmail").value.trim(),
    telefone: document.getElementById("perfilTelefone").value.trim()
  };
  localStorage.setItem("perfil", JSON.stringify(perfil));
  mostrarToast("Perfil salvo!");
}

// Voltar início
function voltarInicio() {
  esconderTelas();
  document.getElementById("buscaSection").style.display = "block";
  document.getElementById("listaSection").style.display = "grid";
}

// Favoritos
function abrirFavoritos() {
  esconderTelas();
  const favSection = document.getElementById("favoritosSection");
  favSection.style.display = "grid";
  favSection.innerHTML = "";
  const favCaes = caes.filter(c => favoritos.includes(c.id));
  if (favCaes.length === 0) {
    favSection.innerHTML = "<p>Nenhum favorito.</p>";
    return;
  }
  favCaes.forEach(cao => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${cao.imagem}" alt="${cao.nome}">
      <div class="card-content">
        <h3>${cao.nome}</h3>
        <p><strong>Raça:</strong> ${cao.raca}</p>
        <p><strong>Localização:</strong> ${cao.localizacao}</p>
      </div>
    `;
    favSection.appendChild(div);
  });
}

// Esconder todas as seções
function esconderTelas() {
  ["buscaSection","listaSection","cadastroSection","perfilSection","favoritosSection","historicoSection"].forEach(id=>{
    document.getElementById(id).style.display="none";
  });
}

// Toast
function mostrarToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "show";
  setTimeout(() => toast.className = "", 3000);
}

// Tema claro/escuro
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

// Abrir cadastro
function abrirCadastro() {
  esconderTelas();
  document.getElementById("cadastroSection").style.display = "block";
}