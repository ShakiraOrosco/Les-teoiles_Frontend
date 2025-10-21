import api from "../axios";
import { Usuario } from "../../types/Usuarios/usuario";

// * === SERVICIO PARA OBTENER TODOS LOS CLIENTES === * //

export const getUsuarios = async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>("/usuarios/");
    return response.data;
}

// * === SERVICIO PARA CREAR UN NUEVO USUARIO === * //
export const createUsuario = async (nuevoUsuario: Partial<Usuario>) => {
  const response = await api.post("/usuarios/crear/", nuevoUsuario);
  return response.data;
};
// * === SERVICIO PARA EDITAR UN USUARIO === * //
// Editar un usuario
export const editUsuario = async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
  const response = await api.put<{ mensaje: string; usuario: Usuario }>(
    `/usuarios/actualizar/${id}/`, 
    data
  );
  return response.data.usuario;
};