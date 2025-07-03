# 🐾 DogFinder - Sistema de Cadastro e Busca de Cães Desaparecidos

Este projeto foi desenvolvido como parte de um trabalho acadêmico. O objetivo é permitir o **cadastro, busca e gerenciamento de informações sobre cães desaparecidos**, além de contar com recursos como favoritos, histórico de ações e perfil do usuário.

---

## 🚀 Tecnologias Utilizadas

- **Node.js + Express**
- **SQL Server Express**
- **HTML + CSS + JavaScript Vanilla**
- **LocalStorage (em parte do frontend)**
- **mssql (conector SQL Server para Node.js)**

---

## 🗂 Estrutura do Projeto

ProjetoV3/
│
├── Backend/
│ ├── server.js # API Express que conecta no SQL Server
│ └── public/ # Frontend estático
│ ├── index.html
│ ├── adocao.html
│ ├── script.js
│ ├── style.css
│ └── assets/
│ └── logo.svg
│
├── package.json
└── .gitignore

yaml
Copiar
Editar

---

## ⚙️ Como Executar o Projeto

### 1️⃣ Instale as dependências

Dentro da pasta `Backend`:

```bash
npm install
2️⃣ Configure o banco de dados
Crie o banco DogFinderDB no seu SQL Server com as tabelas:

sql
Copiar
Editar
CREATE TABLE Caes (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Nome NVARCHAR(100),
  Descricao NVARCHAR(MAX),
  Idade INT,
  Raca NVARCHAR(100),
  Caracteristicas NVARCHAR(255),
  Sexo NVARCHAR(10),
  Estado NVARCHAR(50),
  Localizacao NVARCHAR(255),
  Imagem NVARCHAR(500),
  Recompensa NVARCHAR(100),
  Prioridade BIT
);

CREATE TABLE Comentarios (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CaoId INT FOREIGN KEY REFERENCES Caes(Id),
  Comentario NVARCHAR(MAX)
);

CREATE TABLE Favoritos (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CaoId INT FOREIGN KEY REFERENCES Caes(Id)
);

CREATE TABLE Historico (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Acao NVARCHAR(MAX),
  Data DATETIME
);

CREATE TABLE Perfil (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Nome NVARCHAR(100),
  Email NVARCHAR(100),
  Telefone NVARCHAR(50)
);
3️⃣ Configure sua conexão
No server.js, ajuste se necessário:

javascript
Copiar
Editar
const config = {
  user: "sa",
  password: "SuaSenhaAqui",
  server: "localhost\\SQLEXPRESS",
  database: "DogFinderDB",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};
4️⃣ Inicie o servidor
Ainda na pasta Backend:

bash
Copiar
Editar
node server.js
A API estará em:

arduino
Copiar
Editar
http://localhost:3000
🖥 Acessando o Frontend
Abra no navegador:

arduino
Copiar
Editar
http://localhost:3000
Lá você poderá:

✅ Cadastrar cães desaparecidos
✅ Visualizar e filtrar a lista
✅ Favoritar cães
✅ Comentar
✅ Gerenciar perfil e histórico
✅ Alternar tema claro/escuro

📝 Observações Importantes
O sistema de adoção (adocao.html) utiliza LocalStorage apenas como simulação.

O restante dos dados vem da API Node.js conectada ao SQL Server.

Foi criado como um projeto acadêmico, podendo servir de base para aplicações reais com melhorias.

💡 Créditos
Projeto desenvolvido por João Vitor Buske Marchel como parte do curso de Ads.

yaml
Copiar
Editar
