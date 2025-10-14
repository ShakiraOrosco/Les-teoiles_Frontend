import api from "../axios";
import { Usuario } from "../../types/Usuarios/usuario";

// * === SERVICIO PARA OBTENER TODOS LOS CLIENTES === * //

export const getUsuarios = async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>("/usuarios/");
    return response.data;
}