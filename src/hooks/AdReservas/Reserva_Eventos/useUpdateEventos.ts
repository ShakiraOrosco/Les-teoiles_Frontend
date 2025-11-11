// src/hooks/AdReserva/Reservas_Eventos/useUpdateEvento.ts
import { useState } from "react";
import { updateReservaEvento } from "../../../services/AdReservas/Reserva_Eventos/Reserva_Eventos_Services";
import { ActualizarReservaEventoDTO, ActualizarReservaEventoResponse } from "../../../types/AdReserva/Reservas_Eventos/eventos";

export const useUpdateEvento = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // En tu hook useUpdateEvento, modifica para más logging:
  const updateReservaEventoHook = async (id: number, datosActualizados: ActualizarReservaEventoDTO): Promise<ActualizarReservaEventoResponse> => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log('🔄 Hook Update - Actualizando evento ID:', id);
      console.log('📤 Hook Update - Datos a enviar:', datosActualizados);

      const resultado = await updateReservaEvento(id, datosActualizados);

      console.log('✅ Hook Update - Respuesta recibida:', resultado);

      if (!resultado) {
        throw new Error('La respuesta del servidor está vacía');
      }

      setIsUpdating(false);
      return resultado;
    } catch (err: any) {
      console.error('❌ Hook Update - Error completo:', err);
      console.error('❌ Hook Update - Status:', err.response?.status);
      console.error('❌ Hook Update - Data:', err.response?.data);
      console.error('❌ Hook Update - Headers:', err.response?.headers);

      const errorMessage = err.response?.data?.error ||
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar la reserva de evento";

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