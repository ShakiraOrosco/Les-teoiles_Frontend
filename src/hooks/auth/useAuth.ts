import { useNavigate } from "react-router";
import { login, LoginCredentials } from "../../services/auth/authService";
import { toast } from "sonner";
import { getUsuarioAutenticado } from "../../services/usuario/usuarioService";

// useAuth.ts
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

            // Obtener datos del usuario autenticado
            const usuario = await getUsuarioAutenticado();

            // Guardar información del usuario en localStorage
            localStorage.setItem("user", JSON.stringify(usuario));

            // Permitir acceso al dashboard tanto a administradores como empleados
            if (usuario.rol === "administrador") {
                toast.success("Inicio de sesión realizado correctamente.");
                setTimeout(() => navigate("/dashboard"), 100);
            }
            else if (usuario.rol === "empleado") {
                toast.success("Inicio de sesión realizado correctamente.");
                setTimeout(() => navigate("/dashboard/emp"), 100);
            }
             else {
                toast.error("Acceso denegado", {
                    description: "No tienes permisos para acceder al sistema.",
                    duration: 4000,
                });
                setTimeout(() => navigate("/"), 500);
            }

        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 400) {
                toast.error("Credenciales inválidas, intenta de nuevo.");
            } else {
                toast.error("Error inesperado, intenta de nuevo más tarde.");
            }
        }
    };

    return { loginUser };
};