import { useEffect, useState, useCallback } from "react";
import { getUsuarioAutenticado } from "../../services/usuario/usuarioService";
import { Usuario } from "../../types/Usuarios/usuario";


export const useUsuario = () => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsuarioAutenticado();
            setUsuario(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "No se pudo cargar el usuario.");
            setUsuario(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    return { usuario, loading, error, refetch: fetchUsuarios };
};