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
import { ReservaEvento, EstadoReservaEvento } from "../../../../types/AdReserva/Reservas_Eventos/eventos";

interface ReservasEventoTableProps {
  reservas: ReservaEvento[];
  onEdit?: (reserva: ReservaEvento) => void;
  onCancel?: (reserva: ReservaEvento) => void;
}

export default function ReservasEventoTable({ reservas, onEdit, onCancel }: ReservasEventoTableProps) {
  // 🔹 Fecha y hora actual
  const hoy = new Date();

  // 🔹 Filtrado por estado y fecha
  const activasYPendientes = reservas.filter((r) => 
    r.estado === "A" || r.estado === "P"
  );
  
  const finalizadasYCanceladas = reservas.filter((r) => 
    r.estado === "F" || r.estado === "C"
  );

  // ✅ Función segura para obtener información del cliente
  const getClienteInfo = (reserva: ReservaEvento) => {
    if (typeof reserva.datos_cliente === 'object' && reserva.datos_cliente !== null) {
      const cliente = reserva.datos_cliente;
      return `${cliente.nombre || ''} ${cliente.app_paterno || ''} ${cliente.app_materno || ''}`.trim() || 'Cliente no disponible';
    }
    return 'Cliente no disponible';
  };

  // ✅ Función para obtener servicios como string
  const getServiciosInfo = (reserva: ReservaEvento) => {
    if (reserva.servicios_adicionales && reserva.servicios_adicionales.length > 0) {
      return reserva.servicios_adicionales.map(serv => serv.nombre).join(', ');
    }
    return 'Sin servicios';
  };

  // ✅ Formatear fecha y hora
  const formatDateTime = (fecha: string, hora?: string) => {
    const date = new Date(fecha);
    if (hora) {
      const time = new Date(hora);
      return `${date.toLocaleDateString()} ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString();
  };

  // ✅ Etiquetas visuales de estado
  const getEstadoLabel = (reserva: ReservaEvento) => {
    const estadoMap: Record<EstadoReservaEvento, { label: string; color: string }> = {
      "A": { label: "Activa", color: "success" },
      "P": { label: "Pendiente", color: "warning" },
      "C": { label: "Cancelada", color: "danger" },
      "F": { label: "Finalizada", color: "gray" }
    };

    return estadoMap[reserva.estado] || { label: "Desconocido", color: "gray" };
  };

  const renderTable = (
    data: ReservaEvento[],
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
                Cliente
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Fecha Evento
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Horario
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Duración
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Personas
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Servicios
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
                const codigoReserva = `EVT${reserva.id_reservas_evento}`;
                const clienteInfo = getClienteInfo(reserva);
                const serviciosInfo = getServiciosInfo(reserva);

                return (
                  <TableRow
                    key={reserva.id_reservas_evento}
                    className="transition-colors duration-150 hover:bg-[#fff3ef]/30 dark:hover:bg-white/[0.05]"
                  >
                    {/* Código de Reserva */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start font-semibold text-gray-900 dark:text-white">
                      {codigoReserva}
                    </TableCell>

                    {/* Cliente */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      {clienteInfo}
                    </TableCell>

                    {/* Fecha del Evento */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      {reserva.fecha ? (
                        new Date(reserva.fecha).toLocaleDateString()
                      ) : (
                        <span className="italic text-gray-400">Sin fecha</span>
                      )}
                    </TableCell>

                    {/* Horario */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      <div className="flex flex-col">
                        <span>Inicio: {reserva.hora_ini ? new Date(reserva.hora_ini).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                        <span>Fin: {reserva.hora_fin ? new Date(reserva.hora_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                      </div>
                    </TableCell>

                    {/* Duración */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      {reserva.duracion_horas} h
                    </TableCell>

                    {/* Cantidad de Personas */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      {reserva.cant_personas}
                    </TableCell>

                    {/* Servicios */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      <div className="max-w-[200px] truncate" title={serviciosInfo}>
                        {serviciosInfo}
                      </div>
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

                    {/* ✏️ / ❌ Acciones solo en tabla de activas y pendientes */}
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
      {/* 🟡 Con acciones - Activas y Pendientes */}
      {renderTable(activasYPendientes, "Reservas Activas y Pendientes", true)}
      {/* 🟢 Sin acciones - Finalizadas y Canceladas */}
      {renderTable(finalizadasYCanceladas, "Reservas Finalizadas y Canceladas")}
    </div>
  );
}