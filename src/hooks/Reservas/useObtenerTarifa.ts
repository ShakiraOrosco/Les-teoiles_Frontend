// hooks/Reservas/useObtenerTarifa.ts
import { useState, useEffect } from 'react';

interface Tarifa {
  id_tarifa_hotel: number;
  nombre: string;
  descripcion: string;
  amoblado: string;
  baño_priv: string;
  precio_persona: number;
}

interface UseObtenerTarifaReturn {
  tarifas: Tarifa[];
  isLoading: boolean;
  error: string | null;
  obtenerPrecioPorPersona: (amoblado: string, banoPriv: string) => number | null;
}

export const useObtenerTarifa = (): UseObtenerTarifaReturn => {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const obtenerTarifas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/reservaHotel/tarifa/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener tarifas: ${response.status}`);
        }

        const data = await response.json();
        setTarifas(data);
        console.log('Tarifas obtenidas:', data);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        console.error('Error fetching tarifas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerTarifas();
  }, [API_URL]);

  const obtenerPrecioPorPersona = (amoblado: string, banoPriv: string): number | null => {
    // Convertir 'si'/'no' a 'S'/'N' para comparar con la BD
    const amobl = amoblado === 'si' ? 'S' : 'N';
    const bano = banoPriv === 'si' ? 'S' : 'N';

    const tarifaEncontrada = tarifas.find(
      (t) => t.amoblado === amobl && t.baño_priv === bano
    );

    return tarifaEncontrada ? tarifaEncontrada.precio_persona : null;
  };

  return {
    tarifas,
    isLoading,
    error,
    obtenerPrecioPorPersona,
  };
};