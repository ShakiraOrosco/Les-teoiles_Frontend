// src/services/Habitacion/habitacionService.ts
import api from "../../axios";
import { Habitacion } from "../../../types/Bienes/Habitacion/habitacion";

// Obtener todas las habitaciones
export const getHabitaciones = async (): Promise<Habitacion[]> => {
  const response = await api.get<Habitacion[]>("/habitaciones/");
  return response.data;
};

// * === SERVICIO PARA CREAR UN NUEVO HABITACION === * //
export const createHabitacion = async (nuevaHabitacion: Partial<Habitacion>) => {
  const response = await api.post("/habitaciones/crear/", nuevaHabitacion);
  return response.data;
};

// Obtener detalle de una habitación
export const getHabitacionById = async (id: number): Promise<Habitacion> => {
  const response = await api.get<Habitacion>(`/habitaciones/${id}/`);
  return response.data;
};

// Editar una habitación
export const editHabitacion = async (id: number, data: Partial<Habitacion>): Promise<Habitacion> => {
  const response = await api.put<Habitacion>(`/habitaciones/${id}/update/`, data);
  return response.data;
};

// Cambiar estado de la habitación
export const toggleEstadoHabitacion = async (id: number): Promise<Habitacion> => {
  const response = await api.patch<Habitacion>(`/habitaciones/${id}/toggle_estado/`);
  return response.data;
};
