import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: 'https://fakestoreapi.com', // URL base da API
});

export default api;