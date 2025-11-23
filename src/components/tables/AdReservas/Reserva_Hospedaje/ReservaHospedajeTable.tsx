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
import { FaSignInAlt, FaSignOutAlt, FaUndo } from 'react-icons/fa';
import { ReservaHotel } from "../../../../types/AdReserva/Reserva_Hospedaje/hospedaje";
import VerClienteModal from "../../../modals/AdReservas/Reserva_Hospedaje/VerClienteModal";
import { useCheckInOut } from '../../../../hooks/AdReservas/Reserva_Hospedaje/useCheckInOut';
import CheckInOutModal from '../../../modals/AdReservas/Reserva_Hospedaje/CheckInOutModal';

interface ReservasTableProps {
  reservas: ReservaHotel[];
  onEdit?: (reserva: ReservaHotel) => void;
  onCancel?: (reserva: ReservaHotel) => void;
  onRefresh?: () => void;
}

export default function ReservasTable({ reservas, onEdit, onCancel, onRefresh }: ReservasTableProps) {
  // ESTADOS EXISTENTES
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);

  // NUEVOS ESTADOS PARA CHECK-IN/OUT
  const [modalCheckInOut, setModalCheckInOut] = useState<'checkin' | 'checkout' | null>(null);
  const [modalCancelarCheckIn, setModalCancelarCheckIn] = useState<boolean>(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaHotel | null>(null);

  // NUEVO HOOK
  const { 
    realizarCheckIn, 
    realizarCheckOut, 
    cancelarCheckIn,
    isLoading: isLoadingCheckInOut,
    error: errorCheckInOut,
    clearError 
  } = useCheckInOut();

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

  // NUEVAS FUNCIONES PARA CHECK-IN/OUT
  const handleCheckIn = (reserva: ReservaHotel) => {
    setReservaSeleccionada(reserva);
    setModalCheckInOut('checkin');
  };

  const handleCheckOut = (reserva: ReservaHotel) => {
    setReservaSeleccionada(reserva);
    setModalCheckInOut('checkout');
  };

  const handleCancelarCheckIn = (reserva: ReservaHotel) => {
    setReservaSeleccionada(reserva);
    setModalCancelarCheckIn(true);
  };

  const handleConfirmCheckInOut = async () => {
    if (!reservaSeleccionada || !modalCheckInOut || !reservaSeleccionada.id_reserva_hotel) return;

    try {
      let resultado;
      if (modalCheckInOut === 'checkin') {
        resultado = await realizarCheckIn(reservaSeleccionada.id_reserva_hotel);
      } else {
        resultado = await realizarCheckOut(reservaSeleccionada.id_reserva_hotel);
      }

      if (resultado) {
        // Cerrar modal y limpiar estados
        setModalCheckInOut(null);
        setReservaSeleccionada(null);
        
        // Recargar datos si se proporcionó la función
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (err) {
      // El error ya se maneja en el hook
      console.error('Error en operación:', err);
    }
  };

  const handleConfirmCancelarCheckIn = async () => {
    if (!reservaSeleccionada || !reservaSeleccionada.id_reserva_hotel) return;

    try {
      const resultado = await cancelarCheckIn(reservaSeleccionada.id_reserva_hotel);

      if (resultado) {
        // Cerrar modal y limpiar estados
        setModalCancelarCheckIn(false);
        setReservaSeleccionada(null);
        
        // Recargar datos si se proporcionó la función
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (err) {
      console.error('Error al cancelar check-in:', err);
    }
  };

  const handleCloseCheckInOutModal = () => {
    setModalCheckInOut(null);
    setReservaSeleccionada(null);
    clearError();
  };

  const handleCloseCancelarCheckInModal = () => {
    setModalCancelarCheckIn(false);
    setReservaSeleccionada(null);
    clearError();
  };

  // FUNCIONES EXISTENTES...
  const handleVerCliente = (reserva: ReservaHotel) => {
    if (typeof reserva.datos_cliente === 'object' && reserva.datos_cliente !== null) {
      setClienteSeleccionado(reserva.datos_cliente);
      setIsClienteModalOpen(true);
    }
  };

  const getHabitacionInfo = (reserva: ReservaHotel) => {
    if (typeof reserva.habitacion === 'object' && reserva.habitacion !== null) {
      return reserva.habitacion.numero?.toString() || '-';
    }
    return reserva.habitacion?.toString() || '-';
  };  

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

  // FUNCIONES PARA DETERMINAR DISPONIBILIDAD DE ACCIONES
  const puedeHacerCheckIn = (reserva: ReservaHotel) => {
    return reserva.estado === 'A' && !reserva.check_in;
  };

  const puedeHacerCheckOut = (reserva: ReservaHotel) => {
    return reserva.estado === 'A' && reserva.check_in && !reserva.check_out;
  };

  const puedeCancelarCheckIn = (reserva: ReservaHotel) => {
    return reserva.estado === 'A' && reserva.check_in && !reserva.check_out;
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

                    {/* ✏️ / ❌ / ✅ Acciones solo en tabla 1 y solo para reservas NO canceladas */}
                    {withActions && (
                      <TableCell className="px-4 py-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* BOTÓN CHECK-IN */}
                          {puedeHacerCheckIn(reserva) && (
                            <button
                              onClick={() => handleCheckIn(reserva)}
                              disabled={isLoadingCheckInOut}
                              title="Realizar Check-In"
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors border border-green-600"
                            >
                              <FaSignInAlt className="w-4 h-4" />
                            </button>
                          )}

                          {/* BOTÓN CHECK-OUT */}
                          {puedeHacerCheckOut(reserva) && (
                            <button
                              onClick={() => handleCheckOut(reserva)}
                              disabled={isLoadingCheckInOut}
                              title="Realizar Check-Out"
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-600"
                            >
                              <FaSignOutAlt className="w-4 h-4" />
                            </button>
                          )}

                          {/* BOTÓN CANCELAR CHECK-IN */}
                          {puedeCancelarCheckIn(reserva) && (
                            <button
                              onClick={() => handleCancelarCheckIn(reserva)}
                              disabled={isLoadingCheckInOut}
                              title="Cancelar Check-In"
                              className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors border border-orange-600"
                            >
                              <FaUndo className="w-4 h-4" />
                            </button>
                          )}

                          {/* BOTÓN EDITAR */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#26a5b9]"
                            onClick={() => onEdit?.(reserva)}
                            disabled={reserva.estado === "C"}
                          >
                            Editar
                          </Button>

                          {/* BOTÓN CANCELAR */}
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

      {/* Modal de Check-In/Out */}
      {modalCheckInOut && reservaSeleccionada && (
        <CheckInOutModal
          isOpen={!!modalCheckInOut}
          onClose={handleCloseCheckInOutModal}
          onConfirm={handleConfirmCheckInOut}
          type={modalCheckInOut}
          reservaInfo={{
            id: reservaSeleccionada.id_reserva_hotel || 0,
            cliente: typeof reservaSeleccionada.datos_cliente === 'object' 
              ? `${reservaSeleccionada.datos_cliente.nombre || ''} ${reservaSeleccionada.datos_cliente.app_paterno || ''}`
              : 'Cliente no disponible',
            habitacion: getHabitacionInfo(reservaSeleccionada),
            fechaInicio: reservaSeleccionada.fecha_ini || '',
            fechaFin: reservaSeleccionada.fecha_fin || '',
            checkIn: (reservaSeleccionada as any).check_in || ''
          }}
          isLoading={isLoadingCheckInOut}
        />
      )}

      {/* Modal para Cancelar Check-In */}
      {modalCancelarCheckIn && reservaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <FaUndo className="text-orange-600 w-6 h-6" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cancelar Check-In
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              ¿Estás seguro de que deseas cancelar el check-in de la reserva <strong>RES{reservaSeleccionada.id_reserva_hotel}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCloseCancelarCheckInModal}
                disabled={isLoadingCheckInOut}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmCancelarCheckIn}
                disabled={isLoadingCheckInOut}
              >
                {isLoadingCheckInOut ? 'Cancelando...' : 'Sí, Cancelar Check-In'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar errores de check-in/out */}
      {errorCheckInOut && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{errorCheckInOut}</p>
          <button 
            onClick={clearError}
            className="mt-2 text-red-600 dark:text-red-400 text-sm hover:underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* 🟡 Con acciones - Solo reservas NO canceladas y futuras */}
      {renderTable(futuras, "Reservas Próximas o sin Check-In", true)}
      
      {/* 🟢 Sin acciones - Reservas canceladas, en curso o finalizadas */}
      {renderTable(activas, "Reservas en Curso, Finalizadas o Canceladas")}
    </div>
  );
}