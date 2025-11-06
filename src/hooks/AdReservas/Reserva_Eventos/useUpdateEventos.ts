// src/hooks/AdReserva/Reservas_Eventos/useUpdateEvento.ts
import { useState } from "react";
import { updateReservaEvento } from "../../../services/AdReservas/Reserva_Eventos/Reserva_Eventos_Services";
import { ActualizarReservaEventoDTO, ActualizarReservaEventoResponse } from "../../../types/AdReserva/Reservas_Eventos/eventos";

export const useUpdateEvento = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReservaEventoHook = async (id: number, datosActualizados: ActualizarReservaEventoDTO): Promise<ActualizarReservaEventoResponse> => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log(`🔄 Hook Update - Actualizando evento ID: ${id}`, datosActualizados);
      const resultado = await updateReservaEvento(id, datosActualizados);
      console.log('✅ Hook Update - Evento actualizado:', resultado);
      setIsUpdating(false);
      return resultado;
    } catch (err: any) {
      console.error(`❌ Hook Update - Error al actualizar evento ${id}:`, err);
      console.error('❌ Hook Update - Error data:', err.response?.data);
      const errorMessage = err.response?.data?.error || err.response?.data?.mensaje || "Error al actualizar la reserva de evento";
      setError(errorMessage);
      setIsUpdating(false);
      throw err;
    }
  };

  const resetState = () => {
    setError(null);
  };

  return { 
    updateReservaEvento: updateReservaEventoHook, 
    isUpdating, 
    error,
    resetState 
  };
};