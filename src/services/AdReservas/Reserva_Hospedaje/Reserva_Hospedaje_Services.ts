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