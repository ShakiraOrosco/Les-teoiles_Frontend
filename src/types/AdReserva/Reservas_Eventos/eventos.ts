// types/AdReserva/Reservas_Eventos/eventos.ts

// ======== TIPOS BÁSICOS ========

export type EstadoReservaEvento = 'A' | 'P' | 'C' | 'F';

export interface ServicioAdicional {
  id_servicios_adicionales: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: string;
  estado: string;
}

export interface Cliente {
  id_datos_cliente: number;
  nombre: string;
  app_paterno: string;
  app_materno?: string;
  telefono: string | number;
  ci: string | number;
  email: string;
}

export interface ReservaGen {
  id_reservas_gen: number;
  tipo: string;
  tiene_pago: boolean;
  administrador_id: number;
  empleado_id: number;
  pago?: any; // Binary field del backend
}

export interface ServicioEvento {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo?: string;
}

// ======== RESERVA DE EVENTO PRINCIPAL ========

export interface ReservaEvento {
  id_reservas_evento: number;
  cant_personas: number;
  fecha: string;
  hora_ini: string;
  hora_fin: string;
  estado: EstadoReservaEvento;
  estado_display: string;
  check_in?: string | null;
  check_out?: string | null;
  duracion_horas?: number;
  datos_cliente: Cliente;
  reservas_gen: ReservaGen;
  servicios_adicionales: ServicioEvento[];
  total_servicios: number;
  total_precio_servicios?: number;
}

// ======== DTOs PARA CREAR Y ACTUALIZAR ========

export interface CrearReservaEventoDTO {
  // Datos del cliente
  nombre: string;
  app_paterno: string;
  app_materno?: string;
  telefono: number | string;
  ci: number | string;
  email: string;
  
  // Datos del evento
  cant_personas: number;
  fecha: string; // YYYY-MM-DD
  hora_ini: string; // ISO string
  hora_fin: string; // ISO string
  estado?: EstadoReservaEvento;
  
  // Servicios adicionales
  servicios_adicionales?: number[];
}

export interface ActualizarReservaEventoDTO {
  // Datos del cliente (opcionales para actualización)
  nombre?: string;
  app_paterno?: string;
  app_materno?: string;
  telefono?: number | string;
  ci?: number | string;
  email?: string;
  
  // Datos del evento (opcionales)
  cant_personas?: number;
  fecha?: string;
  hora_ini?: string;
  hora_fin?: string;
  estado?: EstadoReservaEvento;
  check_in?: string;
  check_out?: string;
  
  // Servicios adicionales
  servicios_adicionales?: number[];
}

// ======== RESPONSES DE LA API ========

export interface CrearReservaEventoResponse {
  mensaje?: string;
  reserva?: ReservaEvento;
  cliente_id?: number;
  reserva_gen_id?: number;
  servicios_agregados?: number;
  info_prioridad?: {
    duracion_horas: number;
    cant_personas: number;
    cant_servicios: number;
    prioridad_calculada: number;
    mensaje_competencia: string;
  };
  error?: string;
  codigo?: string;
  info_debug?: any;
  detalle?: any;
}

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
  servicios_actuales?: ServicioEvento[];
  total_servicios?: number;
  error?: string;
}

export interface EliminarReservaEventoResponse {
  mensaje: string;
  reserva_id: number;
  estado_anterior: string;
  estado_actual: string;
  nota?: string;
  error?: string;
}

// ======== DISPONIBILIDAD Y HORARIOS ========

export interface VerificarDisponibilidadRequest {
  servicios_ids: number[];
  fecha: string; // YYYY-MM-DD
  hora_ini: string; // ISO string
  hora_fin: string; // ISO string
}

export interface ConflictoHorario {
  id_reserva: number;
  hora_ini: string;
  hora_fin: string;
  fecha: string;
}

export interface ServicioNoDisponible {
  id_servicio: number;
  nombre_servicio: string;
  conflictos: ConflictoHorario[];
}

export interface VerificarDisponibilidadResponse {
  disponible: boolean;
  mensaje: string;
  servicios_no_disponibles?: ServicioNoDisponible[];
  error?: string;
}

export interface HorarioOcupado {
  id_reserva: number;
  fecha: string;
  hora_ini: string;
  hora_fin: string;
  cant_personas: number;
}

export interface ServicioHorarios {
  id_servicio: number;
  nombre_servicio: string;
  horarios_ocupados: HorarioOcupado[];
}

export interface HorariosOcupadosResponse {
  servicios: ServicioHorarios[];
  error?: string;
}

// ======== FILTROS Y CONSULTAS ========

export interface ListaReservasEventoResponse {
  count: number;
  reservas: ReservaEvento[];
  error?: string;
}

export interface ReservaEventoResumen {
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
  check_in?: string | null;
  check_out?: string | null;
}

