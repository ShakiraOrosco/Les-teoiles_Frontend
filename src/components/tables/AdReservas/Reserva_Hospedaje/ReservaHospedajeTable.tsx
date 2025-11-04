import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import Button from "../../../ui/button/Button";

interface Reserva {
  id_reserva: number;
  codigo: string;
  cliente: {
    nombre_completo: string;
  };
  habitacion: {
    numero: string;
    piso: string;
  };
  fecha_ingreso: string;
  fecha_salida: string;
  cantidad_personas: number;
  estado: "CONFIRMADA" | "EN_PROCESO" | "CANCELADA" | "FINALIZADA" | string;
}

interface ReservasTableProps {
  reservas: Reserva[];
  onEdit: (reserva: Reserva) => void;
  onCancel: (reserva: Reserva) => void;
  onView: (reserva: Reserva) => void;
}

export default function ReservasTable({
  reservas,
  onEdit,
  onCancel,
  onView,
}: ReservasTableProps) {
  const getEstadoLabel = (estado: Reserva["estado"]) => {
    switch (estado) {
      case "CONFIRMADA":
        return "Confirmada";
      case "EN_PROCESO":
        return "En Proceso";
      case "CANCELADA":
        return "Cancelada";
      case "FINALIZADA":
        return "Finalizada";
      default:
        return "-";
    }
  };

  const getEstadoColor = (estado: Reserva["estado"]) => {
    switch (estado) {
      case "CONFIRMADA":
        return "#25a5b9";
      case "EN_PROCESO":
        return "#e08b5e";
      case "CANCELADA":
        return "#e22e2e";
      case "FINALIZADA":
        return "#4CAF50";
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
              {[
                "Código",
                "Cliente",
                "Habitación",
                "Fecha Ingreso",
                "Fecha Salida",
                "Personas",
                "Estado",
                "Acciones",
              ].map((title) => (
                <TableCell
                  key={title}
                  isHeader
                  className="px-5 py-3 text-center font-medium text-gray-700 dark:text-white"
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {reservas.length > 0 ? (
              reservas.map((reserva) => {
                const isCancelada = reserva.estado === "CANCELADA";

                return (
                  <TableRow
                    key={reserva.id_reserva}
                    className={`transition-colors duration-150 hover:bg-[#ddd3ef] dark:hover:bg-white/[0.05] ${
                      isCancelada ? "opacity-60" : ""
                    }`}
                  >
                    <TableCell className="text-center text-gray-900 dark:text-white">
                      {reserva.codigo}
                    </TableCell>
                    <TableCell className="text-center text-gray-900 dark:text-white">
                      {reserva.cliente.nombre_completo}
                    </TableCell>
                    <TableCell className="text-center text-gray-900 dark:text-white">
                      {reserva.habitacion.numero} - Piso {reserva.habitacion.piso}
                    </TableCell>
                    <TableCell className="text-center text-gray-900 dark:text-white">
                      {new Date(reserva.fecha_ingreso).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center text-gray-900 dark:text-white">
                      {new Date(reserva.fecha_salida).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center text-gray-900 dark:text-white">
                      {reserva.cantidad_personas}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className="inline-block px-3 py-1 rounded text-white text-sm font-semibold"
                        style={{ backgroundColor: getEstadoColor(reserva.estado) }}
                      >
                        {getEstadoLabel(reserva.estado)}
                      </span>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" onClick={() => onView(reserva)}>
                          Ver
                        </Button>
                        {!isCancelada && (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => onEdit(reserva)}
                            >
                              Editar
                            </Button>
                            <Button
                              
                              onClick={() => onCancel(reserva)}
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  
                  className="text-center text-gray-500 py-6 dark:text-white"
                >
                  No hay reservas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
