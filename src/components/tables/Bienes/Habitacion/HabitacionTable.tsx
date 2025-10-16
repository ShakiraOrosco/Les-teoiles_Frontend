// src/components/tables/Habitacion/HabitacionesTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import Button from "../../../ui/button/Button";
import { Habitacion } from "../../../../types/Bienes/Habitacion/habitacion";

interface HabitacionesTableProps {
  habitaciones: Habitacion[];
  onEdit: (habitacion: Habitacion) => void;
  onToggleEstado: (habitacion: Habitacion) => void;
  onDelete: (habitacion: Habitacion) => void;
}

export default function HabitacionesTable({
  habitaciones,
  onEdit,
}: HabitacionesTableProps) {
  const getEstadoLabel = (estado: Habitacion["estado"]) => {
    switch (estado) {
      case "DISPONIBLE":
        return "Disponible";
      case "OCUPADA":
        return "Ocupada";
      case "MANTENIMIENTO":
        return "Mantenimiento";
      default:
        return "-";
    }
  };

  const getEstadoColor = (estado: Habitacion["estado"]) => {
    switch (estado) {
      case "DISPONIBLE":
        return "#25a5b9"; // más fuerte verde azulado
      case "OCUPADA":
        return "#4bb1d1"; // azul más intenso
      case "MANTENIMIENTO":
        return "#a78ac7"; // lila más fuerte
      default:
        return "#a78ac7";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-[#e2e8f6] dark:bg-[#458890]">
            <TableRow>
              {["Número", "Piso", "Tipo", "Amoblado", "Baño Privado", "Tarifa", "Estado", "Acciones"].map(
                (title) => (
                  <TableCell
                    key={title}
                    isHeader
                    className="px-5 py-3 text-center font-medium text-gray-700 dark:text-white"
                  >
                    {title}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {habitaciones.map((habitacion) => {
              const isDisponible = habitacion.estado === "DISPONIBLE";

              const amobladoLabel = habitacion.amoblado === "S" ? "Sí" : "No";
              const banoLabel = habitacion.baño_priv === "S" ? "Sí" : "No";

              return (
                <TableRow
                  key={habitacion.id_habitacion}
                  className={`transition-colors duration-150 hover:bg-[#ddd3ef] dark:hover:bg-white/[0.05] ${!isDisponible ? "opacity-60" : ""
                    }`}
                >
                  <TableCell className="text-center text-gray-900 dark:text-white">
                    {habitacion.numero}
                  </TableCell>
                  <TableCell className="text-center text-gray-900 dark:text-white">
                    {habitacion.piso}
                  </TableCell>
                  <TableCell className="text-center text-gray-900 dark:text-white">
                    {habitacion.tipo}
                  </TableCell>
                  <TableCell className="text-center text-gray-900 dark:text-white">
                    {amobladoLabel}
                  </TableCell>
                  <TableCell className="text-center text-gray-900 dark:text-white">
                    {banoLabel}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className="inline-block px-3 py-1 rounded text-white text-sm font-semibold"
                      style={{ backgroundColor: "#26A5B9" }}
                    >
                      Bs. {habitacion.tarifa_hotel.precio_persona}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className="inline-block px-3 py-1 rounded text-white text-sm font-semibold"
                      style={{ backgroundColor: getEstadoColor(habitacion.estado) }}
                    >
                      {getEstadoLabel(habitacion.estado)}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onEdit(habitacion)}
                      >
                        Editar
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
