// src/hooks/AdReserva/Reserva_Hospedaje/useCreateHospedaje.ts
import { useState } from "react";
import { createReservaHotel } from "../../../services/AdReservas/Reserva_Hospedaje/Reserva_Hospedaje_Services";

export const useCreateReservaHotel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReserva = async (nuevaReserva: any) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Hook - Enviando datos al servicio:', nuevaReserva);
      const resultado = await createReservaHotel(nuevaReserva);
      console.log('✅ Hook - Respuesta recibida del servicio:', resultado);
      setLoading(false);
      return resultado;
    } catch (err: any) {
      console.error('❌ Hook - Error completo:', err);
      console.error('❌ Hook - Error response:', err.response);
      console.error('❌ Hook - Error data:', err.response?.data);
      const errorMessage = err.response?.data?.error || "Error al crear la reserva";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return { createReserva, loading, error };
};