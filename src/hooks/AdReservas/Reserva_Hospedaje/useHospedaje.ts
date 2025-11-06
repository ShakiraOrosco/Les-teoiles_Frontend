// src/hooks/Hotel/ReservaHotel/useReservasHotel.ts
import { useState, useEffect } from "react";
import { ReservaHotel } from "../../../types/AdReserva/Reserva_Hospedaje/hospedaje";
import { getReservasHotel } from "../../../services/AdReservas/Reserva_Hospedaje/Reserva_Hospedaje_Services";

// Define el tipo de respuesta de la API
interface ReservasResponse {
  count?: number;
  reservas: ReservaHotel[];
}

export const useReservasHotel = () => {
  const [reservas, setReservas] = useState<ReservaHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReservasHotel();
      
      // Maneja ambos casos: array directo u objeto con propiedad reservas
      if (Array.isArray(data)) {
        setReservas(data);
      } else if (data && 'reservas' in data && Array.isArray((data as ReservasResponse).reservas)) {
        setReservas((data as ReservasResponse).reservas);
      } else {
        setReservas([]);
      }
    } catch {
      setError("Error al cargar reservas de hotel");
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { reservas, loading, error, refetch };
};