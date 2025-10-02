// src/components/tables/Usuarios/UsuariosTable.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import Badge from "../../ui/badge/Badge";
import { Usuario } from "../../../types/Usuarios/usuario";

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onToggleEstado: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

export default function UsuariosTable({ usuarios, onEdit, onToggleEstado, onDelete }: UsuariosTableProps) {

  const getEstadoLabel = (estado: Usuario["estado"]) => {
    switch (estado) {
      case "A": return "Activo";
      case "I": return "Inactivo";
      default: return "-";
    }
  };

  const getEstadoColor = (estado: Usuario["estado"]) => {
    switch (estado) {
      case "A": return "success";
      case "I": return "danger";
      default: return "default";
    }
  };

  const getRolLabel = (rol: Usuario["rol"]) => {
    return rol.charAt(0).toUpperCase() + rol.slice(1);
  };

  const getRolColor = (rol: Usuario["rol"]) => {
    return rol === "administrador" ? "primary" : "info";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-[#e2e8f6] dark:bg-[#458890]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">ID</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Nombre Completo</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">CI</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Teléfono</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Rol</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Estado</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Acciones</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {usuarios.map((usuario) => {
              const isActivo = usuario.estado === "A";

              return (
                <TableRow
                  key={usuario.id_usuario}
                  className={`transition-colors duration-150 hover:bg-[#dbeafe]/30 dark:hover:bg-white/[0.05] ${!isActivo ? "opacity-60" : ""}`}
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      #{usuario.id_usuario}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start font-semibold text-gray-900 dark:text-white">
                    {usuario.nombre} {usuario.app_paterno} {usuario.app_materno}
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {usuario.ci}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="max-w-xs truncate text-gray-600 dark:text-gray-400" title={usuario.email}>
                      {usuario.email}
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="text-gray-600 dark:text-gray-400">
                      {usuario.telefono || <span className="text-gray-400 dark:text-gray-500 italic">-</span>}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Badge
                      size="sm"
                      color={getRolColor(usuario.rol)}
                    >
                      {getRolLabel(usuario.rol)}
                    </Badge>
                  </TableCell>

         

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-2">
                      {isActivo && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(usuario)}
                          className="text-[#3b82f6]"
                        >
                          Editar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleEstado(usuario)}
                        className={isActivo ? "text-red-600" : "text-green-600"}
                      >
                        {isActivo ? "Desactivar" : "Activar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(usuario)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}