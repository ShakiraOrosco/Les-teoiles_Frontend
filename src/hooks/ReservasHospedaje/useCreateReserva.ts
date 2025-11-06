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

      // 🔹 CAPTURAR EL ERROR COMPLETO DEL BACKEND
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        
        // Si el servidor devolvió HTML en lugar de JSON
        if (contentType && contentType.includes('text/html')) {
          throw new Error(`Error del servidor (${response.status}): No se pudo procesar la solicitud`);
        }
        
        // Intentar parsear la respuesta JSON del backend
        try {
          const errorData = await response.json();
          
          // 🔹 CONSTRUIR MENSAJE DE ERROR AMIGABLE Y COMPLETO
          let mensajeError = '';
          
          // 1. Capturar el mensaje principal del error
          if (errorData.error) {
            mensajeError = errorData.error;
          } else if (errorData.message) {
            mensajeError = errorData.message;
          } else if (errorData.detail) {
            mensajeError = errorData.detail;
          } else {
            // Si no hay mensaje específico, dar uno genérico basado en el código
            switch (response.status) {
              case 400:
                mensajeError = 'Los datos enviados no son válidos';
                break;
              case 404:
                mensajeError = 'No hay habitaciones disponibles con las características seleccionadas';
                break;
              case 409:
                mensajeError = 'La habitación no está disponible para las fechas solicitadas';
                break;
              case 408:
                mensajeError = 'Tiempo de espera agotado. Por favor, intenta nuevamente';
                break;
              default:
                mensajeError = 'Error al procesar la reserva';
            }
          }
          
          // 2. Agregar detalles adicionales si existen
          if (errorData.detalle && typeof errorData.detalle === 'string') {
            mensajeError += `\n\n${errorData.detalle}`;
          }
          
          // 3. Agregar información de debug si existe (solo en desarrollo)
          if (errorData.info_debug) {
            mensajeError += '\n\nInformación adicional:';
            if (errorData.info_debug.mensaje) {
              mensajeError += `\n• ${errorData.info_debug.mensaje}`;
            }
            if (errorData.info_debug.solicitudes_conflictivas !== undefined) {
              mensajeError += `\n• Solicitudes en competencia: ${errorData.info_debug.solicitudes_conflictivas}`;
            }
            if (errorData.info_debug.tu_prioridad !== undefined) {
              mensajeError += `\n• Tu prioridad: ${errorData.info_debug.tu_prioridad}`;
            }
            if (errorData.info_debug.prioridad_ganadora !== undefined && errorData.info_debug.prioridad_ganadora !== null) {
              mensajeError += `\n• Prioridad ganadora: ${errorData.info_debug.prioridad_ganadora}`;
            }
          }
          
          // 4. Agregar información del detalle del rechazo si existe
          if (errorData.detalle && typeof errorData.detalle === 'object') {
            if (errorData.detalle.prioridad_ganadora !== undefined) {
              mensajeError += `\n\nOtra reserva con mayor prioridad fue aceptada:`;
              mensajeError += `\n• Prioridad ganadora: ${errorData.detalle.prioridad_ganadora}`;
              mensajeError += `\n• Tu prioridad: ${errorData.detalle.prioridad_perdedora}`;
              if (errorData.detalle.diferencia_prioridad !== undefined) {
                mensajeError += `\n• Diferencia: ${errorData.detalle.diferencia_prioridad} puntos`;
              }
            }
          }
          
          // 5. NO incluir el código de error en el mensaje principal
          // Solo agregarlo como contexto si es necesario
          console.error('Código de error:', response.status);
          console.error('Código interno:', errorData.codigo);
          
          throw new Error(mensajeError);
          
        } catch (jsonError) {
          // Si no se puede parsear el JSON, usar mensaje genérico mejorado
          if (jsonError instanceof Error && jsonError.message && !jsonError.message.includes('JSON')) {
            throw jsonError; // Re-lanzar el error construido arriba
          }
          
          // Error al parsear JSON - dar mensaje más amigable
          let mensajeGenerico = '';
          switch (response.status) {
            case 400:
              mensajeGenerico = 'Los datos enviados no son válidos. Por favor, verifica la información ingresada.';
              break;
            case 404:
              mensajeGenerico = 'No hay habitaciones disponibles con las características seleccionadas para las fechas indicadas.';
              break;
            case 409:
              mensajeGenerico = 'La habitación no está disponible para las fechas solicitadas. Por favor, intenta con otras fechas.';
              break;
            case 408:
              mensajeGenerico = 'El tiempo de espera se agotó. Por favor, intenta realizar la reserva nuevamente.';
              break;
            case 500:
              mensajeGenerico = 'Error interno del servidor. Por favor, contacta con soporte.';
              break;
            default:
              mensajeGenerico = `Error al procesar la solicitud. Por favor, intenta nuevamente.`;
          }
          
          throw new Error(mensajeGenerico);
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
      throw err; // Re-lanzar para que el componente pueda capturarlo
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