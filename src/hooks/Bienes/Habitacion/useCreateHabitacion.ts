// src/hooks/Bienes/Habitacion/useCreateHabitacion.ts
import { useState } from "react";
import { HabitacionDTO } from "../../../types/Bienes/Habitacion/habitacion";
import * as habitacionService from "../../../services/Bienes/Habitacion/habitacionService";
import { toast } from "sonner";

export const useCreateHabitacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createHabitacion = async (data: HabitacionDTO) => {
    setLoading(true);
    setError(null);
    try {
      const nueva = await habitacionService.createHabitacion(data);
      toast.success("Habitación creada exitosamente");
      return nueva;
    } catch {
      setError("Error al crear habitación");
      toast.error("Error al crear habitación");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createHabitacion, loading, error };
};
