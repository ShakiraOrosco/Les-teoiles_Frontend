import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../ui/table";
import Button from "../../../ui/button/Button";
import Badge from "../../../ui/badge/Badge";
import { ServicioAdicional } from "../../../../types/Bienes/Servicios/servicio";

interface ServiciosTableProps {
  servicios: ServicioAdicional[];
  onEdit: (servicio: ServicioAdicional) => void;
  onToggleEstado: (servicio: ServicioAdicional) => void; // Cambia el estado A/I
}

export default function ServiciosTable({ servicios, onEdit, onToggleEstado }: ServiciosTableProps) {

  const getEstadoLabel = (estado: ServicioAdicional["estado"]) => {
    switch (estado) {
      case "E": return "Establecimiento";
      case "A": return "Alimentación";
      case "X": return "Extras";
      case "I": return "Inactivo";
      default: return "-";
    }
  };

  const getEstadoColor = (estado: ServicioAdicional["estado"]) => {
    return estado === "I" ? "warning" : "success";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-[#e2e8f6] dark:bg-[#458890]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">ID</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Nombre</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Descripción</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Precio</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Tipo</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Acciones</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {servicios.map((servicio) => {
              const isActivo = servicio.estado !== "I";

              return (
                <TableRow
                  key={servicio.id_servicios_adicionales}
                  className={`transition-colors duration-150 hover:bg-[#fff3ef]/30 dark:hover:bg-white/[0.05] ${!isActivo ? "opacity-60" : ""}`}
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      #{servicio.id_servicios_adicionales}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start font-semibold text-gray-900 dark:text-white">
                    {servicio.nombre}
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="max-w-xs truncate" title={servicio.descripcion || '-'}>
                      {servicio.descripcion || <span className="text-gray-400 dark:text-gray-500 italic">Sin descripción</span>}
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start font-bold text-[#26a5b9] dark:text-[#99d8cd]">
                    $ {servicio.precio.toFixed(2)}
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Badge
                      size="sm"
                      color={getEstadoColor(servicio.estado)}
                    >
                      {getEstadoLabel(servicio.estado)}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-2">
                      {isActivo && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(servicio)}
                          className="text-[#26a5b9]"
                        >
                          Editar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleEstado(servicio)}
                        className={isActivo ? "text-red-600" : "text-green-600"}
                      >
                        {isActivo ? "Desactivar" : "Activar"}
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
