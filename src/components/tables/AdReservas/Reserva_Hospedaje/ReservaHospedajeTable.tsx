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
import { FaSignInAlt, FaSignOutAlt, FaUndo, FaEye, FaEdit, FaTimes, FaBed, FaExclamationTriangle, FaCalendar } from 'react-icons/fa';
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
  // ESTADOS
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
  const [modalCheckInOut, setModalCheckInOut] = useState<'checkin' | 'checkout' | null>(null);
  const [modalCancelarCheckIn, setModalCancelarCheckIn] = useState<boolean>(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaHotel | null>(null);
  const [error, setError] = useState<string | null>(null);

  // HOOK PARA CHECK-IN/OUT
  const { 
    realizarCheckIn, 
    realizarCheckOut, 
    cancelarCheckIn,
    isLoading: isLoadingCheckInOut,
    error: errorCheckInOut,
    clearError 
  } = useCheckInOut();

  // 🔹 REEMPLAZA la función getHoyBolivia y el filtrado de pendientes con esto:

const getHoyBolivia = () => {
  const ahora = new Date();
  // Obtener la fecha en formato YYYY-MM-DD para Bolivia
  return ahora.toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' });
};

const hoyBolivia = getHoyBolivia();
const fechaHoy = new Date(hoyBolivia);

console.log("🎯 FECHA DE COMPARACIÓN (Bolivia):", hoyBolivia);
console.log("📦 Total reservas recibidas:", reservas.length);

// 🔹 CATEGORÍAS CORREGIDAS - ORDEN IMPORTANTE: EVALUAR FINALIZADAS PRIMERO
// 1️⃣ PRIMERO: Finalizadas/Canceladas (tienen prioridad sobre cualquier otra categoría)
const finalizadasCanceladas = reservas.filter((r) => {
  const fechaInicio = r.fecha_ini ? new Date(r.fecha_ini) : null;
  const fechaFin = r.fecha_fin ? new Date(r.fecha_fin) : null;
  
  // Reservas que ya pasaron su período válido (fecha_fin < hoy)
  const yaExpiro = fechaFin ? fechaFin < fechaHoy : false;
  
  return (
    r.check_out !== null || // ✅ Con check-out (PRIORIDAD MÁXIMA)
    r.estado === "C" || // Canceladas
    r.estado === "F" || // Finalizadas (por estado)
    (r.estado === "A" && yaExpiro && !r.check_in) // Expiradas sin check-in
  );
});

// 2️⃣ SEGUNDO: En Curso (excluir las ya finalizadas)
const enCurso = reservas.filter((r) => {
  // No debe estar en finalizadas
  const estaFinalizada = finalizadasCanceladas.some(f => f.id_reserva_hotel === r.id_reserva_hotel);
  
  // Reservas activas con check-in pero sin check-out
  return !estaFinalizada && r.estado === "A" && r.check_in && !r.check_out;
});

// 3️⃣ TERCERO: Pendientes (excluir finalizadas y en curso)
const pendientes = reservas.filter((r) => {
  console.log(`🔍 Reserva ${r.id_reserva_hotel}:`, {
    estado: r.estado,
    fecha_ini: r.fecha_ini,
    fecha_fin: r.fecha_fin,
    check_in: r.check_in,
    check_out: r.check_out
  });

  // No debe estar en finalizadas ni en curso
  const estaFinalizada = finalizadasCanceladas.some(f => f.id_reserva_hotel === r.id_reserva_hotel);
  const estaEnCurso = enCurso.some(c => c.id_reserva_hotel === r.id_reserva_hotel);

  // ✅ CORREGIDO: Reservas activas sin check-in Y dentro del período válido
  const fechaInicio = r.fecha_ini ? new Date(r.fecha_ini) : null;
  const fechaFin = r.fecha_fin ? new Date(r.fecha_fin) : null;
  
  // Verificar si está dentro del período: fecha_ini <= hoy <= fecha_fin
  const dentroDelPeriodo = fechaInicio && fechaFin 
    ? (fechaInicio <= fechaHoy && fechaFin >= fechaHoy)
    : false;
  
  // O si la fecha de inicio es futura
  const esFutura = fechaInicio ? fechaInicio > fechaHoy : false;
  
  const esPendiente = !estaFinalizada && !estaEnCurso && r.estado === "A" && !r.check_in && (dentroDelPeriodo || esFutura);
  
  if (esPendiente) {
    console.log(`✅ Reserva ${r.id_reserva_hotel} -> PENDIENTE`);
  } else {
    console.log(`❌ Reserva ${r.id_reserva_hotel} -> NO PENDIENTE`);
  }
  
  return esPendiente;
});

console.log("📊 RESUMEN FINAL:");
console.log("- Pendientes (activas sin check-in, dentro del período o futuras):", pendientes.length);
console.log("- En curso (activas con check-in):", enCurso.length);
console.log("- Finalizadas/Canceladas/Expiradas:", finalizadasCanceladas.length);

  // FUNCIONES PARA CHECK-IN/OUT
  const handleCheckIn = (reserva: ReservaHotel) => {
    setReservaSeleccionada(reserva);
    setModalCheckInOut('checkin');
    setError(null);
  };

  const handleCheckOut = (reserva: ReservaHotel) => {
    setReservaSeleccionada(reserva);
    setModalCheckInOut('checkout');
    setError(null);
  };

  const handleCancelarCheckIn = (reserva: ReservaHotel) => {
    setReservaSeleccionada(reserva);
    setModalCancelarCheckIn(true);
    setError(null);
  };

  const handleConfirmCheckInOut = async () => {
    if (!reservaSeleccionada || !modalCheckInOut || !reservaSeleccionada.id_reserva_hotel) {
      setError("Error: No se pudo identificar la reserva seleccionada");
      return;
    }

    try {
      let resultado;
      if (modalCheckInOut === 'checkin') {
        resultado = await realizarCheckIn(reservaSeleccionada.id_reserva_hotel);
      } else {
        resultado = await realizarCheckOut(reservaSeleccionada.id_reserva_hotel);
      }

      if (resultado) {
        setModalCheckInOut(null);
        setReservaSeleccionada(null);
        setError(null);
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      console.error('Error en operación:', err);
      setError(err.message || "Error al procesar la operación");
    }
  };

  const handleConfirmCancelarCheckIn = async () => {
    if (!reservaSeleccionada || !reservaSeleccionada.id_reserva_hotel) {
      setError("Error: No se pudo identificar la reserva seleccionada");
      return;
    }

    try {
      const resultado = await cancelarCheckIn(reservaSeleccionada.id_reserva_hotel);

      if (resultado) {
        setModalCancelarCheckIn(false);
        setReservaSeleccionada(null);
        setError(null);
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      console.error('Error al cancelar check-in:', err);
      setError(err.message || "Error al cancelar el check-in");
    }
  };

  const handleCloseCheckInOutModal = () => {
    setModalCheckInOut(null);
    setReservaSeleccionada(null);
    clearError();
    setError(null);
  };

  const handleCloseCancelarCheckInModal = () => {
    setModalCancelarCheckIn(false);
    setReservaSeleccionada(null);
    clearError();
    setError(null);
  };

  // FUNCIONES PARA CLIENTE
  const handleVerCliente = (reserva: ReservaHotel) => {
    if (typeof reserva.datos_cliente === 'object' && reserva.datos_cliente !== null) {
      setClienteSeleccionado(reserva.datos_cliente);
      setIsClienteModalOpen(true);
    } else {
      setError("No hay información del cliente disponible");
    }
  };

  const getHabitacionInfo = (reserva: ReservaHotel) => {
    if (typeof reserva.habitacion === 'object' && reserva.habitacion !== null) {
      return `Habitación ${reserva.habitacion.numero || '-'}`;
    }
    return reserva.habitacion?.toString() || 'Sin asignar';
  };  

  const getNombreCliente = (reserva: ReservaHotel) => {
    if (typeof reserva.datos_cliente === 'object' && reserva.datos_cliente !== null) {
      return `${reserva.datos_cliente.nombre || ''} ${reserva.datos_cliente.app_paterno || ''}`.trim();
    }
    return 'Cliente no disponible';
  };

  const getEstadoLabel = (reserva: ReservaHotel) => {
    const fechaInicio = reserva.fecha_ini ? new Date(reserva.fecha_ini) : null;
    const hoy = new Date(hoyBolivia);
    
    if (reserva.estado === "C") return { label: "Cancelado", color: "error" };
    if (reserva.estado === "F") return { label: "Finalizado", color: "info" };
    if (reserva.check_out) return { label: "Finalizado", color: "info" };
    if (reserva.check_in) return { label: "En Curso", color: "success" };
    
    // Reservas activas sin check-in
    if (reserva.estado === "A") {
      if (fechaInicio && fechaInicio < hoy) {
        return { label: "No Realizado", color: "warning" };
      }
      if (fechaInicio && fechaInicio.toDateString() === hoy.toDateString()) {
        return { label: "Hoy", color: "primary" };
      }
    }
    
    return { label: "Pendiente", color: "warning" };
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
    withActions: boolean = false,
    showCliente: boolean = true,
    showEditCancel: boolean = false
  ) => {
    console.log(`📋 Renderizando tabla: ${titulo}, datos: ${data.length}`);
    
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white mb-8 dark:border-white/[0.05] dark:bg-white/[0.03] shadow-lg">
        <div className="bg-gradient-to-r from-[#0E7C7B] to-[#2A9D8F] px-5 py-4 font-semibold text-white">
          <div className="flex items-center justify-between">
            <span className="text-lg">{titulo}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {data.length} reserva{data.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <TableRow>
                <TableCell isHeader className="px-5 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Código
                </TableCell>
                {showCliente && (
                  <TableCell isHeader className="px-5 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Cliente
                  </TableCell>
                )}
                <TableCell isHeader className="px-5 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Habitación
                </TableCell>
                <TableCell isHeader className="px-5 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Fechas
                </TableCell>
                <TableCell isHeader className="px-5 py-4 text-start text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Estado
                </TableCell>
                {withActions && (
                  <TableCell isHeader className="px-5 py-4 text-center text-theme-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-center py-12 text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <FaBed className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium mb-2">No hay reservas en esta categoría</p>
                      <p className="text-sm text-gray-400">Las reservas aparecerán aquí según su estado</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((reserva) => {
                  const estado = getEstadoLabel(reserva);
                  const codigoReserva = `RES${reserva.id_reserva_hotel}`;
                  const habitacionInfo = getHabitacionInfo(reserva);
                  const nombreCliente = getNombreCliente(reserva);

                  return (
                    <TableRow
                      key={reserva.id_reserva_hotel}
                      className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-gray-800 dark:hover:to-gray-700 border-l-4 border-l-transparent hover:border-l-[#2A9D8F]"
                    >
                      {/* Código de Reserva */}
                      <TableCell className="px-5 py-4 text-start">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">
                          {codigoReserva}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          ID: {reserva.id_reserva_hotel}
                        </div>
                      </TableCell>

                      {/* Cliente */}
                      {showCliente && (
                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {nombreCliente}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {reserva.cant_personas} persona{reserva.cant_personas !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <button
                              onClick={() => handleVerCliente(reserva)}
                              className="p-2 text-[#2A9D8F] hover:bg-[#2A9D8F] hover:text-white rounded-lg transition-all duration-200 border border-[#2A9D8F]"
                              title="Ver información del cliente"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      )}

                      {/* Habitación */}
                      <TableCell className="px-5 py-4 text-start">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {habitacionInfo}
                        </div>
                      </TableCell>

                      {/* Fechas */}
                      <TableCell className="px-5 py-4 text-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FaCalendar className="w-3 h-3 text-[#2A9D8F]" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Inicio:</span>
                            <span className="text-sm text-gray-900 dark:text-white font-semibold">
                              {reserva.fecha_ini || (
                                <span className="italic text-gray-400">Sin fecha</span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendar className="w-3 h-3 text-[#0E7C7B]" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fin:</span>
                            <span className="text-sm text-gray-900 dark:text-white font-semibold">
                              {reserva.fecha_fin || (
                                <span className="italic text-gray-400">-</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Estado */}
                      <TableCell className="px-5 py-4 text-start">
                        <Badge 
                          size="md" 
                          color={estado.color as any}
                        >
                          {estado.label}
                        </Badge>
                      </TableCell>

                      {/* Acciones */}
                      {withActions && (
                        <TableCell className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* BOTÓN CHECK-IN */}
                            {puedeHacerCheckIn(reserva) && (
                              <button
                                onClick={() => handleCheckIn(reserva)}
                                disabled={isLoadingCheckInOut}
                                title="Realizar Check-In"
                                className="p-3 bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
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
                                className="p-3 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
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
                                className="p-3 bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-400 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <FaUndo className="w-4 h-4" />
                              </button>
                            )}

                            {/* BOTÓN EDITAR */}
                            {showEditCancel && (
                              <button
                                onClick={() => onEdit?.(reserva)}
                                disabled={reserva.estado === "C" || isLoadingCheckInOut}
                                title="Editar reserva"
                                className="p-3 bg-[#2A9D8F] text-white hover:bg-[#23857a] disabled:bg-gray-400 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                            )}

                            {/* BOTÓN CANCELAR */}
                            {showEditCancel && (
                              <button
                                onClick={() => onCancel?.(reserva)}
                                disabled={reserva.estado === "C" || isLoadingCheckInOut}
                                title="Cancelar reserva"
                                className="p-3 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
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
  };

  return (
    <div className="space-y-8">
      {/* Alertas de error */}
      {(error || errorCheckInOut) && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-300 font-medium">
                {error || errorCheckInOut}
              </p>
              <button 
                onClick={() => { setError(null); clearError(); }}
                className="mt-2 text-red-600 dark:text-red-400 text-sm hover:underline font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Información del sistema */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
            <FaBed className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
            cliente: getNombreCliente(reservaSeleccionada),
            habitacion: getHabitacionInfo(reservaSeleccionada),
            fechaInicio: reservaSeleccionada.fecha_ini || '',
            fechaFin: reservaSeleccionada.fecha_fin || '',
            checkIn: reservaSeleccionada.check_in || ''
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

      {/* 🟡 TABLA 1: Reservas Pendientes (CHECK-IN + EDITAR + CANCELAR) */}
      {renderTable(pendientes, "Reservas Pendientes - Listas para Check-In", true, true, true)}
      
      {/* 🟢 TABLA 2: Reservas en Curso (SOLO CHECK-OUT) */}
      {renderTable(enCurso, "Reservas en Curso - Pendientes de Check-Out", true, true, false)}
      
      {/* 🔴 TABLA 3: Finalizadas y Canceladas (SIN ACCIONES) */}
      {renderTable(finalizadasCanceladas, "Reservas Finalizadas y Canceladas", false, true, false)}
    </div>
  );
}