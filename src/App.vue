<template>
  <div id="app">
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Dashboard</router-link></li>
          <li><router-link to="/products">Produtos</router-link></li>
          <li><router-link to="/users">Usuários</router-link></li>
          <li><router-link to="/carts">Carrinhos</router-link></li>
          <li>
            <!-- Exibição do nome do usuário logado -->
            <span v-if="username">Bem-vindo, {{ username }}</span>
          </li>
          <li>
            <button @click="logout">Sair</button>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      username: localStorage.getItem("username") || "Visitante", // Carrega o nome do usuário ou exibe "Visitante"
    };
  },
  methods: {
    logout() {
      // Remover o token e o nome do usuário
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");

      // Redirecionar para a página de login
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* Estilo para o cabeçalho */
header {
  background-color: #4caf50;
  padding: 1rem;
}

nav ul {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 0;
}

nav li {
  margin: 0 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
}

nav a:hover {
  text-decoration: underline;
}

/* Estilo do botão de logout */
button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  text-decoration: underline;
}

/* Estilo para o nome do usuário */
nav span {
  color: white;
  font-size: 1rem;
  font-weight: bold;
  margin-right: 1rem;
}
</style>