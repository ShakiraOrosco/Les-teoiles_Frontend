// Estado del servicio: Activo o Inactivo
export type EstadoServicio = 'A' | 'I';

// Tipo de servicio: Estético, Administrativo, o eXtra
export type TipoServicio = 'E' | 'A' | 'X';

export interface ServicioAdicional {
  id_servicios_adicionales: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  tipo: TipoServicio;
  estado: EstadoServicio; 
}

export interface ServicioDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: TipoServicio;
  estado: EstadoServicio; 
}