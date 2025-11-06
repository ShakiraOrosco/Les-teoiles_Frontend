// src/hooks/AdReserva/Reservas_Eventos/useEventos.ts
import { useState, useEffect } from "react";
import { getReservasEvento, getReservaEventoById } from "../../../services/AdReservas/Reserva_Eventos/Reserva_Eventos_Services";
import { ReservaEvento, ListaReservasEventoResponse } from "../../../types/AdReserva/Reservas_Eventos/eventos";

export const useEventos = () => {
  const [eventos, setEventos] = useState<ReservaEvento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventos = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Hook Use - Obteniendo lista de eventos');
      const response: ListaReservasEventoResponse = await getReservasEvento();
      console.log('✅ Hook Use - Eventos recibidos:', response);
      setEventos(response.reservas || []);
      setLoading(false);
      return response;
    } catch (err: any) {
      console.error('❌ Hook Use - Error al obtener eventos:', err);
      const errorMessage = err.response?.data?.error || "Error al obtener las reservas de evento";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const fetchEventoById = async (id: number): Promise<ReservaEvento> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🔄 Hook Use - Obteniendo evento con ID: ${id}`);
      const evento = await getReservaEventoById(id);
      console.log('✅ Hook Use - Evento recibido:', evento);
      setLoading(false);
      return evento;
    } catch (err: any) {
      console.error(`❌ Hook Use - Error al obtener evento ${id}:`, err);
      const errorMessage = err.response?.data?.error || "Error al obtener la reserva de evento";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  // Cargar eventos automáticamente al usar el hook
  useEffect(() => {
    fetchEventos();
  }, []);

  return { 
    eventos, 
    loading, 
    error, 
    refetch: fetchEventos,
    getEventoById: fetchEventoById 
  };
};