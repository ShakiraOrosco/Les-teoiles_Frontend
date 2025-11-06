// src/services/Eventos/eventoService.ts
import api from "../../axios";
import {
  ReservaEvento,
  CrearReservaEventoDTO,
  ActualizarReservaEventoDTO,
  CrearReservaEventoResponse,
  ActualizarReservaEventoResponse,
  VerificarDisponibilidadRequest,
  VerificarDisponibilidadResponse,
  HorariosOcupadosResponse,
  ServicioAdicional,
  ListaReservasEventoResponse,
  ReservasPorEstadoResponse,
  ReservasPorClienteResponse,
  EstadisticasCola
} from "../../../types/AdReserva/Reservas_Eventos/eventos.ts";

// ======== SERVICIOS ADICIONALES ========

// Obtener todos los servicios adicionales activos
export const getServiciosAdicionales = async (): Promise<ServicioAdicional[]> => {
  const response = await api.get<ServicioAdicional[]>("/reservaEvento/servicios-adicionales/");
  return response.data;
};

// ======== VERIFICACIÓN DE DISPONIBILIDAD ========

// Verificar disponibilidad de servicios
export const verificarDisponibilidad = async (
  data: VerificarDisponibilidadRequest
): Promise<VerificarDisponibilidadResponse> => {
  const response = await api.post<VerificarDisponibilidadResponse>(
    "/reservaEvento/verificar-disponibilidad/", 
    data
  );
  return response.data;
};

// Obtener horarios ocupados
export const getHorariosOcupados = async (params?: {
  servicio_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
}): Promise<HorariosOcupadosResponse> => {
  const response = await api.get<HorariosOcupadosResponse>(
    "/reservaEvento/horarios-ocupados/", 
    { params }
  );
  return response.data;
};

// ======== GESTIÓN DE RESERVAS ========

// Registrar nueva reserva de evento (con sistema de cola)
export const createReservaEvento = async (
  reservaData: CrearReservaEventoDTO
): Promise<CrearReservaEventoResponse> => {
  const response = await api.post<CrearReservaEventoResponse>(
    "/reservaEvento/registrar/", 
    reservaData
  );
  return response.data;
};

// Obtener todas las reservas de eventos
export const getReservasEvento = async (): Promise<ListaReservasEventoResponse> => {
  const response = await api.get<ListaReservasEventoResponse>("/reservaEvento/listar/");
  return response.data;
};

// Obtener detalle de una reserva específica
export const getReservaEventoById = async (id_reserva: number): Promise<ReservaEvento> => {
  const response = await api.get<ReservaEvento>(`/reservaEvento/detallar/${id_reserva}/`);
  return response.data;
};

// Actualizar una reserva existente
export const updateReservaEvento = async (
  id_reserva: number, 
  data: ActualizarReservaEventoDTO
): Promise<ActualizarReservaEventoResponse> => {
  const response = await api.put<ActualizarReservaEventoResponse>(
    `/reservaEvento/actualizar/${id_reserva}/`, 
    data
  );
  return response.data;
};

// Eliminar/Cancelar una reserva (eliminación lógica)
export const deleteReservaEvento = async (id_reserva: number): Promise<{ mensaje: string }> => {
  const response = await api.delete<{ mensaje: string }>(
    `/reservaEvento/eliminar/${id_reserva}/`
  );
  return response.data;
};

// ======== FILTROS Y CONSULTAS ========

// Obtener reservas por estado
export const getReservasPorEstado = async (estado: string): Promise<ReservasPorEstadoResponse> => {
  const response = await api.get<ReservasPorEstadoResponse>(
    `/reservaEvento/estado/${estado}/`
  );
  return response.data;
};

// Obtener reservas por cliente
export const getReservasPorCliente = async (cliente_id: number): Promise<ReservasPorClienteResponse> => {
  const response = await api.get<ReservasPorClienteResponse>(
    `/reservaEvento/cliente/${cliente_id}/`
  );
  return response.data;
};

// ======== GESTIÓN DE COMPROBANTES ========

