// hooks/ReservaEvento/useServiciosAdicionales.ts
import { useState, useEffect } from 'react';

interface ServicioAdicional {
  id_servicios_adicionales: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: string;
}

interface UseServiciosAdicionalesReturn {
  servicios: ServicioAdicional[];
  isLoading: boolean;
  error: string | null;
}

export const useServiciosAdicionales = (): UseServiciosAdicionalesReturn => {
  const [servicios, setServicios] = useState<ServicioAdicional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const obtenerServicios = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/reservaEvento/servicios-adicionales/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener servicios adicionales: ${response.status}`);
        }

        const data = await response.json();
        
        // Convertir precio de string a number
        const serviciosConPrecioNumerico = data.map((servicio: any) => ({
          ...servicio,
          precio: parseFloat(servicio.precio) || 0
        }));
        
        setServicios(serviciosConPrecioNumerico);
        console.log('Servicios adicionales obtenidos:', serviciosConPrecioNumerico);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        console.error('Error fetching servicios adicionales:', err);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerServicios();
  }, [API_URL]);

  return {
    servicios,
    isLoading,
    error,
  };
};