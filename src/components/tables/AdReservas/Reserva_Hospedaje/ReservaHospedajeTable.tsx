import { useState } from 'react';
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
import VerClienteModal from "../../../modals/AdReservas/Reserva_Hospedaje/VerClienteModal"; // NUEVO IMPORT

interface ReservasTableProps {
  reservas: ReservaHotel[];
  onEdit?: (reserva: ReservaHotel) => void;
  onCancel?: (reserva: ReservaHotel) => void;
}

export default function ReservasTable({ reservas, onEdit, onCancel }: ReservasTableProps) {
  // NUEVO ESTADO PARA EL MODAL
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);

  // 🔹 Fecha actual
  const hoy = new Date();

  // 🔹 Filtrado CORREGIDO - Las canceladas van a la segunda tabla
  const futuras = reservas.filter((r) => 
    r.estado !== "C" && // No canceladas
    (!r.fecha_ini || new Date(r.fecha_ini) > hoy)
  );
  
  const activas = reservas.filter((r) => 
    r.estado === "C" || // Canceladas van aquí
    (r.fecha_ini && new Date(r.fecha_ini) <= hoy)
  );

  // NUEVA FUNCIÓN: Abrir modal del cliente
  const handleVerCliente = (reserva: ReservaHotel) => {
    if (typeof reserva.datos_cliente === 'object' && reserva.datos_cliente !== null) {
      setClienteSeleccionado(reserva.datos_cliente);
      setIsClienteModalOpen(true);
    }
  };

  // ✅ Función segura para obtener información de habitación
  const getHabitacionInfo = (reserva: ReservaHotel) => {
    if (typeof reserva.habitacion === 'object' && reserva.habitacion !== null) {
      return reserva.habitacion.numero || '-';
    }
    return reserva.habitacion || '-';
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
                const tieneDatosCliente = typeof reserva.datos_cliente === 'object' && reserva.datos_cliente !== null;

                return (
                  <TableRow
                    key={reserva.id_reserva_hotel}
                    className="transition-colors duration-150 hover:bg-[#fff3ef]/30 dark:hover:bg-white/[0.05]"
                  >
                    {/* Código de Reserva */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start font-semibold text-gray-900 dark:text-white">
                      {codigoReserva}
                    </TableCell>

                    {/* Número de Habitación */}
                    <TableCell className="px-4 py-4 sm:px-6 text-start font-semibold text-gray-900 dark:text-white">
                      {habitacionInfo}
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

                    {/* 👁️ Ver - MODIFICADO */}
                    <TableCell className="px-4 py-4 sm:px-6 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center justify-center ${
                          tieneDatosCliente 
                            ? "text-[#26a5b9] hover:bg-[#26a5b9] hover:text-white" 
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() => tieneDatosCliente && handleVerCliente(reserva)}
                        disabled={!tieneDatosCliente}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>

                    {/* ✏️ / ❌ Acciones solo en tabla 1 y solo para reservas NO canceladas */}
                    {withActions && (
                      <TableCell className="px-4 py-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#26a5b9]"
                            onClick={() => onEdit?.(reserva)}
                            disabled={reserva.estado === "C"}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => onCancel?.(reserva)}
                            disabled={reserva.estado === "C"}
                          >
                            {reserva.estado === "C" ? "Cancelada" : "Cancelar"}
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
      {/* Modal del Cliente */}
      <VerClienteModal
        isOpen={isClienteModalOpen}
        onClose={() => {
          setIsClienteModalOpen(false);
          setClienteSeleccionado(null);
        }}
        cliente={clienteSeleccionado}
      />

      {/* 🟡 Con acciones - Solo reservas NO canceladas y futuras */}
      {renderTable(futuras, "Reservas Próximas o sin Check-In", true)}
      
      {/* 🟢 Sin acciones - Reservas canceladas, en curso o finalizadas */}
      {renderTable(activas, "Reservas en Curso, Finalizadas o Canceladas")}
    </div>
  );
}