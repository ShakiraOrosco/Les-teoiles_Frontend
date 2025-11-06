// hooks/ReservaEvento/useUploadComprobanteEvento.ts
import { useState } from 'react';

interface UseUploadComprobanteEventoReturn {
  subirComprobante: (id_reserva_gen: number, archivo: File) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}

export const useUploadComprobanteEvento = (): UseUploadComprobanteEventoReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const subirComprobante = async (id_reserva_gen: number, archivo: File): Promise<any> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('pago', archivo);

      console.log('Subiendo comprobante para reserva_gen_id:', id_reserva_gen);
      console.log('Archivo:', archivo.name, archivo.type, archivo.size);

      const response = await fetch(`${API_URL}/reservaEvento/comprobante/${id_reserva_gen}/`, {
        method: 'POST',
        body: formData,
        // No incluir Content-Type, el navegador lo configura automáticamente
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
      console.log('Comprobante subido exitosamente:', result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al subir el comprobante';
      setError(errorMessage);
      console.error('Error uploading comprobante:', err);
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
    subirComprobante,
    isLoading,
    error,
    success,
    resetState
  };
};