const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "..", "public")));

// Rota raiz opcional (garante abertura do index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configuração da conexão
const config = {
  user: "sa",
  password: "Senha123!",
  server: "localhost\\SQLEXPRESS02",
  database: "DogFinderDB",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// 🟢 Listar todos os cães
app.get("/api/caes", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`SELECT * FROM Caes`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🟢 Cadastrar um cão
app.post("/api/caes", async (req, res) => {
  const cao = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("Nome", sql.NVarChar, cao.nome)
      .input("Descricao", sql.NVarChar, cao.descricao)
      .input("Idade", sql.Int, cao.idade)
      .input("Raca", sql.NVarChar, cao.raca)
      .input("Caracteristicas", sql.NVarChar, cao.caracteristicas)
      .input("Sexo", sql.NVarChar, cao.sexo)
      .input("Estado", sql.NVarChar, cao.estado)
      .input("Localizacao", sql.NVarChar, cao.localizacao)
      .input("Imagem", sql.NVarChar, cao.imagem)
      .input("Recompensa", sql.NVarChar, cao.recompensa)
      .input("Prioridade", sql.Bit, cao.prioridade ? 1 : 0)
      .query(`
        INSERT INTO Caes
        (Nome, Descricao, Idade, Raca, Caracteristicas, Sexo, Estado, Localizacao, Imagem, Recompensa, Prioridade)
        VALUES
        (@Nome, @Descricao, @Idade, @Raca, @Caracteristicas, @Sexo, @Estado, @Localizacao, @Imagem, @Recompensa, @Prioridade)
      `);
    res.json({ message: "Cão cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🟢 Adicionar comentário
app.post("/api/caes/:id/comentarios", async (req, res) => {
  const idCao = req.params.id;
  const { comentario } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("CaoId", sql.Int, idCao)
      .input("Comentario", sql.NVarChar, comentario)
      .query(`
        INSERT INTO Comentarios
        (CaoId, Comentario)
        VALUES
        (@CaoId, @Comentario)
      `);
    res.json({ message: "Comentário adicionado!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🟢 Adicionar favorito
app.post("/api/favoritos", async (req, res) => {
  const { CaoId } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("CaoId", sql.Int, CaoId)
      .query(`INSERT INTO Favoritos (CaoId) VALUES (@CaoId)`);
    res.json({ message: "Favorito salvo!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🟢 Listar favoritos
app.get("/api/favoritos", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT F.Id, C.* FROM Favoritos F
      JOIN Caes C ON F.CaoId = C.Id
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🟢 Registrar histórico
app.post("/api/historico", async (req, res) => {
  const { acao } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("Acao", sql.NVarChar, acao)
      .query(`INSERT INTO Historico (Acao, Data) VALUES (@Acao, GETDATE())`);
    res.json({ message: "Histórico registrado!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🟢 Listar histórico
app.get("/api/historico", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT * FROM Historico ORDER BY Data DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🟢 Salvar perfil
app.post("/api/perfil", async (req, res) => {
  const { nome, email, telefone } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("Nome", sql.NVarChar, nome)
      .input("Email", sql.NVarChar, email)
      .input("Telefone", sql.NVarChar, telefone)
      .query(`
        DELETE FROM Perfil;
        INSERT INTO Perfil (Nome, Email, Telefone)
        VALUES (@Nome, @Email, @Telefone)
      `);
    res.json({ message: "Perfil salvo!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🟢 Carregar perfil
app.get("/api/perfil", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`SELECT TOP 1 * FROM Perfil`);
    res.json(result.recordset[0] || {});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
app.listen(3000, () => console.log("✅ API e Frontend rodando em http://localhost:3000"));