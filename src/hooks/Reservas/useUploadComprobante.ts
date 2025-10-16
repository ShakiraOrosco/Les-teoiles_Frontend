import { useState } from 'react';

interface ReservaData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  carnet: string;
  email: string;
  cantidadPersonas: string;
  amoblado: string;
  banoPrivado: string;
  fechaInicio: string;
  fechaFin: string;
}

interface ReservaResponse {
  mensaje: string;
  reserva: any;
  cliente_id: number;
  habitacion_id: number;
  reserva_gen_id: number;
}

interface UseCreateReservaReturn {
  crearReserva: (data: ReservaData) => Promise<ReservaResponse | null>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}

export const useCreateReserva = (): UseCreateReservaReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://proyecto-iii-les-toiles-de-l-eau.vercel.app/api';

  const crearReserva = async (data: ReservaData): Promise<ReservaResponse | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const reservaData = {
        nombre: data.nombre,
        app_paterno: data.apellidoPaterno,
        app_materno: data.apellidoMaterno,
        telefono: data.telefono,
        ci: data.carnet,
        email: data.email,
        cant_personas: data.cantidadPersonas,
        amoblado: data.amoblado === 'si' ? 'S' : 'N',
        baño_priv: data.banoPrivado === 'si' ? 'S' : 'N',
        fecha_ini: data.fechaInicio,
        fecha_fin: data.fechaFin,
        estado: 'A'
      };

      console.log('Enviando datos al backend:', reservaData);
      console.log('URL de la API:', `${API_URL}/reservas-hotel/`);

      const response = await fetch(`${API_URL}/reservas-hotel/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData),
      });

      const text = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(text);
      } catch {
        throw new Error(`Respuesta inválida del servidor: ${text.slice(0, 200)}...`);
      }

      if (!response.ok) {
        throw new Error(responseData?.error || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('Respuesta del backend:', responseData);
      setSuccess(true);
      return responseData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear la reserva';
      setError(errorMessage);
      console.error('Error creating reservation:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  };

  return { crearReserva, isLoading, error, success, resetState };
};