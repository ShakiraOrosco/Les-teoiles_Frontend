// hooks/Reservas/useCreateReserva.ts
import { useState } from 'react';

interface FormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  carnet: string;
  fechaInicio: string;
  fechaFin: string;
  cantidadPersonas: string;
  amoblado: string;
  banoPrivado: string;
}

interface UseCreateReservaReturn {
  crearReserva: (formData: FormData) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}

export const useCreateReserva = (): UseCreateReservaReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const crearReserva = async (formData: FormData): Promise<any> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validaciones básicas
      if (!formData.nombre.trim() || !formData.telefono.trim() || !formData.email.trim() || 
          !formData.carnet.trim() || !formData.fechaInicio || !formData.fechaFin || 
          !formData.cantidadPersonas) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      // 🔹 MAPEAR CAMPOS: Frontend → Backend
      const datosParaBackend = {
        nombre: formData.nombre,
        app_paterno: formData.apellidoPaterno,
        app_materno: formData.apellidoMaterno,
        telefono: formData.telefono,
        ci: formData.carnet,
        email: formData.email,
        cant_personas: formData.cantidadPersonas,
        fecha_ini: formData.fechaInicio,
        fecha_fin: formData.fechaFin,
        amoblado: formData.amoblado === 'si' ? 'S' : 'N',
        baño_priv: formData.banoPrivado === 'si' ? 'S' : 'N'
      };

      console.log('Enviando datos al backend:', datosParaBackend);

      const response = await fetch(`${API_URL}/reservaHotel/registrar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaBackend),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
        
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || `Error ${response.status}`);
        } catch (jsonError) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      const result = await response.json();
      setSuccess(true);
      console.log('Reserva creada exitosamente:', result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear la reserva';
      setError(errorMessage);
      console.error('Error creating reservation:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    crearReserva,
    isLoading,
    error,
    success,
    resetState
  };
};