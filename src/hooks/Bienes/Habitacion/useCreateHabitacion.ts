// src/hooks/Bienes/Habitacion/useHabitaciones.ts
import { useEffect, useState, useCallback } from "react";
import { Habitacion } from "../../../types/Bienes/Habitacion/habitacion";
import {
  getHabitaciones,
  createHabitacion,
} from "../../../services/Bienes/Habitacion/habitacionService";

export const useHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
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
  const addHabitacion = async (nueva: Partial<Habitacion>) => {
    // Verificar duplicado en el front
    const existe = habitaciones.some(h => h.numero === nueva.numero);
    if (existe) throw new Error("Ya existe una habitación con ese número");

    try {
      const creada = await createHabitacion(nueva);
      setHabitaciones(prev => [...prev, creada]);
      return creada;
    } catch (err: any) {
      throw err;
    }
  };

  return { habitaciones, loading, error, refetch: fetchHabitaciones, addHabitacion };
};
