// hooks/ReservaEvento/useVerificarDisponibilidad.ts
import { useState } from 'react';

interface VerificarDisponibilidadParams {
  servicios_ids: number[];
  fecha: string;
  hora_ini: string;
  hora_fin: string;
}

interface UseVerificarDisponibilidadReturn {
  verificarDisponibilidad: (params: VerificarDisponibilidadParams) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export const useVerificarDisponibilidad = (): UseVerificarDisponibilidadReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const verificarDisponibilidad = async (params: VerificarDisponibilidadParams): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      // Construir fecha-hora ISO
      const horaIniISO = `${params.fecha}T${params.hora_ini}:00`;
      const horaFinISO = `${params.fecha}T${params.hora_fin}:00`;

      const body = {
        servicios_ids: params.servicios_ids,
        fecha: params.fecha,
        hora_ini: horaIniISO,
        hora_fin: horaFinISO
      };

      console.log('Verificando disponibilidad:', body);

      const response = await fetch(`${API_URL}/reservaEvento/verificar-disponibilidad/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error al verificar disponibilidad: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resultado de disponibilidad:', result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al verificar disponibilidad';
      setError(errorMessage);
      console.error('Error verificando disponibilidad:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verificarDisponibilidad,
    isLoading,
    error,
  };
};