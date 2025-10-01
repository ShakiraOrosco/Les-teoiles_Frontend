import { useNavigate } from "react-router";
import { login, LoginCredentials } from "../../services/auth/authService";
import { toast } from "sonner"

export const useAuth = () => {
    const navigate = useNavigate();

    const loginUser = async (credenciales: LoginCredentials) => {
        const { username, password } = credenciales;

        if (!username || !password) {
            toast.error("Rellena todos los campos.");
            return;
        }

        try {
            const { access, refresh } = await login(credenciales);

            // Guardar tokens en localStorage
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);

            // Redirigir a la página principal
            navigate("/dashboard");
            toast.success("Inicio de sesión realizado con correctamente.");
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 400) {
                toast.error("Credenciales inválidas, intenta de nuevo.");
            } else {
                toast.error("Error inesperado, intenta de nuevo más tarde.");
            }
        }
    }

    return { loginUser };
}