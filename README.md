# Painel de Controle de Loja Online 🛒

Este projeto é um painel de controle desenvolvido com **Vue.js 3** e **Vite**, utilizando a **API Fake Store** para gerenciar e monitorar informações de uma loja online. Ele inclui funcionalidades completas para gerenciar produtos, categorias, carrinhos (pedidos) e usuários, além de uma autenticação funcional.

---

## 📋 Funcionalidades

### **1. Dashboard**
- Resumo dos principais indicadores:
  - Total de produtos.
  - Número de categorias.
  - Total de pedidos.
  - Total de usuários.
- Gráfico de distribuição de produtos por categoria.

### **2. Gerenciamento de Produtos**
- Listagem de produtos com colunas de Nome, Categoria, Preço e Classificação.
- Filtro por categoria e ordenação por preço ou classificação.
- Modal para visualizar, editar e remover produtos.
- Adicionar novos produtos à loja.

### **3. Gerenciamento de Usuários**
- Listagem de usuários registrados com Nome, E-mail e Cidade.
- Pesquisa de usuários por nome.
- Modal para adicionar, editar e remover usuários.

### **4. Gerenciamento de Carrinhos (Pedidos)**
- Listagem de carrinhos com informações de ID do pedido, data e valor total.
- Filtro por data e/ou usuário.
- Modal para editar e remover itens do carrinho.

### **5. Autenticação**
- Tela de login para acesso ao painel.
- Proteção de rotas: apenas usuários autenticados têm acesso.
- Funcionalidade de logout.

### **6. Responsividade**
- Layout adaptado para desktops e dispositivos móveis.

---

## 🚀 Tecnologias Utilizadas

- **Vue.js 3**: Framework JavaScript para a interface do usuário.
- **Vite**: Ferramenta de construção rápida e leve.
- **Axios**: Para consumo da API.
- **Chart.js**: Para gráficos dinâmicos no dashboard.
- **Vue Router**: Para gerenciar rotas no aplicativo.

---

## 🔧 Configuração do Projeto

### **Pré-requisitos**
Certifique-se de ter o **Node.js** instalado na sua máquina.

### **Passos para Configurar**

1. Clone este repositório:
   ```bash
   git clone https://github.com/AleffJouni/painel-de-controle-loja.git
   cd painel-de-controle-loja

2. Instale as dependências:
    npm install

3. Inicie o servidor de desenvolvimento:
    npm run dev

4. Acesse o painel no navegador:
    http://localhost:3000
    
## 🔑 Login de Teste
Use as credenciais abaixo para testar o sistema:

    Usuário: mor_2314   
    Senha: 83r5^_

## 📚 Endpoints Consumidos
**Produtos**
GET /products: Obter todos os produtos.
GET /products/categories: Obter todas as categorias.
POST /products: Adicionar um produto.
PUT /products/:id: Atualizar um produto.
DELETE /products/:id: Remover um produto.

**Carrinhos**
GET /carts: Obter todos os carrinhos.
PUT /carts/:id: Atualizar itens do carrinho.
DELETE /carts/:id: Remover um carrinho.

**Usuários**
GET /users: Obter todos os usuários.
POST /users: Adicionar um usuário.
PUT /users/:id: Atualizar um usuário.
DELETE /users/:id: Remover um usuário.

**Autenticação**
POST /auth/login: Fazer login e obter token.

### 🤝 Contribuição
**Sinta-se à vontade para contribuir com melhorias para este projeto. Faça um fork, crie uma branch e envie um pull request.**