// src/hooks/AdReserva/Reservas_Eventos/useCreateEvento.ts
import { useState } from "react";
import { createReservaEvento } from "../../../services/AdReservas/Reserva_Eventos/Reserva_Eventos_Services";
import { CrearReservaEventoDTO, CrearReservaEventoResponse } from "../../../types/AdReserva/Reservas_Eventos/eventos";

export const useCreateEvento = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvento = async (nuevoEvento: CrearReservaEventoDTO): Promise<CrearReservaEventoResponse> => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Hook Create - Enviando datos al servicio:', nuevoEvento);
      const resultado = await createReservaEvento(nuevoEvento);
      console.log('✅ Hook Create - Respuesta recibida del servicio:', resultado);
      setLoading(false);
      return resultado;
    } catch (err: any) {
      console.error('❌ Hook Create - Error completo:', err);
      console.error('❌ Hook Create - Error response:', err.response);
      console.error('❌ Hook Create - Error data:', err.response?.data);
      const errorMessage = err.response?.data?.error || err.response?.data?.mensaje || "Error al crear la reserva de evento";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return { createEvento, loading, error };
};