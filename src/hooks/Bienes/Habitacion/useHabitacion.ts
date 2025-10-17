// src/hooks/Bienes/Habitacion/useHabitacion.ts
import { useState, useEffect } from "react";
import { Habitacion } from "../../../types/Bienes/Habitacion/habitacion";
import * as habitacionService from "../../../services/Bienes/Habitacion/habitacionService";

export const useHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await habitacionService.getHabitaciones();
      setHabitaciones(data);
    } catch {
      setError("Error al cargar habitaciones");
      setHabitaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { habitaciones, loading, error, refetch };
};
