// src/hooks/Bienes/Habitacion/useUpdateHabitacion.ts
import { useState } from "react";
import * as habitacionService from "../../../services/Bienes/Habitacion/habitacionService";
import { Habitacion } from "../../../types/Bienes/Habitacion/habitacion";
import { toast } from "sonner";

export function useUpdateHabitacion() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ahora recibe directamente un objeto Habitacion
  const updateHabitacion = async (habitacion: Habitacion): Promise<Habitacion | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      const updated = await habitacionService.editHabitacion(habitacion.id_habitacion, habitacion);
      toast.success("Habitación actualizada exitosamente");
      return updated;
    } catch (err: any) {
      const backendError = err.response?.data?.error;

      if (backendError?.includes("Ya existe una habitación")) {
        toast.error("Ya existe una habitación con ese número");
      } else {
        toast.error(backendError || "Error al actualizar la habitación");
      }

      setError(backendError || "Error al actualizar la habitación");
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateHabitacion, // ⚡ importante: debe llamarse así para el modal
    isUpdating,
    error,
  };
}
