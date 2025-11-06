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
import { ReservaEvento } from "../../../../types/AdReserva/Reservas_Eventos/eventos";

interface ReservasEventoTableProps {
  reservas: ReservaEvento[];
  onEdit?: (reserva: ReservaEvento) => void;
  onCancel?: (reserva: ReservaEvento) => void;
  onView?: (reserva: ReservaEvento) => void;
}

export default function ReservasEventoTable({ 
  reservas, 
  onEdit, 
  onCancel, 
  onView 
}: ReservasEventoTableProps) {
  // 🔹 Fecha actual
  const hoy = new Date();

  // 🔹 Filtrado por estado y fecha
  const futuras = reservas.filter((r) => {
    const fechaEvento = new Date(r.fecha);
    return fechaEvento > hoy && r.estado !== 'C' && r.estado !== 'F';
  });

  const pasadas = reservas.filter((r) => {
    const fechaEvento = new Date(r.fecha);
    return fechaEvento <= hoy || r.estado === 'F' || r.estado === 'C';
  });

  // ✅ Función para obtener servicios como string
  const getServiciosInfo = (reserva: ReservaEvento) => {
    if (reserva.servicios_adicionales && reserva.servicios_adicionales.length > 0) {
      return reserva.servicios_adicionales.map(s => s.nombre).join(', ');
    }
    return 'Sin servicios';
  };

  // ✅ Función para formatear hora
  const formatHora = (horaISO: string) => {
    try {
      const fecha = new Date(horaISO);
      return fecha.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '-';
    }
  };

  // ✅ Función para formatear fecha
  const formatFecha = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  // ✅ Etiquetas visuales de estado
  const getEstadoLabel = (reserva: ReservaEvento) => {
    const fechaEvento = new Date(reserva.fecha);
    const estado = reserva.estado;

    switch (estado) {
      case 'C':
        return { label: "Cancelado", color: "error" as const };
      case 'F':
        return { label: "Finalizado", color: "info" as const };
      case 'P':
        return { label: "Pendiente", color: "warning" as const };
      case 'A':
        if (fechaEvento > hoy) {
          return { label: "Confirmado", color: "success" as const };
        } else if (fechaEvento.toDateString() === hoy.toDateString()) {
          return { label: "Hoy", color: "primary" as const };
        } else {
          return { label: "En Curso", color: "success" as const };
        }
      default:
        return { label: "Desconocido", color: "warning" as const };
    }
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
                Fecha Evento
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Horario
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Personas
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Servicios
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Duración
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
                const codigoReserva = `EVT${reserva.id_reservas_evento.toString().padStart(4, '0')}`;
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

                    {/* Fecha del Evento */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      {formatFecha(reserva.fecha)}
                    </TableCell>

                    {/* Horario */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      <div className="flex flex-col text-sm">
                        <span>Inicio: {formatHora(reserva.hora_ini)}</span>
                        <span>Fin: {formatHora(reserva.hora_fin)}</span>
                      </div>
                    </TableCell>

                    {/* Cantidad de Personas */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      <div className="flex items-center gap-1">
                        <span>{reserva.cant_personas}</span>
                      </div>
                    </TableCell>

                    {/* Servicios Adicionales */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      <div className="max-w-[150px] truncate" title={serviciosInfo}>
                        {serviciosInfo}
                      </div>
                      {reserva.total_servicios}
                    </TableCell>

                    {/* Duración */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start text-gray-800 dark:text-gray-200">
                      {reserva.duracion_horas ? (
                        <span>{reserva.duracion_horas.toFixed(1)}h</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Estado */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start">
                      <Badge size="sm" color={estado.color}>
                        {estado.label}
                      </Badge>
                    </TableCell>

                    {/* 👁️ Ver */}
                    <TableCell className="px-4 py-4 sm:px-6 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#26a5b9] flex items-center justify-center"
                        onClick={() => onView?.(reserva)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>

                    {/* ✏️ / ❌ Acciones solo en tabla de futuras */}
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
                          {reserva.estado !== 'C' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                              onClick={() => onCancel?.(reserva)}
                            >
                              Cancelar
                            </Button>
                          )}
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
      {/* 🟡 Reservas futuras con acciones */}
      {renderTable(futuras, "Eventos Próximos", true)}
      
      {/* 🟢 Reservas pasadas sin acciones */}
      {renderTable(pasadas, "Eventos Pasados o Finalizados")}
    </div>
  );
}