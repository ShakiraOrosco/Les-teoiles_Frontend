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
import { FaSignInAlt, FaSignOutAlt, FaUndo, FaEye, FaEdit, FaTimes, FaCalendar, FaUsers, FaClock } from 'react-icons/fa';
import { ReservaEvento } from "../../../../types/AdReserva/Reservas_Eventos/eventos";
import ViewEventoModal from "../../../modals/AdReservas/Reserva_Eventos/ViewEventoModal";
import { useCheckInOutEvento } from '../../../../hooks/AdReservas/Reserva_Eventos/useCheckInOutEvento';
import CheckInOutEventoModal from '../../../modals/AdReservas/Reserva_Eventos/CheckInOutEventoModal';

interface ReservasEventoTableProps {
  reservas: ReservaEvento[];
  onEdit?: (reserva: ReservaEvento) => void;
  onCancel?: (reserva: ReservaEvento) => void;
  onView?: (reserva: ReservaEvento) => void;
  onRefresh?: () => void;
}

export default function ReservasEventoTable({
  reservas,
  onEdit,
  onCancel,
  onView,
  onRefresh
}: ReservasEventoTableProps) {
  // ESTADOS
  const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<ReservaEvento | null>(null);
  const [modalCheckInOut, setModalCheckInOut] = useState<'checkin' | 'checkout' | null>(null);
  const [modalCancelarCheckIn, setModalCancelarCheckIn] = useState<boolean>(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaEvento | null>(null);

  // HOOK PARA CHECK-IN/OUT
  const {
    realizarCheckIn,
    realizarCheckOut,
    cancelarCheckIn,
    isLoading: isLoadingCheckInOut,
    error: errorCheckInOut,
    clearError
  } = useCheckInOutEvento();

  // 🔹 Obtener fecha y hora actual en Bolivia
  const getHoyBolivia = () => {
    const ahora = new Date();
    return ahora.toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' });
  };

  const getAhoraBolivia = () => {
    // Obtener fecha y hora actual en Bolivia
    return new Date().toLocaleString('en-US', { timeZone: 'America/La_Paz' });
  };

  const hoyBolivia = getHoyBolivia();
  const ahoraBolivia = new Date(getAhoraBolivia());

  // 🔹 TRES CATEGORÍAS DE EVENTOS - CORREGIDO con comparación de strings y horas
  const futuras = reservas.filter((r) => {
    // Eventos activos sin check-in
    const fechaEventoStr = r.fecha.split('T')[0];
    
    // Si es una fecha futura, incluir
    if (fechaEventoStr > hoyBolivia && r.estado === "A" && !r.check_in) {
      return true;
    }
    
    // Si es hoy, verificar que la hora de fin no haya pasado
    if (fechaEventoStr === hoyBolivia && r.estado === "A" && !r.check_in) {
      const horaFin = new Date(r.hora_fin);
      return horaFin > ahoraBolivia; // Solo si la hora de fin es futura
    }
    
    return false;
  });

  const enCurso = reservas.filter((r) => {
    // Eventos activos con check-in pero sin check-out
    return r.estado === "A" && r.check_in && !r.check_out;
  });

  const finalizadasCanceladas = reservas.filter((r) => {
    // Eventos cancelados, finalizados O con check-out realizado
    // O eventos pasados sin check-in (que nunca se realizaron)
    // O eventos de hoy cuya hora de fin ya pasó sin check-in
    const fechaEventoStr = r.fecha.split('T')[0];
    const esPasado = fechaEventoStr < hoyBolivia;
    
    // Si es de hoy, verificar si la hora ya pasó
    const esHoyHoraPasada = fechaEventoStr === hoyBolivia && 
                            r.hora_fin && 
                            new Date(r.hora_fin) <= ahoraBolivia &&
                            !r.check_in; // Solo si no hizo check-in

    return (
      r.estado === "C" || // Cancelados
      r.estado === "F" || // Finalizados
      r.check_out !== null || // Con check-out
      (r.estado === "A" && esPasado && !r.check_in) || // Eventos pasados sin check-in
      (r.estado === "A" && esHoyHoraPasada) // Eventos de hoy con hora pasada sin check-in
    );
  });

  // FUNCIONES PARA CHECK-IN/OUT
  const handleCheckIn = (reserva: ReservaEvento) => {
    setReservaSeleccionada(reserva);
    setModalCheckInOut('checkin');
  };

  const handleCheckOut = (reserva: ReservaEvento) => {
    setReservaSeleccionada(reserva);
    setModalCheckInOut('checkout');
  };

  const handleCancelarCheckIn = (reserva: ReservaEvento) => {
    setReservaSeleccionada(reserva);
    setModalCancelarCheckIn(true);
  };

  const handleConfirmCheckInOut = async () => {
    if (!reservaSeleccionada || !modalCheckInOut) return;

    try {
      let resultado;
      if (modalCheckInOut === 'checkin') {
        resultado = await realizarCheckIn(reservaSeleccionada.id_reservas_evento);
      } else {
        resultado = await realizarCheckOut(reservaSeleccionada.id_reservas_evento);
      }

      if (resultado) {
        setModalCheckInOut(null);
        setReservaSeleccionada(null);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Error en operación:', err);
    }
  };

  const handleConfirmCancelarCheckIn = async () => {
    if (!reservaSeleccionada) return;

    try {
      const resultado = await cancelarCheckIn(reservaSeleccionada.id_reservas_evento);

      if (resultado) {
        setModalCancelarCheckIn(false);
        setReservaSeleccionada(null);
        if (onRefresh) onRefresh();
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

  // FUNCIONES PARA VER EVENTO
  const handleVerEvento = (reserva: ReservaEvento) => {
    setEventoSeleccionado(reserva);
    setIsEventoModalOpen(true);
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
      // Parseamos la fecha localmente sin conversión UTC
      const [year, month, day] = fechaStr.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return '-';
    }
  };

  const getNombreCliente = (reserva: ReservaEvento) => {
    if (typeof reserva.datos_cliente === 'object' && reserva.datos_cliente !== null) {
      return `${reserva.datos_cliente.nombre || ''} ${reserva.datos_cliente.app_paterno || ''}`.trim();
    }
    return 'Cliente no disponible';
  };

  // ✅ Etiquetas visuales de estado - CORREGIDO
  const getEstadoLabel = (reserva: ReservaEvento) => {
    const estado = reserva.estado;

    // Si está cancelado o finalizado, mostrar eso primero
    if (estado === 'C') return { label: "Cancelado", color: "error" as const };
    if (estado === 'F') return { label: "Finalizado", color: "info" as const };

    // Si tiene check-out, está finalizado
    if (reserva.check_out) return { label: "Finalizado", color: "info" as const };

    // Extraer fecha del evento en formato YYYY-MM-DD
    const fechaEventoStr = reserva.fecha.split('T')[0];

    // Eventos activos
    if (estado === 'A') {
      if (reserva.check_in && !reserva.check_out) {
        return { label: "En Curso", color: "success" as const };
      }
      if (fechaEventoStr > hoyBolivia) {
        return { label: "Confirmado", color: "success" as const };
      }
      if (fechaEventoStr === hoyBolivia) {
        return { label: "Hoy", color: "primary" as const };
      }
      // Evento pasado sin check-in (no realizado)
      if (fechaEventoStr < hoyBolivia && !reserva.check_in) {
        return { label: "No Realizado", color: "warning" as const };
      }
    }

    return { label: "Pendiente", color: "warning" as const };
  };

  // FUNCIONES PARA DETERMINAR DISPONIBILIDAD DE ACCIONES
  const puedeHacerCheckIn = (reserva: ReservaEvento) => {
    return reserva.estado === 'A' && !reserva.check_in;
  };

  const puedeHacerCheckOut = (reserva: ReservaEvento) => {
    return reserva.estado === 'A' && reserva.check_in && !reserva.check_out;
  };

  const puedeCancelarCheckIn = (reserva: ReservaEvento) => {
    return reserva.estado === 'A' && reserva.check_in && !reserva.check_out;
  };

  const renderTable = (
    data: ReservaEvento[],
    titulo: string,
    withActions: boolean = false,
    showCliente: boolean = true,
    showCheckIn: boolean = false,
    showCheckOut: boolean = false,
    showEditCancel: boolean = false
  ) => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white mb-8 dark:border-white/[0.05] dark:bg-gray-900 shadow-xl">
      {/* HEADER MEJORADO */}
      <div className="bg-gradient-to-r from-[#0E7C7B] to-[#2A9D8F] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FaCalendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{titulo}</h3>
              <p className="text-white/80 text-sm">
                {data.length} evento{data.length !== 1 ? 's' : ''} encontrado{data.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="text-white font-semibold text-sm">
              {data.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <TableRow>
              <TableCell isHeader className="px-6 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Código
              </TableCell>
              {showCliente && (
                <TableCell isHeader className="px-6 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </TableCell>
              )}
              <TableCell isHeader className="px-6 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Fecha
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Horario
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Personas
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-center text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Detalles
              </TableCell>
              {withActions && (
                <TableCell isHeader className="px-6 py-4 text-center text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center py-16"
                >
                  <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <FaCalendar className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium mb-2">No hay eventos en esta categoría</p>
                    <p className="text-sm">Los eventos aparecerán aquí según su estado y fecha</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((reserva) => {
                const estado = getEstadoLabel(reserva);
                const codigoReserva = `EVT${reserva.id_reservas_evento.toString().padStart(4, '0')}`;
                const nombreCliente = getNombreCliente(reserva);

                return (
                  <TableRow
                    key={reserva.id_reservas_evento}
                    className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-gray-800 dark:hover:to-gray-700 group"
                  >
                    {/* Código de Reserva */}
                    <TableCell className="px-6 py-5 text-start">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-base">
                          {codigoReserva}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ID: {reserva.id_reservas_evento}
                        </span>
                      </div>
                    </TableCell>

                    {/* Cliente */}
                    {showCliente && (
                      <TableCell className="px-6 py-5 text-start">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {nombreCliente}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                              <FaEye
                                className="w-3 h-3 cursor-pointer hover:text-[#2A9D8F] transition-colors"
                                onClick={() => handleVerEvento(reserva)}
                                title="Ver información del evento"
                              />
                              <span>Ver detalles</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {/* Fecha del Evento */}
                    <TableCell className="px-6 py-5 text-start">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="w-4 h-4 text-[#2A9D8F] flex-shrink-0" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatFecha(reserva.fecha)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Horario */}
                    <TableCell className="px-6 py-5 text-start">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <FaClock className="w-3 h-3 text-[#0E7C7B]" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {formatHora(reserva.hora_ini)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="w-3 h-3 text-[#0E7C7B]" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {formatHora(reserva.hora_fin)}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Cantidad de Personas */}
                    <TableCell className="px-6 py-5 text-start">
                      <div className="flex items-center gap-2">
                        <FaUsers className="w-4 h-4 text-[#2A9D8F]" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {reserva.cant_personas}
                        </span>
                      </div>
                    </TableCell>

                    {/* Estado */}
                    <TableCell className="px-6 py-5 text-start">
                      <Badge
                        size="md"
                        color={estado.color}
                      >
                        {estado.label}
                      </Badge>
                    </TableCell>

                    {/* 👁️ Ver Detalles */}
                    <TableCell className="px-6 py-5 text-center">
                      <button
                        onClick={() => onView?.(reserva)}
                        className="p-3 bg-[#2A9D8F] text-white hover:bg-[#23857a] rounded-xl transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                        title="Ver detalles completos del evento"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </TableCell>

                    {/* Acciones */}
                    {withActions && (
                      <TableCell className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* BOTÓN CHECK-IN */}
                          {showCheckIn && puedeHacerCheckIn(reserva) && (
                            <button
                              onClick={() => handleCheckIn(reserva)}
                              disabled={isLoadingCheckInOut}
                              title="Realizar Check-In"
                              className="p-3 bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                            >
                              <FaSignInAlt className="w-4 h-4" />
                            </button>
                          )}

                          {/* BOTÓN CHECK-OUT */}
                          {showCheckOut && puedeHacerCheckOut(reserva) && (
                            <button
                              onClick={() => handleCheckOut(reserva)}
                              disabled={isLoadingCheckInOut}
                              title="Realizar Check-Out"
                              className="p-3 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                            >
                              <FaSignOutAlt className="w-4 h-4" />
                            </button>
                          )}

                          {/* BOTÓN CANCELAR CHECK-IN */}
                          {(showCheckIn || showCheckOut) && puedeCancelarCheckIn(reserva) && (
                            <button
                              onClick={() => handleCancelarCheckIn(reserva)}
                              disabled={isLoadingCheckInOut}
                              title="Cancelar Check-In"
                              className="p-3 bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-400 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                            >
                              <FaUndo className="w-4 h-4" />
                            </button>
                          )}

                          {/* BOTÓN EDITAR */}
                          {showEditCancel && (
                            <button
                              onClick={() => onEdit?.(reserva)}
                              disabled={reserva.estado === "C" || isLoadingCheckInOut}
                              title="Editar evento"
                              className="p-3 bg-[#0E7C7B] text-white hover:bg-[#0c6b6a] disabled:bg-gray-400 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                          )}

                          {/* BOTÓN CANCELAR */}
                          {showEditCancel && (
                            <button
                              onClick={() => onCancel?.(reserva)}
                              disabled={reserva.estado === "C" || isLoadingCheckInOut}
                              title="Cancelar evento"
                              className="p-3 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
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
    <div className="space-y-8">
      {/* Información del sistema */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
            <FaCalendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-blue-800 dark:text-blue-300 font-medium">
              Sistema de Gestión de Reservas
            </p>
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              Total de reservas: {reservas.length} | Hoy: {hoyBolivia}
            </p>
          </div>
        </div>
      </div>

      {/* Modal del Evento */}
      {eventoSeleccionado && (
        <ViewEventoModal
          isOpen={isEventoModalOpen}
          onClose={() => {
            setIsEventoModalOpen(false);
            setEventoSeleccionado(null);
          }}
          reserva={eventoSeleccionado}
        />
      )}

      {/* Modal de Check-In/Out */}
      {modalCheckInOut && reservaSeleccionada && (
        <CheckInOutEventoModal
          isOpen={!!modalCheckInOut}
          onClose={handleCloseCheckInOutModal}
          onConfirm={handleConfirmCheckInOut}
          type={modalCheckInOut}
          reservaInfo={{
            id: reservaSeleccionada.id_reservas_evento,
            cliente: getNombreCliente(reservaSeleccionada),
            fecha: formatFecha(reservaSeleccionada.fecha),
            horaInicio: formatHora(reservaSeleccionada.hora_ini),
            horaFin: formatHora(reservaSeleccionada.hora_fin),
            cantPersonas: reservaSeleccionada.cant_personas,
            servicios: reservaSeleccionada.servicios_adicionales?.map(s => s.nombre),
            checkIn: reservaSeleccionada.check_in || ''
          }}
          isLoading={isLoadingCheckInOut}
        />
      )}

      {/* Modal para Cancelar Check-In */}
      {modalCancelarCheckIn && reservaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <FaUndo className="text-orange-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cancelar Check-In
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              ¿Estás seguro de que deseas cancelar el check-in del evento <strong>EVT{reservaSeleccionada.id_reservas_evento}</strong>?
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
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isLoadingCheckInOut ? 'Cancelando...' : 'Sí, Cancelar Check-In'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar errores de check-in/out */}
      {errorCheckInOut && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <FaTimes className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-300 font-medium">
                {errorCheckInOut}
              </p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 🟡 TABLA 1: Eventos Futuros y de Hoy (CHECK-IN + EDITAR + CANCELAR) */}
      {renderTable(futuras, "Eventos de Hoy y Futuros - Pendientes de Check-In", true, true, true, false, true)}

      {/* 🟢 TABLA 2: Eventos en Curso (SOLO CHECK-OUT) */}
      {renderTable(enCurso, "Eventos en Curso - Pendientes de Check-Out", true, true, false, true, false)}

      {/* 🔴 TABLA 3: Eventos Finalizados y Canceladas (SIN ACCIONES) */}
      {renderTable(finalizadasCanceladas, "Eventos Finalizados y Cancelados", false, true, false, false, false)}
    </div>
  );
}