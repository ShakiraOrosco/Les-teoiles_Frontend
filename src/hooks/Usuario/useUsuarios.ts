import { useEffect, useState, useCallback } from "react";
import { getUsuarios, createUsuario, updateUsuario} from "../../services/usuario/usuarioService";
import { Usuario } from "../../types/Usuarios/usuario";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const fetchUsuarios = useCallback(async () => {
  try {
    setLoading(true);
    const data = await getUsuarios();
    setUsuarios(data);
  } catch (err) {
    setError("Error al cargar usuarios");
  } finally {
    setLoading(false);
  }
}, []);
   useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

    // === Nuevo: crear usuario ===
    const addUsuario = async (nuevo: Usuario) => {
        try {
            const creado = await createUsuario(nuevo);
            setUsuarios((prev) => [...prev, creado]);
        } catch (err) {
            throw new Error("Error al crear usuario");
        }
    };
    
  // === Nuevo: editar usuario ===
  const editarUsuario = async (id_usuario: number, datos: Partial<Usuario>) => {
    try {
      await updateUsuario(id_usuario, datos);
      await fetchUsuarios(); // recargar lista
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

    return { usuarios, loading, error, addUsuario,editarUsuario, refetch: fetchUsuarios  };

    
};
