export interface Usuario {
  id_usuario: number;
  nombre: string;
  app_paterno: string;
  app_materno: string;
  ci: string;
  telefono: string;
  email: string;
  estado: "A" | "I";  // Solo Activo o Inactivo
  rol: "administrador" | "empleado";
}