import { useEffect, useState, useCallback } from "react";
import { getUsuarios } from "../../services/usuario/usuarioService";
import { Usuario } from "../../types/Usuarios/usuario";

export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getUsuarios();
            setUsuarios(data);
        } catch (err) {
            setError("Error al cargar usuarios");
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    return { usuarios, loading, error, refetch: fetchUsuarios };
}   