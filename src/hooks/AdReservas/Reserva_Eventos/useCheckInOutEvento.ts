// hooks/AdReservas/Reserva_Evento/useCheckInOutEvento.ts
import { useState } from 'react';
import { 
  realizarCheckInEvento, 
  realizarCheckOutEvento, 
  cancelarCheckInEvento 
} from '../../../services/AdReservas/Reserva_Eventos/Reserva_Eventos_Services';

export const useCheckInOutEvento = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const realizarCheckIn = async (reservaId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const resultado = await realizarCheckInEvento(reservaId);
      return resultado;
    } catch (err: any) {
      const errorMessage = err.message || 'No se pudo realizar el ingreso. El backend necesita configuración CORS.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const realizarCheckOut = async (reservaId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const resultado = await realizarCheckOutEvento(reservaId);
      return resultado;
    } catch (err: any) {
      const errorMessage = err.message || 'No se pudo realizar la salida. El backend necesita configuración CORS.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelarCheckIn = async (reservaId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const resultado = await cancelarCheckInEvento(reservaId);
      return resultado;
    } catch (err: any) {
      const errorMessage = err.message || 'No se pudo cancelar el ingreso. El backend necesita configuración CORS.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    realizarCheckIn,
    realizarCheckOut,
    cancelarCheckIn,
    isLoading,
    error,
    clearError,
  };
};