# Sistema Lojinha

## 📋 Visão Geral

**Lojinha** é uma aplicação web full-stack para gerenciar clientes e pedidos com funcionalidades de cadastro, consulta, filtros avançados e validações de negócio.

**Tecnologias:**
- Backend: C# .NET 10 (Minimal API)
- Frontend: HTML5, CSS3, JavaScript Vanilla
- Banco de Dados: PostgreSQL
- Hospedagem: render.com

---

## ✅ Funcionalidades Implementadas

### 1. **Gestão de Clientes**
- ✅ Cadastro de clientes com validações:
  - CPF único e válido (algoritmo de validação completo)
  - Email com formato válido
  - Data de nascimento (mínimo 18 anos, anterior ao dia atual)
  - Endereço obrigatório
- ✅ Busca/filtro por nome, CPF, email ou endereço

### 2. **Gestão de Pedidos**
- ✅ Criação de pedidos com cliente e múltiplos itens
- ✅ Itens com nome, quantidade e valor unitário
- ✅ Cálculo automático do total do pedido
- ✅ Restrição: pedido não pode ser editado após 24 horas
- ✅ Botão de edição desabilitado visualmente para pedidos antigos
- ✅ Edição de itens existentes, adição de novos e remoção

### 3. **Filtros e Consultas Avançadas**
- ✅ Filtro por ID do pedido
- ✅ Filtro por cliente (nome ou ID)
- ✅ Filtro por intervalo de total (mínimo e máximo)
- ✅ Filtro por intervalo de datas (data início/fim)
- ✅ Busca textual combinada (pedido, cliente, itens)
- ✅ Botão para limpar todos os filtros
- ✅ Resumo: contagem filtrada e valor total em tempo real


### 4. **Backend (API)**
- ✅ Endpoints RESTful para clientes (GET, POST, PUT, DELETE)
- ✅ Endpoints RESTful para pedidos (GET, POST, PUT, DELETE)
- ✅ Endpoints RESTful para itens de pedidos (GET, POST, PUT, DELETE)
- ✅ Validações de negócio no servidor
- ✅ Banco de dados com relacionamentos FK

---

## 📦 Estrutura do Projeto

```
lojinha/
├── Program.cs                # Configuração e inicialização da API
├── lojinha.csproj            # Manifesto do projeto .NET
├── Dockerfile                # Publicação em container
├── README.md                 # Instruções de execução
│
├── Data/
│   └── AppDbContext.cs       # Contexto do Entity Framework
│
├── Models/
│   ├── Cliente.cs            # Modelo de cliente
│   ├── Pedido.cs             # Modelo de pedido
│   └── ItemPedido.cs         # Modelo de item de pedido
│
├── Endpoints/
│   ├── ClienteEndpoints.cs   # Rotas de clientes
│   ├── PedidoEndpoints.cs    # Rotas de pedidos
│   └── ItemPedidoEndpoints.cs # Rotas de itens
│
├── Validators/
│   ├── ClienteValidator.cs    # Validações de cliente
│   ├── PedidoValidator.cs     # Validações de pedido
│   └── ItemPedidoValidator.cs # Validações de item
│
├── wwwroot/
│   ├── index.html             # Página inicial
│   ├── clientes.html          # Página de clientes
│   ├── pedidos.html           # Página de pedidos
│   │
│   ├── js/
│   │   ├── clientes.js        # Lógica de clientes (loading, CRUD, filtros)
│   │   └── pedidos.js         # Lógica de pedidos (loading, CRUD, filtros)
│   │
│   ├── css/
│   │   └── style.css          # Estilos globais
│   │
│   └── assets/
│       └── favicon.svg        # Ícone da aplicação
│
├── database/
│   ├── init.sql               # Script de criação de tabelas
│   └── insert_examples.sql    # Dados de exemplo para teste (deprecated)
│
└── appsettings*.json          # Configurações (dev, prod, example)
```

---

## 🔌 Endpoints da API

### **Clientes**
```
GET    /api/clientes           # Lista todos os clientes
POST   /api/clientes           # Cria novo cliente
GET    /api/clientes/{id}      # Obtém cliente por ID
PUT    /api/clientes/{id}      # Atualiza cliente
DELETE /api/clientes/{id}      # Deleta cliente
```

### **Pedidos**
```
GET    /api/pedidos            # Lista todos os pedidos
POST   /api/pedidos            # Cria novo pedido
GET    /api/pedidos/{id}       # Obtém pedido por ID
PUT    /api/pedidos/{id}       # Atualiza pedido
DELETE /api/pedidos/{id}       # Deleta pedido
```

### **Itens de Pedidos**
```
GET    /api/itens              # Lista todos os itens
POST   /api/itens              # Cria item em pedido
GET    /api/itens/{id}         # Obtém item por ID
PUT    /api/itens/{id}         # Atualiza item
DELETE /api/itens/{id}         # Deleta item
```

---

## 🚀 Como Executar Localmente

### **Pré-requisitos**
- .NET 10 SDK instalado
- SQL Server / PostgreSQL / MySQL
- Git

### **Passos**
```bash
# 1. Clonar repositório
git clone <url-repo>
cd lojinha

# 2. Criar banco de dados (executar script SQL)
# Abra em seu gerenciador SQL e execute: database/init.sql

# 3. Atualizar string de conexão (appsettings.Development.json)
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=Lojinha;User Id=sa;Password=YourPassword;"
  }
}

# 4. Instalar dependências e rodar
dotnet restore
dotnet watch run

# 5. Acessar em http://localhost:5000
```

---

## 🌐 Publicação

A aplicação está publicada em: **https://lojinha-wylb.onrender.com/**


**Tecnologia de hospedagem:** Docker / Cloud (render.com)