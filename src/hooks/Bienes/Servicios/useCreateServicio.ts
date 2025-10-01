// src/hooks/Bienes/Servicios/useCreateServicio.ts
import { useState } from "react";
import { ServicioDTO } from "../../../types/Bienes/Servicios/servicio";

export function useCreateServicio() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createServicio = async (servicio: ServicioDTO, onSuccess?: () => void) => {
    setIsPending(true);
    setError(null);
    try {
      // Simular API
      await new Promise(res => setTimeout(res, 1000));
      console.log("Servicio creado:", servicio);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Error al crear servicio");
    } finally {
      setIsPending(false);
    }
  };

  return { createServicio, isPending, error };
}
