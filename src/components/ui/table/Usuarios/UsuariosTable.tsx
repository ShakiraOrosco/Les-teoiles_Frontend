import { Table, TableBody, TableCell, TableHeader, TableRow } from "../index"
import Button from "../../button/Button"
import Badge from "../../badge/Badge"
import { MoreDotIcon } from "../../../../icons"
import { Usuario } from "../../../../types/Usuarios/usuario"


type Props = {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
}

export default function UsuarioTable({ usuarios, onEdit }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Cliente</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Carnet</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Teléfono</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Correo</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Estado</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Acciones</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id_usuario}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {usuario.nombre} {usuario.app_paterno} {usuario.app_materno}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {usuario.ci}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {usuario.telefono}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {usuario.email ? usuario.email : "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={usuario.estado ? "success" : "warning"}
                  >
                    {usuario.estado ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
            <TableCell className="px-4 py-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => onEdit(usuario)}
              >
                Editar
              </Button>

              <Button
                variant="outline"
                size="md"
              >
                Eliminar
              </Button>
            </div>
          </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

  )
}