import { useState } from "react";
import { ServicioAdicional, EstadoServicio } from "../../../types/Bienes/Servicios/servicio";
import { toggleServicioEstado } from "../../../services/Bienes/Servicios/serviciosServices";

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
      // 🔹 Llamada al backend usando services.ts
      await toggleServicioEstado(servicio.id_servicios_adicionales, nuevoEstado);

      console.log(`Estado de "${servicio.nombre}" actualizado a ${nuevoEstado}`);
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
