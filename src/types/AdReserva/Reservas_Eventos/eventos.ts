// ======== ESTADOS Y TIPOS BÁSICOS ========

// Estado de la reserva de evento
export type EstadoReservaEvento = "A" | "P" | "C" | "F";

// Labels para estados de reserva de evento
export const ESTADOS_RESERVA_EVENTO_LABEL: Record<EstadoReservaEvento, string> = {
  A: "Activa",
  P: "Pendiente", 
  C: "Cancelada",
  F: "Finalizada"
};

// Labels para los TIPOS de servicio
export const TIPOS_SERVICIO_LABEL: Record<string, string> = {
  E: "Establecimiento",
  A: "Alimentación", 
  X: "Extra",
};

// Labels para los ESTADOS (Activo/Inactivo)
export const ESTADOS_SERVICIO_LABEL: Record<string, string> = {
  A: "Activo",
  I: "Inactivo",
};

// Estado del servicio: Activo o Inactivo
export type EstadoServicio = 'A' | 'I';

// Tipo de servicio: Establecimiento, Alimentación, o Extra
export type TipoServicio = 'E' | 'A' | 'X';

// ======== SERVICIO ADICIONAL ========
export interface ServicioAdicional {
  id_servicios_adicionales: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  tipo: TipoServicio;
  estado: EstadoServicio;
}

// ======== CLIENTE ========
export interface DatosCliente {
  id_datos_cliente: number;
  nombre: string;
  app_paterno: string;
  app_materno?: string;
  telefono: number;
  ci: number;
  email: string;
}

// ======== RESERVA GENERAL ========
export interface ReservaGeneral {
  id_reservas_gen: number;
  tipo: string;
  tiene_pago: boolean;
  administrador_id: number;
  empleado_id: number;
}

// ======== SERVICIO EVENTO (Relación) ========
export interface ServicioEvento {
  id: number;
  servicios_adicionales_id: number;
  reservas_evento_id: number;
  servicio_info?: ServicioAdicional;
}

// ======== RESERVA DE EVENTO ========
export interface ReservaEvento {
  id_reservas_evento: number;
  cant_personas: number;
  fecha: string;
  hora_ini: string;
  hora_fin: string;
  duracion_horas: number;
  estado: EstadoReservaEvento;
  estado_display: string;
  check_in?: string | null;
  check_out?: string | null;
  datos_cliente: DatosCliente;
  reservas_gen: ReservaGeneral;
  servicios_adicionales: ServicioAdicional[];
  total_servicios: number;
  total_precio_servicios?: number;
}

// ======== DTOs PARA CREAR/ACTUALIZAR ========

// DTO para crear reserva de evento
export interface CrearReservaEventoDTO {
  // Datos del cliente
  nombre: string;
  app_paterno: string;
  app_materno?: string;
  telefono: number;
  ci: number;
  email: string;
  
  // Datos del evento
  cant_personas: number;
  fecha: string; // YYYY-MM-DD
  hora_ini: string; // ISO format
  hora_fin: string; // ISO format
  estado?: EstadoReservaEvento;
  
  // Servicios adicionales
  servicios_adicionales: number[];
}

// DTO para actualizar reserva de evento
export interface ActualizarReservaEventoDTO {
  // Datos del cliente (opcionales para cambio)
  nombre?: string;
  app_paterno?: string;
  app_materno?: string;
  telefono?: number;
  ci?: number;
  email?: string;
  
  // Datos del evento (opcionales)
  cant_personas?: number;
  fecha?: string;
  hora_ini?: string;
  hora_fin?: string;
  estado?: EstadoReservaEvento;
  check_in?: string;
  check_out?: string;
  
  // Servicios adicionales (opcionales)
  servicios_adicionales?: number[];
}

// DTO para servicio adicional
export interface ServicioDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: TipoServicio;
  estado: EstadoServicio;
}

// ======== VERIFICACIÓN DE DISPONIBILIDAD ========

// Request para verificar disponibilidad
export interface VerificarDisponibilidadRequest {
  servicios_ids: number[];
  fecha: string;
  hora_ini: string;
  hora_fin: string;
}

// Conflicto de horario
export interface ConflictoHorario {
  id_reserva: number;
  hora_ini: string;
  hora_fin: string;
  fecha: string;
}

// Servicio no disponible
export interface ServicioNoDisponible {
  id_servicio: number;
  nombre_servicio: string;
  conflictos: ConflictoHorario[];
}

