<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <label for="email">E-mail:</label>
        <input
          id="username"
          type="text"
          v-model="email"
          placeholder="Digite seu usuário"
          required
        />
  
        <label for="password">Senha:</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="Digite sua senha"
          required
        />
  
        <button type="submit">Entrar</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import api from "../services/api";
  
  export default {
    name: "Login",
    data() {
      return {
        email: "",
        password: "",
        errorMessage: "",
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await api.post("/auth/login", {
            username: this.email,
            password: this.password,
          });
  
          // Armazenar o token e o username no localStorage
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("username", this.email);

          // Redirecionar para o painel
          this.$router.push("/");
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          this.errorMessage = "Usuário ou senha inválidos. Tente novamente.";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  h1 {
    margin-bottom: 1rem;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  input {
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    padding: 0.5rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  .error {
    color: #f44336;
    margin-top: 1rem;
  }
  </style>  