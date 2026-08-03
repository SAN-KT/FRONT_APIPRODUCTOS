import axios from "axios";
import { API_URL } from "../config";

export const CLAVE_TOKEN_STORAGE = "asisya_token";

export const clienteHttp = axios.create({
  baseURL: API_URL,
});

// #region Interceptor de request: agrega el token a CADA llamada, sin repetir codigo en cada api.*.ts
clienteHttp.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN_STORAGE);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// #endregion

// #region Interceptor de response: si el token vencio o es invalido (401), se limpia y se manda a /login
clienteHttp.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(CLAVE_TOKEN_STORAGE);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
// #endregion
