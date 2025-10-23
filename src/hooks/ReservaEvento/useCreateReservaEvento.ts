// hooks/ReservaEvento/useCreateReservaEvento.ts
import { useState } from 'react';

interface FormDataEvento {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  carnet: string;
  fechaEvento: string;
  horaInicio: string;
  horaFin: string;
  cantidadPersonas: string;
  tipoReserva: string;
  serviciosAdicionales: (string | number)[];
}


interface UseCreateReservaEventoReturn {
  crearReservaEvento: (formData: FormDataEvento) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}

export const useCreateReservaEvento = (): UseCreateReservaEventoReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const crearReservaEvento = async (formData: FormDataEvento): Promise<any> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validaciones básicas
      if (!formData.nombre.trim() || !formData.telefono.trim() || !formData.email.trim() || 
          !formData.carnet.trim() || !formData.fechaEvento || !formData.horaInicio || 
          !formData.horaFin || !formData.cantidadPersonas || !formData.tipoReserva) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      // Construir fecha-hora ISO para el backend
      const horaIniISO = `${formData.fechaEvento}T${formData.horaInicio}:00`;
      const horaFinISO = `${formData.fechaEvento}T${formData.horaFin}:00`;

      // Mapear campos: Frontend → Backend
      const datosParaBackend = {
        nombre: formData.nombre,
        app_paterno: formData.apellidoPaterno,
        app_materno: formData.apellidoMaterno,
        telefono: formData.telefono,
        ci: formData.carnet,
        email: formData.email,
        cant_personas: formData.cantidadPersonas,
        fecha: formData.fechaEvento,
        hora_ini: horaIniISO,
        hora_fin: horaFinISO,
        servicios_adicionales: formData.serviciosAdicionales, // Array de IDs
        estado: 'A' // Estado por defecto
      };

      console.log('Enviando datos al backend:', datosParaBackend);

      const response = await fetch(`${API_URL}/reservaEvento/registrar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaBackend),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          
          // Manejo especial para conflictos de disponibilidad
          if (response.status === 409) {
            const serviciosNoDisponibles = errorData.servicios_no_disponibles || [];
            const mensajesConflicto = serviciosNoDisponibles.map((s: any) => 
              `${s.nombre_servicio} no disponible`
            ).join(', ');
            throw new Error(`${errorData.error}. ${mensajesConflicto}`);
          }
          
          throw new Error(errorData.error || errorData.message || `Error ${response.status}`);
        }
        
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setSuccess(true);
      console.log('Reserva de evento creada exitosamente:', result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear la reserva de evento';
      setError(errorMessage);
      console.error('Error creating event reservation:', err);
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
    crearReservaEvento,
    isLoading,
    error,
    success,
    resetState
  };
};