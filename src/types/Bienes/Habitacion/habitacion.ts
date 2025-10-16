// Estado de la habitación
export type EstadoHabitacion = "DISPONIBLE" | "OCUPADA" | "MANTENIMIENTO";

// Opción S/N
export type OpcionSiNo = "S" | "N";

// ======== TARIFA HOTEL ========
export interface TarifaHotel {
  id_tarifa_hotel: number;
  nombre: string;
  descripcion: string;
  amoblado: OpcionSiNo;
  baño_priv: OpcionSiNo;
  precio_persona: number;
}

// ======== HABITACIÓN ========
export interface Habitacion {
  id_habitacion: number;
  numero: string;
  piso: number;
  amoblado: OpcionSiNo;
  baño_priv: OpcionSiNo;
  estado: EstadoHabitacion;
  tarifa_hotel: {
    id_tarifa_hotel: number;
    nombre: string;
    precio_persona: number;
  };
  precio_tarifa?: number;
}

// ======== DTO para crear/editar ========
export interface HabitacionDTO {
  numero: string;
  piso: number;
  amoblado: "S" | "N";
  baño_priv: "S" | "N";
}

