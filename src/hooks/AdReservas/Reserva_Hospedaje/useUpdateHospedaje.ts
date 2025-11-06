// src/hooks/AdReservas/Reserva_Hospedaje/useUpdateHospedaje.ts
import { useState } from "react";
import * as reservaHotelService from "../../../services/AdReservas/Reserva_Hospedaje/Reserva_Hospedaje_Services";
import { ReservaHotel } from "../../../types/AdReserva/Reserva_Hospedaje/hospedaje";
import { toast } from "sonner";

// Tipo flexible para la actualización
type ReservaParaActualizar = ReservaHotel & {
  nombre?: string;
  app_paterno?: string;
  app_materno?: string;
  telefono?: number;
  ci?: number;
  email?: string;
};

export function useUpdateHospedaje() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReservaHotel = async (reserva: ReservaParaActualizar): Promise<ReservaHotel | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log('📤 Reserva recibida en hook:', reserva);

      // Preparar datos para enviar al backend
      const datosParaEnviar: any = {};

      // Datos del cliente
      if (reserva.nombre !== undefined) datosParaEnviar.nombre = reserva.nombre;
      if (reserva.app_paterno !== undefined) datosParaEnviar.app_paterno = reserva.app_paterno;
      if (reserva.app_materno !== undefined) datosParaEnviar.app_materno = reserva.app_materno;
      if (reserva.telefono !== undefined) datosParaEnviar.telefono = reserva.telefono;
      if (reserva.ci !== undefined) datosParaEnviar.ci = reserva.ci;
      if (reserva.email !== undefined) datosParaEnviar.email = reserva.email;

      // Datos de la reserva
      if (reserva.cant_personas !== undefined) datosParaEnviar.cant_personas = reserva.cant_personas;
      if (reserva.fecha_ini !== undefined) datosParaEnviar.fecha_ini = reserva.fecha_ini;
      if (reserva.fecha_fin !== undefined) datosParaEnviar.fecha_fin = reserva.fecha_fin;
      if (reserva.estado !== undefined) datosParaEnviar.estado = reserva.estado;
      if (reserva.amoblado !== undefined) datosParaEnviar.amoblado = reserva.amoblado;
      if (reserva.baño_priv !== undefined) datosParaEnviar.baño_priv = reserva.baño_priv;

      // IDs relacionados
      if (reserva.datos_cliente !== undefined) {
        if (typeof reserva.datos_cliente === 'object') {
          datosParaEnviar.datos_cliente = reserva.datos_cliente.id_datos_cliente;
        } else {
          datosParaEnviar.datos_cliente = reserva.datos_cliente;
        }
      }

      if (reserva.reservas_gen !== undefined) {
        if (typeof reserva.reservas_gen === 'object') {
          datosParaEnviar.reservas_gen = reserva.reservas_gen.id_reservas_gen;
        } else {
          datosParaEnviar.reservas_gen = reserva.reservas_gen;
        }
      }

      if (reserva.habitacion !== undefined) {
        if (typeof reserva.habitacion === 'object') {
          datosParaEnviar.habitacion = reserva.habitacion.id_habitacion;
        } else {
          datosParaEnviar.habitacion = reserva.habitacion;
        }
      }

      console.log('🚀 Datos que se enviarán al backend:', datosParaEnviar);

      // Verificar que tenemos un ID válido
      if (!reserva.id_reserva_hotel) {
        throw new Error("ID de reserva no válido");
      }

      const updated = await reservaHotelService.updateReservaHotel(
        reserva.id_reserva_hotel, 
        datosParaEnviar
      );
      
      toast.success("Reserva actualizada exitosamente");
      return updated;
    } catch (err: any) {
      const backendError = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message ||
                          "Error al actualizar la reserva";

      console.error('❌ Error en updateReservaHotel:', err.response?.data);

      // Manejar errores específicos
      if (backendError.includes("No se puede modificar una reserva")) {
        toast.error("No se puede modificar una reserva en estado finalizado o cancelado");
      } else if (backendError.includes("habitación no disponible")) {
        toast.error("La habitación seleccionada no está disponible en las fechas indicadas");
      } else if (backendError.includes("fecha de inicio")) {
        toast.error("La fecha de inicio no puede ser anterior a hoy");
      } else if (backendError.includes("fecha de fin")) {
        toast.error("La fecha de fin debe ser posterior a la fecha de inicio");
      } else if (backendError.includes("No hay habitaciones disponibles")) {
        toast.error("No hay habitaciones disponibles con las características seleccionadas");
      } else if (backendError.includes("No se proporcionaron campos válidos")) {
        toast.error("No se realizaron cambios válidos en la reserva");
      } else if (backendError.includes("campos_faltantes")) {
        toast.error("Faltan datos requeridos para actualizar el cliente");
      } else if (backendError.includes("Formato de fecha inválido")) {
        toast.error("El formato de fecha debe ser YYYY-MM-DD");
      } else if (backendError.includes("Estado inválido")) {
        toast.error("Estado de reserva no válido");
      } else {
        toast.error(backendError);
      }

      setError(backendError);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateReservaHotel,
    isUpdating,
    error,
  };
}