// src/hooks/Bienes/Habitacion/useHabitaciones.ts
import { useEffect, useState, useCallback } from "react";
import { HabitacionDTO } from "../../../types/Bienes/Habitacion/habitacion";
import {
  getHabitaciones,
  createHabitacion,
} from "../../../services/Bienes/Habitacion/habitacionService";

export const useHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState<HabitacionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === Obtener habitaciones ===
  const fetchHabitaciones = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getHabitaciones();
      setHabitaciones(data);
    } catch (err) {
      setError("Error al cargar habitaciones");
      setHabitaciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabitaciones();
  }, [fetchHabitaciones]);

  // === Crear habitación ===
  const addHabitacion = async (nueva: HabitacionDTO) => {
    try {
      const creada = await createHabitacion(nueva);
      setHabitaciones((prev) => [...prev, creada]);
    } catch (err) {
      throw new Error("Error al crear habitación");
    }
  };

  return { habitaciones, loading, error, refetch: fetchHabitaciones, addHabitacion };
};
