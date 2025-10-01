// src/hooks/Bienes/Servicios/useToggleServicio.ts
import { useState } from "react";
import { ServicioAdicional, EstadoServicio } from "../../../types/Bienes/Servicios/servicio";

export function useToggleServicio() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleEstado = async (
    servicio: ServicioAdicional,
    nuevoEstado: EstadoServicio,
    onSuccess?: () => void
  ) => {
    setIsPending(true);
    setError(null);
    try {
      await new Promise(res => setTimeout(res, 1000));
      console.log("Estado actualizado:", { ...servicio, estado: nuevoEstado });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Error al cambiar estado");
    } finally {
      setIsPending(false);
    }
  };

  return { toggleEstado, isPending, error };
}
