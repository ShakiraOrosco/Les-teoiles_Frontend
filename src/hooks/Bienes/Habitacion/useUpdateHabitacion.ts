// src/hooks/Bienes/Habitacion/useUpdateHabitacion.ts
import { useState } from "react";
import * as habitacionService from "../../../services/Bienes/Habitacion/habitacionService";
import { Habitacion, HabitacionDTO } from "../../../types/Bienes/Habitacion/habitacion";
import { toast } from "sonner";

export function useUpdateHabitacion() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: number, data: HabitacionDTO): Promise<Habitacion | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      const updated = await habitacionService.editHabitacion(id, data);
      toast.success("Habitación actualizada exitosamente");
      return updated;
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error al actualizar la habitación");
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    update,
    isUpdating,
    error,
  };
}
