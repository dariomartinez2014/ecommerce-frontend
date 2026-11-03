// Apunte de estudio: Aquí preparo el cliente HTTP. Los servicios lo reutilizan para comunicarse con la API.
import axios, { type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api-funval-g6.onrender.com",
  // El servicio de clase puede tardar en despertar después de estar inactivo.
  timeout: 60000,
  headers: { Accept: "application/json" },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type ConfigReintento = InternalAxiosRequestConfig & { reintentado?: boolean };
api.interceptors.response.use((respuesta) => respuesta, async (error: unknown) => {
  if (!axios.isAxiosError(error) || axios.isCancel(error)) return Promise.reject(error);
  const config = error.config as ConfigReintento | undefined;
  const transitorio = !error.response || error.response.status >= 500;
  // Repetir una sola lectura es seguro; las escrituras nunca se repiten.
  if (config?.method === "get" && !config.reintentado && !config.signal?.aborted && transitorio) {
    config.reintentado = true;
    return api.request(config);
  }
  const mensaje = error.response
    ? `El servidor del catálogo devolvió un error (${error.response.status}). Intenta nuevamente.`
    : "No se pudo conectar con la API. Comprueba tu conexión y vuelve a intentar.";
  return Promise.reject(new Error(mensaje));
});
