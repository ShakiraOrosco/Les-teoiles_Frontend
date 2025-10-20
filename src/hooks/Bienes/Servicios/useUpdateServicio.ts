import { useState } from "react";
import { ServicioDTO } from "../../../types/Bienes/Servicios/servicio";
import * as servicioService from "../../../services/Bienes/Servicios/serviciosServices";
import { toast } from "sonner";

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
      const updated = await servicioService.editServicio(id, servicio);
      toast.success("Servicio actualizado exitosamente");
      onSuccess?.();
      return updated;
    } catch (err: any) {
      const backendError = err.response?.data?.error;
      toast.error(backendError || "Error al actualizar el servicio");
      setError(backendError || "Error al actualizar el servicio");
      return null;
    } finally {
      setIsPending(false);
    }
  };

  return { updateServicio, isPending, error };
}
