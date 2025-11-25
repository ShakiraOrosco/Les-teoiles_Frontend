// 📁 src/types/AdReserva/Reserva_Hospedaje/hospedaje.ts

export interface DatosCliente {
  id_datos_cliente?: number;
  nombre: string;
  app_paterno: string;
  app_materno?: string;
  telefono: string;
  ci: string;
  email: string;
}

export interface Habitacion {
  id_habitacion: number;
  numero?: string;
  amoblado: 'S' | 'N';
  baño_priv: 'S' | 'N';
  estado: 'DISPONIBLE' | 'OCUPADA';
}

export interface ReservasGen {
  id_reservas_gen: number;
  tipo: 'H';
  pago: string | null;
  administrador: number;
  empleado: number;
}

export interface ReservaHotel {
  id_reserva_hotel?: number;
  cant_personas: number;
  amoblado: 'S' | 'N';
  baño_priv: 'S' | 'N';
  fecha_ini: string; // formato ISO: YYYY-MM-DD
  fecha_fin: string;
  estado: 'A' | 'C' | 'F'; // Activa, Cancelada, Finalizada
  reservas_gen: ReservasGen | number;
  datos_cliente: DatosCliente | number;
  habitacion: Habitacion | number;
  check_in?: string;
  check_out?: string;
}

export interface TarifaHotel {
  id_tarifa_hotel: number;
  nombre: string;
  descripcion: string;
  amoblado: 'S' | 'N';
  baño_priv: 'S' | 'N';
  precio_persona: number;
}

export interface CrearReservaRequest {
  nombre: string;
  app_paterno: string;
  app_materno?: string;
  telefono: string;
  ci: string;
  email: string;
  cant_personas: number;
  amoblado?: 'S' | 'N';
  baño_priv?: 'S' | 'N';
  fecha_ini: string;
  fecha_fin: string;
  estado?: 'A' | 'C' | 'F';
}

export interface CrearReservaResponse {
  mensaje: string;
  reserva: ReservaHotel;
  cliente_id: number;
  habitacion_id: number;
  reserva_gen_id: number;
}

export interface SubirComprobanteRequest {
  pago: File;
}

export interface SubirComprobanteResponse {
  mensaje: string;
  reserva_gen_id: number;
}
