import api from "../../axios";
import { ServicioAdicional } from "../../../types/Bienes/Servicios/servicio";

// 🔹 Obtener todos los servicios
export const getServicios = async (): Promise<ServicioAdicional[]> => {
  const response = await api.get<ServicioAdicional[]>("/servicios/");
  return response.data;
};

// 🔹 Crear un nuevo servicio
export const createServicio = async (nuevoServicio: Partial<ServicioAdicional>) => {
  const response = await api.post("/servicios/crear/", nuevoServicio);
  return response.data;
};

// 🔹 Obtener detalle de un servicio
export const getServicioById = async (id_servicio: number): Promise<ServicioAdicional> => {
  const response = await api.get<ServicioAdicional>(`/servicios/${id_servicio}/`);
  return response.data;
};

// 🔹 Editar un servicio
export const editServicio = async (
  id_servicio: number,
  data: Partial<ServicioAdicional>
): Promise<ServicioAdicional> => {
  const response = await api.put<ServicioAdicional>(
    `/servicios/${id_servicio}/update/`,
    data
  );
  return response.data;
};

// 🔹 Eliminar (lógico o físico según backend)
export const deleteServicio = async (id_servicio: number): Promise<void> => {
  await api.delete(`/servicios/${id_servicio}/delete/`);
};

// 🔹 Cambiar estado (activar / desactivar)
export const toggleServicioEstado = async (
  id_servicio: number,
  nuevoEstado: "A" | "I"
): Promise<void> => {
  await api.patch(`/servicios/${id_servicio}/update/`, { estado: nuevoEstado });
};
