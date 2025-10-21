// src/hooks/Usuarios/useUpdateUsuario.ts
import { useState } from "react";
import * as usuarioService from "../../services/usuario/usuarioService";
import { Usuario } from "../../types/Usuarios/usuario";
import { toast } from "sonner";

export function useUpdateUsuario() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUsuario = async (usuario: Usuario): Promise<Usuario | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log("📤 Enviando actualización:", usuario);
      const updated = await usuarioService.editUsuario(usuario.id_usuario, usuario);
      console.log("✅ Respuesta:", updated);
      toast.success("Usuario actualizado exitosamente");
      return updated;
    } catch (err: any) {
      console.error("❌ Error completo:", err);
      console.error("❌ Response:", err.response);
      console.error("❌ Response data:", err.response?.data);
      console.error("❌ Response status:", err.response?.status);
      
      const backendError = err.response?.data?.error || err.response?.data?.detail;
      const statusCode = err.response?.status;

      // Manejo específico según el código de error
      if (statusCode === 403) {
        toast.error("No tienes permisos para realizar esta acción");
        setError("Permisos insuficientes");
      } else if (statusCode === 404) {
        toast.error("Usuario no encontrado");
        setError("Usuario no encontrado");
      } else if (backendError?.includes("CI ya está registrado")) {
        toast.error("Ya existe un usuario con ese CI");
        setError("CI duplicado");
      } else if (backendError?.includes("email ya está registrado")) {
        toast.error("Ya existe un usuario con ese email");
        setError("Email duplicado");
      } else if (backendError) {
        toast.error(backendError);
        setError(backendError);
      } else {
        toast.error("Error al actualizar el usuario");
        setError("Error desconocido al actualizar");
      }

      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateUsuario,
    isUpdating,
    error,
  };
}