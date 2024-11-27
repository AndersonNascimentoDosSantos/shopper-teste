import axios from "axios";

// Configuração da base URL da API
const api = axios.create({
  baseURL: "http://localhost:8080/", // URL do backend
});

// Interceptores para tratamento de erros globais (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aqui você pode tratar erros globalmente, se necessário
    return Promise.reject(error);
  }
);

export default api;