export interface ReservasPorEstadoResponse {
  count: number;
  estado: EstadoReservaEvento;
  estado_display: string;
  reservas: ReservaEventoResumen[];
  error?: string;
}

export interface ReservaEventoCliente {
  id_reservas_evento: number;
  cant_personas: number;
  fecha: string;
  hora_ini: string;
  hora_fin: string;
  duracion_horas: number;
  estado: EstadoReservaEvento;
  estado_display: string;
  total_servicios: number;
  check_in?: string | null;
  check_out?: string | null;
}

export interface ReservasPorClienteResponse {
  cliente: {
    id: number;
    nombre_completo: string;
    telefono: string | number;
    email: string;
    ci: string | number;
  };
  total_reservas: number;
  reservas: ReservaEventoCliente[];
  error?: string;
}

// ======== SISTEMA DE COLA ========

export interface EstadisticasColaItem {
  id_reserva: number;
  prioridad: number;
  estado: string;
  timestamp: string;
  datos_evento: {
    cant_personas: number;
    fecha: string;
    hora_ini: string;
    hora_fin: string;
  };
}

export interface EstadisticasCola {
  total_reservas_procesadas: number;
  reservas_activas: number;
  reservas_pendientes: number;
  reservas_en_cola: number;
  reservas_rechazadas: number;
  tiempo_promedio_procesamiento?: number;
  ultimas_reservas?: EstadisticasColaItem[];
  error?: string;
}

// ======== COMPROBANTES ========

export interface SubirComprobanteResponse {
  mensaje: string;
  reserva_gen_id: number;
  error?: string;
}

// ======== UTILIDADES ========

export interface ErrorResponse {
  error: string;
  codigo?: string;
  detalles?: any;
  campos_faltantes?: string[];
  servicios_conflicto?: ServicioNoDisponible[];
  servicios_no_disponibles?: ServicioNoDisponible[];
}

// ======== FILTROS Y PAGINACIÓN ========

export interface FiltrosReservaEvento {
  estado?: EstadoReservaEvento;
  fecha_desde?: string;
  fecha_hasta?: string;
  cliente_id?: number;
  servicio_id?: number;
}

export interface PaginacionParams {
  page?: number;
  page_size?: number;
  ordering?: string;
}

// ======== ESTADÍSTICAS E INFORMES ========

export interface EstadisticasEvento {
  total_reservas: number;
  reservas_activas: number;
  reservas_pendientes: number;
  reservas_canceladas: number;
  reservas_finalizadas: number;
  promedio_personas: number;
  servicio_mas_popular?: {
    id: number;
    nombre: string;
    veces_contratado: number;
  };
  fecha_reserva_mas_solicitada?: string;
  total_ingresos_servicios?: number;
}

export interface InformeMensualEvento {
  mes: string;
  total_reservas: number;
  reservas_activas: number;
  reservas_completadas: number;
  total_personas: number;
  ingresos_servicios: number;
}

// ======== CONSTANTES ========

export const ESTADOS_RESERVA_EVENTO: Record<EstadoReservaEvento, string> = {
  'A': 'Activa',
  'P': 'Pendiente',
  'C': 'Cancelada',
  'F': 'Finalizada'
};

export const TIPOS_SERVICIO = {
  MUSICA: 'musica',
  DECORACION: 'decoracion',
  CATERING: 'catering',
  FOTOGRAFIA: 'fotografia',
  OTROS: 'otros'
} as const;

// ======== FUNCIONES DE UTILIDAD ========

export const getEstadoDisplay = (estado: EstadoReservaEvento): string => {
  return ESTADOS_RESERVA_EVENTO[estado] || 'Desconocido';
};

export const isValidEstado = (estado: string): estado is EstadoReservaEvento => {
  return Object.keys(ESTADOS_RESERVA_EVENTO).includes(estado);
};

export const toEstadoReservaEvento = (estado: string): EstadoReservaEvento | null => {
  return isValidEstado(estado) ? estado as EstadoReservaEvento : null;
};

export const calcularDuracionEvento = (horaIni: string, horaFin: string): number => {
  const inicio = new Date(horaIni);
  const fin = new Date(horaFin);
  return (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60); // Horas
};

// ======== TIPOS PARA FORMULARIOS ========

export interface FormReservaEvento {
  // Datos del cliente
  nombre: string;
  app_paterno: string;
  app_materno: string;
  telefono: string;
  ci: string;
  email: string;
  
  // Datos del evento
  cant_personas: string;
  fecha: string;
  hora_ini: string;
  hora_fin: string;
  
  // Servicios adicionales
  servicios_adicionales: number[];
}

// ======== TIPOS PARA TABLAS Y LISTAS ========

export interface ColumnaTablaReserva {
  key: keyof ReservaEvento | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: ReservaEvento) => React.ReactNode;
}

export interface OpcionFiltro {
  value: string;
  label: string;
  count?: number;
}