// src/hooks/Bienes/Servicios/useUpdateServicio.ts
import { useState } from "react";
import { ServicioDTO } from "../../../types/Bienes/Servicios/servicio";

export function useUpdateServicio() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateServicio = async (
    id: number,
    servicio: ServicioDTO,
    onSuccess?: () => void
  ) => {
    setIsPending(true);
    setError(null);
    try {
      await new Promise(res => setTimeout(res, 1000));
      console.log("Servicio actualizado:", { id, ...servicio });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Error al actualizar servicio");
    } finally {
      setIsPending(false);
    }
  };

  return { updateServicio, isPending, error };
}
