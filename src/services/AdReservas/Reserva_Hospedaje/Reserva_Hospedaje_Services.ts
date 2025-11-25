// src/services/AdReservas/Reserva_Hospedaje/Reserva_Hospedaje_Services.ts
import api from "../../axios";
import { ReservaHotel } from "../../../types/AdReserva/Reserva_Hospedaje/hospedaje";

// Obtener todas las reservas
export const getReservasHotel = async (): Promise<ReservaHotel[]> => {
  const response = await api.get<ReservaHotel[]>("/reservaHotel/reservas/");
  return response.data;
};

// Obtener una reserva por ID
export const getReservaHotelById = async (id: number): Promise<ReservaHotel> => {
  const response = await api.get(`/reservaHotel/reservas/${id}/`);
  return response.data;
};

// Crear nueva reserva
export const createReservaHotel = async (nuevaReserva: Partial<ReservaHotel>) => {
  const response = await api.post("/reservaHotel/registrar/", nuevaReserva);
  return response.data;
};

// Actualizar reserva
export const updateReservaHotel = async (id: number, data: any): Promise<ReservaHotel> => {
  const response = await api.put(`/reservaHotel/reservas/${id}/actualizar/`, data);
  return response.data;
};

// Eliminar/Cancelar reserva
export const deleteReservaHotel = async (id: number): Promise<void> => {
  const response = await api.delete(`/reservaHotel/reservas/${id}/eliminar/`);
  return response.data;
};

// Obtener reservas por estado
export const getReservasByEstado = async (estado: string): Promise<ReservaHotel[]> => {
  const response = await api.get<ReservaHotel[]>(`/reservaHotel/reservas/estado/${estado}/`);
  return response.data;
};

// Obtener reservas por cliente
export const getReservasByCliente = async (clienteId: number): Promise<ReservaHotel[]> => {
  const response = await api.get<ReservaHotel[]>(`/reservaHotel/reservas/cliente/${clienteId}/`);
  return response.data;
};

// Obtener habitaciones disponibles
export const getHabitacionesDisponibles = async (): Promise<any[]> => {
  const response = await api.get<any[]>("/reservaHotel/habitaciones/disponibles/");
  return response.data;
};

// Obtener tarifas del hotel
export const getTarifasHotel = async (): Promise<any[]> => {
  const response = await api.get<any[]>("/reservaHotel/tarifa/");
  return response.data;
};

// Subir comprobante de pago
export const uploadComprobante = async (idReservaGen: number, archivo: File): Promise<any> => {
  const formData = new FormData();
  formData.append('pago', archivo);

  const response = await api.post(`/reservaHotel/reservas/${idReservaGen}/subir-comprobante/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ==============================================
// 🔹 CHECK-IN / CHECK-OUT SERVICES
// ==============================================

// ==============================================
// 🔹 CHECK-IN / CHECK-OUT SERVICES - SOLUCIÓN DIRECTA
// ==============================================

// Realizar check-in - SOLUCIÓN DIRECTA
// ==============================================
// 🔹 CHECK-IN / CHECK-OUT SERVICES - SIN TOKEN
// ==============================================

// Reserva_Hospedaje_Services.ts - VERSIÓN MEJORADA
export const realizarCheckIn = async (reservaId: number) => {
  try {
    console.log(`🔄 Iniciando check-in para reserva: ${reservaId}`);
    
    const response = await fetch(
      `https://proyecto-iii-les-toiles-de-l-eau.vercel.app/api/reservaHotel/${reservaId}/check-in/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ⚠️ NO necesitas Authorization porque la vista tiene AllowAny
        },
      }
    );

    console.log(`📊 Response status: ${response.status}`);
    console.log(`📊 Response ok: ${response.ok}`);
    
    // Obtener el texto de respuesta para debug
    const responseText = await response.text();
    console.log(`📋 Response body: ${responseText}`);
    
    if (!response.ok) {
      // Intentar parsear como JSON, si falla usar el texto
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { detail: responseText };
      }
      
      console.error('❌ Error response data:', errorData);
      
      if (response.status === 403) {
        throw new Error(`Error 403: Acceso denegado. ${errorData.detail || errorData.error || 'Sin detalles'}`);
      }
      
      throw new Error(`Error ${response.status}: ${errorData.detail || errorData.error || JSON.stringify(errorData)}`);
    }

    // Parsear la respuesta exitosa
    const data = JSON.parse(responseText);
    console.log('✅ Check-in exitoso:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error en realizarCheckIn:', error);
    throw error;
  }
};

// Realizar check-out - SIN TOKEN
export const realizarCheckOut = async (idReserva: number): Promise<any> => {
  try {
    console.log('🔧 Enviando check-out SIN token...');
    
    const response = await fetch(
      `https://proyecto-iii-les-toiles-de-l-eau.vercel.app/api/reservaHotel/${idReserva}/check-out/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error: any) {
    console.error('❌ Error en realizarCheckOut:', error);
    throw new Error('No se pudo realizar el check-out. El backend necesita configuración CORS.');
  }
};

// Cancelar check-in - SIN TOKEN
export const cancelarCheckIn = async (idReserva: number): Promise<any> => {
  try {
    console.log('🔧 Cancelando check-in SIN token...');
    
    const response = await fetch(
      `https://proyecto-iii-les-toiles-de-l-eau.vercel.app/api/reservaHotel/${idReserva}/check-in/cancelar/`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error: any) {
    console.error('❌ Error en cancelarCheckIn:', error);
    throw new Error('No se pudo cancelar el check-in. El backend necesita configuración CORS.');
  }
};

// Obtener reservas pendientes de check-in
export const getReservasPendientesCheckIn = async (): Promise<any[]> => {
  const response = await api.get('/reservaHotel/reservas/pendientes-check-in/');
  return response.data.reservas || [];
};

// Obtener reservas pendientes de check-out
export const getReservasPendientesCheckOut = async (): Promise<any[]> => {
  const response = await api.get('/reservaHotel/reservas/pendientes-check-out/');
  return response.data.reservas || [];
};