// Subir comprobante de pago
export const subirComprobante = async (
  id_reserva_gen: number, 
  archivo: File
): Promise<{ mensaje: string; reserva_gen_id: number }> => {
  const formData = new FormData();
  formData.append('pago', archivo);
  
  const response = await api.post(
    `/reservaEvento/comprobante/${id_reserva_gen}/`, 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// ======== SISTEMA DE COLA ========

// Obtener estadísticas de la cola de prioridad
export const getEstadisticasCola = async (): Promise<EstadisticasCola> => {
  const response = await api.get<EstadisticasCola>("/reservaEvento/estadisticas-cola/");
  return response.data;
};

// ======== FUNCIONES AUXILIARES ========

// Función para formatear datos antes de enviar al backend
export const formatReservaData = (data: CrearReservaEventoDTO): CrearReservaEventoDTO => {
  return {
    ...data,
    // Asegurar que los arrays estén presentes
    servicios_adicionales: data.servicios_adicionales || [],
    // Formatear fechas/horas si es necesario
    fecha: data.fecha, // YYYY-MM-DD
    hora_ini: data.hora_ini, // ISO string
    hora_fin: data.hora_fin, // ISO string
    // Asegurar tipos numéricos
    cant_personas: Number(data.cant_personas),
    telefono: Number(data.telefono),
    ci: Number(data.ci)
  };
};

// Función para validar datos antes de enviar
export const validateReservaData = (data: CrearReservaEventoDTO): string[] => {
  const errors: string[] = [];
  
  if (!data.nombre) errors.push("El nombre es requerido");
  if (!data.app_paterno) errors.push("El apellido paterno es requerido");
  if (!data.telefono) errors.push("El teléfono es requerido");
  if (!data.ci) errors.push("El CI es requerido");
  if (!data.email) errors.push("El email es requerido");
  if (!data.cant_personas || data.cant_personas <= 0) errors.push("La cantidad de personas debe ser mayor a 0");
  if (!data.fecha) errors.push("La fecha es requerida");
  if (!data.hora_ini) errors.push("La hora de inicio es requerida");
  if (!data.hora_fin) errors.push("La hora de fin es requerida");
  
  // Validar que hora_fin sea posterior a hora_ini
  if (data.hora_ini && data.hora_fin) {
    const inicio = new Date(data.hora_ini);
    const fin = new Date(data.hora_fin);
    if (fin <= inicio) {
      errors.push("La hora de fin debe ser posterior a la hora de inicio");
    }
  }
  
  // Validar tipos numéricos
  if (data.telefono && isNaN(Number(data.telefono))) {
    errors.push("El teléfono debe ser un número válido");
  }
  
  if (data.ci && isNaN(Number(data.ci))) {
    errors.push("El CI debe ser un número válido");
  }
  
  if (data.cant_personas && isNaN(Number(data.cant_personas))) {
    errors.push("La cantidad de personas debe ser un número válido");
  }
  
  return errors;
};

// Función para manejar la respuesta de creación de reserva
export const procesarRespuestaReserva = (response: CrearReservaEventoResponse) => {
  // Tu backend retorna una estructura específica, esta función ayuda a procesarla
  if (response.mensaje && response.reserva) {
    return {
      success: true,
      data: response
    };
  }
  
  if (response.error) {
    return {
      success: false,
      error: response.error
    };
  }
  
  return {
    success: false,
    error: 'Respuesta inesperada del servidor'
  };
};

// Exportar todos los servicios como un objeto
const eventoService = {
  // Servicios adicionales
  getServiciosAdicionales,
  
  // Disponibilidad
  verificarDisponibilidad,
  getHorariosOcupados,
  
  // Gestión de reservas
  createReservaEvento,
  getReservasEvento,
  getReservaEventoById,
  updateReservaEvento,
  deleteReservaEvento,
  
  // Filtros
  getReservasPorEstado,
  getReservasPorCliente,
  
  // Comprobantes
  subirComprobante,
  
  // Sistema de cola
  getEstadisticasCola,
  
  // Utilidades
  formatReservaData,
  validateReservaData,
  procesarRespuestaReserva,
};

export default eventoService;