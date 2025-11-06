// src/hooks/AdReserva/Reservas_Eventos/useToggleEvento.ts
import { useState } from "react";
import { deleteReservaEvento, updateReservaEvento } from "../../../services/AdReservas/Reserva_Eventos/Reserva_Eventos_Services";
import { EstadoReservaEvento } from "../../../types/AdReserva/Reservas_Eventos/eventos";

export const useToggleEvento = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelarEvento = async (id: number): Promise<{ mensaje: string }> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🔄 Hook Toggle - Cancelando evento ID: ${id}`);
      const resultado = await deleteReservaEvento(id);
      console.log('✅ Hook Toggle - Evento cancelado:', resultado);
      setLoading(false);
      return resultado;
    } catch (err: any) {
      console.error(`❌ Hook Toggle - Error al cancelar evento ${id}:`, err);
      const errorMessage = err.response?.data?.error || err.response?.data?.mensaje || "Error al cancelar la reserva de evento";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const cambiarEstadoEvento = async (id: number, nuevoEstado: EstadoReservaEvento): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🔄 Hook Toggle - Cambiando estado del evento ID: ${id} a ${nuevoEstado}`);
      const resultado = await updateReservaEvento(id, { estado: nuevoEstado });
      console.log('✅ Hook Toggle - Estado cambiado:', resultado);
      setLoading(false);
      return resultado;
    } catch (err: any) {
      console.error(`❌ Hook Toggle - Error al cambiar estado del evento ${id}:`, err);
      const errorMessage = err.response?.data?.error || err.response?.data?.mensaje || "Error al cambiar el estado de la reserva";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  // Métodos específicos para cada estado
  const activarEvento = async (id: number): Promise<any> => {
    return cambiarEstadoEvento(id, 'A');
  };

  const ponerPendienteEvento = async (id: number): Promise<any> => {
    return cambiarEstadoEvento(id, 'P');
  };

  const finalizarEvento = async (id: number): Promise<any> => {
    return cambiarEstadoEvento(id, 'F');
  };

  return { 
    cancelarEvento, 
    cambiarEstadoEvento,
    activarEvento,
    ponerPendienteEvento,
    finalizarEvento,
    loading, 
    error 
  };
};