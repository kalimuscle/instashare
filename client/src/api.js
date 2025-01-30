import axios from 'axios';

// Obtiene la URL de la API desde las variables de entorno
const baseURL = process.env.REACT_APP_API_URL;

// Crea una instancia de Axios con la URL base
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;