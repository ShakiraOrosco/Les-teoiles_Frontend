export type EstadoServicio = 'E' | 'A' | 'X' | 'I';

export interface ServicioAdicional {
  id_servicios_adicionales: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  estado: EstadoServicio; 
}

export interface ServicioDTO {
  nombre: string;
  descripcion: string;
  precio: number;         
  estado: EstadoServicio; 
}



