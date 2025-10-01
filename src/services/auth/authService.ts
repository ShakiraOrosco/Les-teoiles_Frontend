import api from "../axios";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export const login = async (credenciales: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/login/", credenciales);
    return response.data;
}

export const logout = async () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
}

export const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh)
        return null;

    try {
        const response = await api.post<LoginResponse>("/token/refresh/", { refresh });
        const { access } = response.data;

        if (access) {
            localStorage.setItem("access", access);
            return access;
        }

        return null;
    } catch (error) {
        console.error("Error al refrescar token:", error);
        return null;
    }
}
