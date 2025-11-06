import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import Button from "../../../ui/button/Button";
import Badge from "../../../ui/badge/Badge";
import { Eye } from "lucide-react";
import { ReservaHotel } from "../../../../types/AdReserva/Reserva_Hospedaje/hospedaje";

interface ReservasTableProps {
  reservas: ReservaHotel[];
  onEdit?: (reserva: ReservaHotel) => void;
  onCancel?: (reserva: ReservaHotel) => void;
}

export default function ReservasTable({ reservas, onEdit, onCancel }: ReservasTableProps) {
  // 🔹 Fecha actual
  const hoy = new Date();

  // 🔹 Filtrado simple
  const futuras = reservas.filter((r) => !r.fecha_ini || new Date(r.fecha_ini) > hoy);
  const activas = reservas.filter(
    (r) => r.fecha_ini && new Date(r.fecha_ini) <= hoy
  );

  // ✅ Función segura para obtener información de habitación - AHORA MUESTRA EL NÚMERO
  const getHabitacionInfo = (reserva: ReservaHotel) => {
    if (typeof reserva.habitacion === 'object' && reserva.habitacion !== null) {
      return reserva.habitacion.numero || '-'; // ← Cambiado de id_habitacion a numero
    }
    return reserva.habitacion || '-';
  };

  // ✅ Función segura para obtener información del cliente
  const getClienteInfo = (reserva: ReservaHotel) => {
    if (typeof reserva.datos_cliente === 'object' && reserva.datos_cliente !== null) {
      const cliente = reserva.datos_cliente;
      return `${cliente.nombre || ''} ${cliente.app_paterno || ''} ${cliente.app_materno || ''}`.trim() || 'Cliente no disponible';
    }
    return 'Cliente no disponible';
  };

  // ✅ Etiquetas visuales de estado
  const getEstadoLabel = (reserva: ReservaHotel) => {
    const fechaIni = reserva.fecha_ini ? new Date(reserva.fecha_ini) : null;
    const fechaFin = reserva.fecha_fin ? new Date(reserva.fecha_fin) : null;

    if (reserva.estado === "C") return { label: "Cancelado", color: "error" };
    if (reserva.estado === "F") return { label: "Finalizado", color: "info" };
    if (!fechaIni) return { label: "Pendiente", color: "warning" };
    if (fechaFin && fechaFin < hoy) return { label: "Finalizado", color: "info" };
    if (fechaIni <= hoy && (!fechaFin || fechaFin >= hoy))
      return { label: "En Curso", color: "success" };
    return { label: "Próximo", color: "warning" };
  };

  const renderTable = (
    data: ReservaHotel[],
    titulo: string,
    withActions: boolean = false
  ) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white mb-8 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="bg-[#e2e8f6] dark:bg-[#458890] px-5 py-3 font-semibold text-gray-700 dark:text-white">
        {titulo} ({data.length})
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-[#f6f8fd] dark:bg-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Código
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Habitación
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Cliente
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Fecha Inicio
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Fecha Fin
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Personas
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Estado
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Ver
              </TableCell>
              {withActions && (
                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center py-8 text-gray-400"
                >
                  No hay reservas en esta categoría
                </TableCell>
              </TableRow>
            ) : (
              data.map((reserva) => {
                const estado = getEstadoLabel(reserva);
                const codigoReserva = `RES${reserva.id_reserva_hotel}`;
                const habitacionInfo = getHabitacionInfo(reserva);
                const clienteInfo = getClienteInfo(reserva);

                return (
                  <TableRow
                    key={reserva.id_reserva_hotel}
                    className="transition-colors duration-150 hover:bg-[#fff3ef]/30 dark:hover:bg-white/[0.05]"
                  >
                    {/* Código de Reserva */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start font-semibold text-gray-900 dark:text-white">
                      {codigoReserva}
                    </TableCell>

                    {/* Número de Habitación - AHORA MUESTRA EL NÚMERO LITERAL */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start font-semibold text-gray-900 dark:text-white">
                      {habitacionInfo}
                    </TableCell>

                    {/* Cliente */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      {clienteInfo}
                    </TableCell>

                    {/* Fecha Inicio */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      {reserva.fecha_ini || (
                        <span className="italic text-gray-400">Sin fecha</span>
                      )}
                    </TableCell>

                    {/* Fecha Fin */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      {reserva.fecha_fin || (
                        <span className="italic text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Cantidad de Personas */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      {reserva.cant_personas}
                    </TableCell>

                    {/* Estado */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start">
                      <Badge size="sm" color={estado.color as any}>
                        {estado.label}
                      </Badge>
                    </TableCell>

                    {/* 👁️ Ver */}
                    <TableCell className="px-4 py-4 sm:px-6 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#26a5b9] flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>

                    {/* ✏️ / ❌ Acciones solo en tabla 1 */}
                    {withActions && (
                      <TableCell className="px-4 py-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#26a5b9]"
                            onClick={() => onEdit?.(reserva)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => onCancel?.(reserva)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* 🟡 Con acciones */}
      {renderTable(futuras, "Reservas Próximas o sin Check-In", true)}
      {/* 🟢 Sin acciones */}
      {renderTable(activas, "Reservas en Curso o Finalizadas")}
    </div>
  );
}