// Response de verificación de disponibilidad
export interface VerificarDisponibilidadResponse {
  disponible: boolean;
  mensaje: string;
  servicios_no_disponibles?: ServicioNoDisponible[];
}

// ======== HORARIOS OCUPADOS ========

// Horario ocupado
export interface HorarioOcupado {
  id_reserva: number;
  fecha: string;
  hora_ini: string;
  hora_fin: string;
  cant_personas: number;
}

// Servicio con horarios ocupados
export interface ServicioHorariosOcupados {
  id_servicio: number;
  nombre_servicio: string;
  horarios_ocupados: HorarioOcupado[];
}

// Response de horarios ocupados
export interface HorariosOcupadosResponse {
  servicios: ServicioHorariosOcupados[];
}

// ======== SISTEMA DE COLA DE PRIORIDAD ========

// Información de prioridad
export interface InfoPrioridad {
  duracion_horas: number;
  cant_personas: number;
  cant_servicios: number;
  prioridad_calculada: number;
  mensaje_competencia: string;
}

// Response de creación de reserva con cola
export interface CrearReservaEventoResponse {
  mensaje: string;
  reserva: ReservaEvento;
  cliente_id: number;
  reserva_gen_id: number;
  servicios_agregados: number;
  info_prioridad: InfoPrioridad;
}

// Estadísticas de la cola
export interface EstadisticasCola {
  total_reservas_procesadas: number;
  total_reservas_rechazadas: number;
  total_reservas_pendientes: number;
  tasa_exito: number;
  reservas_por_prioridad: Record<string, number>;
  ultima_reserva_procesada?: string;
}

// ======== RESPONSE DE ACTUALIZACIÓN ========

// Response de actualización de reserva
export interface ActualizarReservaEventoResponse {
  mensaje: string;
  reserva_id: number;
  campos_actualizados: string[];
  estado_actual: string;
  cliente_creado?: boolean;
  nuevo_cliente_id?: number;
  cliente_info?: {
    nombre_completo: string;
    ci: number;
    email: string;
  };
  mensaje_cliente?: string;
  servicios_actuales?: Array<{
    servicios_adicionales_id: number;
    servicios_adicionales__nombre: string;
    servicios_adicionales__precio: number;
  }>;
  total_servicios?: number;
}

// ======== FILTROS Y CONSULTAS ========

// Parámetros para filtrar horarios ocupados
export interface FiltroHorariosOcupados {
  servicio_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
}

// Response de lista de reservas
export interface ListaReservasEventoResponse {
  count: number;
  reservas: ReservaEvento[];
}

// Response de reservas por estado
export interface ReservasPorEstadoResponse {
  count: number;
  estado: EstadoReservaEvento;
  estado_display: string;
  reservas: Array<{
    id_reservas_evento: number;
    cant_personas: number;
    fecha: string;
    hora_ini: string;
    hora_fin: string;
    duracion_horas: number;
    estado: EstadoReservaEvento;
    estado_display: string;
    cliente: string;
    cliente_email: string;
  }>;
}

// Response de reservas por cliente
export interface ReservasPorClienteResponse {
  cliente: {
    id: number;
    nombre_completo: string;
    telefono: number;
    email: string;
    ci: number;
  };
  total_reservas: number;
  reservas: Array<{
    id_reservas_evento: number;
    cant_personas: number;
    fecha: string;
    hora_ini: string;
    hora_fin: string;
    duracion_horas: number;
    estado: EstadoReservaEvento;
    estado_display: string;
    total_servicios: number;
    check_in?: string;
    check_out?: string;
  }>;
}

// ======== FUNCIONES AUXILIARES ========

// Función para obtener el label de un tipo de servicio
export const getTipoServicioLabel = (tipo: TipoServicio): string => {
  return TIPOS_SERVICIO_LABEL[tipo] || "Desconocido";
};

// Función para obtener el label de un estado de servicio
export const getEstadoServicioLabel = (estado: EstadoServicio): string => {
  return ESTADOS_SERVICIO_LABEL[estado] || "Desconocido";
};

// Función para obtener el label de un estado de reserva
export const getEstadoReservaLabel = (estado: EstadoReservaEvento): string => {
  return ESTADOS_RESERVA_EVENTO_LABEL[estado] || "Desconocido";
};

// ======== ERROR RESPONSES ========

// Error response estándar
export interface ErrorResponse {
  error: string;
  codigo?: string;
  info_debug?: any;
  detalle?: any;
  campos_faltantes?: string[];
  servicios_conflicto?: Array<{
    id: number;
    nombre: string;
    conflictos: ConflictoHorario[];
  }>;
}