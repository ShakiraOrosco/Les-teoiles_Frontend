// src/services/Habitacion/habitacionService.ts
import api from "../../axios";
import { Habitacion, HabitacionDTO } from "../../../types/Bienes/Habitacion/habitacion";

// Obtener todas las habitaciones
export const getHabitaciones = async (): Promise<Habitacion[]> => {
  const response = await api.get<Habitacion[]>("/habitaciones/");
  return response.data;
};

// Crear una nueva habitación
export const createHabitacion = async (data: HabitacionDTO): Promise<Habitacion> => {
  const response = await api.post<Habitacion>("/habitacion/crear/", data);
  return response.data;
};

// Editar una habitación
export const editHabitacion = async (id: number, data: HabitacionDTO): Promise<Habitacion> => {
  const response = await api.put<Habitacion>(`/habitaciones/${id}/`, data);
  return response.data;
};

// Cambiar estado de la habitación
export const toggleEstadoHabitacion = async (id: number): Promise<Habitacion> => {
  const response = await api.patch<Habitacion>(`/habitaciones/${id}/toggle_estado/`);
  return response.data;
};
