// src/components/modals/AdReservas/Reserva_Eventos/ViewEventoModal.tsx
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import Badge from "../../../ui/badge/Badge";
import { 
  X, 
  User, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  CreditCard,
  MapPin,
  Sparkles
} from "lucide-react";
import { ReservaEvento } from "../../../../types/AdReserva/Reservas_Eventos/eventos";

interface ViewEventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: ReservaEvento | null;
}

export default function ViewEventoModal({ 
  isOpen, 
  onClose, 
  reserva 
}: ViewEventoModalProps) {
  if (!isOpen || !reserva) return null;

  // ✅ Función segura para obtener información del cliente
  const getClienteInfo = () => {
    if (reserva.datos_cliente) {
      const cliente = reserva.datos_cliente;
      return {
        nombreCompleto: `${cliente.nombre || ''} ${cliente.app_paterno || ''} ${cliente.app_materno || ''}`.trim(),
        telefono: cliente.telefono || 'No especificado',
        email: cliente.email || 'No especificado',
        carnet: cliente.ci || 'No especificado'
      };
    }
    return {
      nombreCompleto: 'Cliente no disponible',
      telefono: 'No especificado',
      email: 'No especificado',
      carnet: 'No especificado'
    };
  };

  // ✅ Función para obtener servicios
  const getServiciosInfo = () => {
    if (reserva.servicios_adicionales && reserva.servicios_adicionales.length > 0) {
      return reserva.servicios_adicionales.map(servicio => ({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || 'Sin descripción',
        precio: servicio.precio || 0,
        tipo: servicio.tipo || 'E'
      }));
    }
    return [];
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
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  // ✅ Calcular total de servicios
  const calcularTotalServicios = () => {
    return getServiciosInfo().reduce((total, servicio) => total + servicio.precio, 0);
  };

  // ✅ Obtener estado con color
  const getEstadoInfo = () => {
    const hoy = new Date();
    const fechaEvento = new Date(reserva.fecha);
    const estado = reserva.estado;

    switch (estado) {
      case 'C':
        return { label: "Cancelado", color: "error" as const, icon: "❌" };
      case 'F':
        return { label: "Finalizado", color: "info" as const, icon: "✅" };
      case 'P':
        return { label: "Pendiente", color: "warning" as const, icon: "⏳" };
      case 'A':
        if (fechaEvento > hoy) {
          return { label: "Confirmado", color: "success" as const, icon: "📅" };
        } else if (fechaEvento.toDateString() === hoy.toDateString()) {
          return { label: "Hoy", color: "primary" as const, icon: "🎉" };
        } else {
          return { label: "En Curso", color: "success" as const, icon: "🔥" };
        }
      default:
        return { label: "Desconocido", color: "warning" as const, icon: "❓" };
    }
  };

  const clienteInfo = getClienteInfo();
  const servicios = getServiciosInfo();
  const estadoInfo = getEstadoInfo();
  const totalServicios = calcularTotalServicios();
  const codigoReserva = `EVT${reserva.id_reservas_evento.toString().padStart(4, '0')}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Detalles del Evento
              </h2>
              <p className="text-sm text-gray-500">
                Código: {codigoReserva}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda - Información Principal */}
          <div className="space-y-6">
            {/* Información del Evento */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Información del Evento
              </h3>
              
              <div className="space-y-3">

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Fecha:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatFecha(reserva.fecha)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Horario:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatHora(reserva.hora_ini)} - {formatHora(reserva.hora_fin)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Duración:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {reserva.duracion_horas ? `${reserva.duracion_horas.toFixed(1)} horas` : 'No especificada'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Personas:</span>
                  <span className="text-sm text-gray-900 font-medium flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {reserva.cant_personas}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <Badge color={estadoInfo.color} size="sm">
                    {estadoInfo.icon} {estadoInfo.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Información del Cliente
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Nombre:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {clienteInfo.nombreCompleto}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                  <span className="text-sm text-gray-900 font-medium flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {clienteInfo.telefono}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <span className="text-sm text-gray-900 font-medium flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {clienteInfo.email}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Carnet:</span>
                  <span className="text-sm text-gray-900 font-medium flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    {clienteInfo.carnet}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Servicios y Resumen */}
          <div className="space-y-6">
            {/* Servicios Adicionales */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Servicios Adicionales
              </h3>
              
              {servicios.length > 0 ? (
                <div className="space-y-3">
                  {servicios.map((servicio, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-white rounded-lg border border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">{servicio.nombre}</p>
                        <p className="text-xs text-gray-500 mt-1">{servicio.descripcion}</p>
                        <p className="text-xs text-teal-600 font-medium mt-1">
                          Tipo: {servicio.tipo === 'A' ? 'Por persona' : 'Precio fijo'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {servicio.precio.toFixed(2)} Bs.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No hay servicios adicionales</p>
                </div>
              )}
            </div>

            {/* Resumen de Costos */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-600" />
                Resumen de Costos
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total servicios:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {totalServicios.toFixed(2)} Bs.
                  </span>
                </div>
                
                {reserva.reservas_gen.pago && (
                  <div className="flex justify-between items-center pt-2 border-t border-teal-200">
                    <span className="text-sm font-medium text-gray-600">Adelanto (50%):</span>
                    <span className="text-sm font-semibold text-amber-600">
                      {reserva.reservas_gen.pago.toFixed(2)} Bs.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                📋 Información Importante
              </h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Presentar código de reserva al llegar</li>
                <li>• Llegar 15 minutos antes del evento</li>
                <li>• El 50% restante se paga en recepción</li>
                <li>• Cancelaciones con 48h de anticipación</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            Imprimir Detalles
          </Button>
        </div>
      </div>
    </Modal>
  );
}