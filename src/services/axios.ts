import axios from "axios"
import { refreshAccessToken, logout } from "./auth/authService";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})


// INTERCEPTOR PARA AGREGAR EL TOKEN A CADA PETICIÓN

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// INTERCEPTOR PARA MANEJAR ERRORES DE AUTENTICACIÓN (401) Y REFRESCAR EL TOKEN
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
                // Actualizar el header y reintentar la petición
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }
            else {
                // Si no se puede refrescar el token, cerrar sesión
                await logout();
            }
        }
        return Promise.reject(error);
    }
)

export default api