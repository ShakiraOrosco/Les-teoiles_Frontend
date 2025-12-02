// src/components/AdReservas/Reserva_Hospedaje/CheckInOutModal.tsx
import { FaSignInAlt, FaSignOutAlt, FaTimes, FaExclamationTriangle, FaCalendarAlt, FaUser, FaHome } from 'react-icons/fa';
import { Modal } from '../../../ui/modal';
import Button from '../../../ui/button/Button';

interface CheckInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'checkin' | 'checkout';
  reservaInfo: {
    id: number;
    cliente: string;
    habitacion: string;
    fechaInicio?: string;
    fechaFin?: string;
    checkIn?: string;
  };
  isLoading?: boolean;
}

export default function CheckInOutModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  reservaInfo,
  isLoading = false 
}: CheckInOutModalProps) {
  const getTitle = () => {
    return type === 'checkin' ? 'Confirmar ingreso' : 'Confirmar salida';
  };

  const getIcon = () => {
    return type === 'checkin' ? FaSignInAlt : FaSignOutAlt;
  };

  const getButtonText = () => {
    if (isLoading) {
      return type === 'checkin' ? 'Realizando ingreso...' : 'Realizando salida...';
    }
    return type === 'checkin' ? 'Confirmar ingreso' : 'Confirmar salida';
  };

  const IconComponent = getIcon();

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFechaHora = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              type === 'checkin' 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-blue-100 dark:bg-blue-900/20'
            }`}>
              <IconComponent 
                className={`w-6 h-6 ${
                  type === 'checkin' ? 'text-green-600' : 'text-blue-600'
                }`} 
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {getTitle()}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ID: RES{reservaInfo.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Información de la Reserva */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Información de la Reserva
            </h3>
            
            {/* Cliente */}
            <div className="flex items-center gap-3">
              <FaUser className="text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Cliente</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{reservaInfo.cliente}</p>
              </div>
            </div>

            {/* Habitación */}
            <div className="flex items-center gap-3">
              <FaHome className="text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Habitación</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{reservaInfo.habitacion}</p>
              </div>
            </div>

            {/* Fechas según el tipo */}
            {type === 'checkin' && reservaInfo.fechaInicio && (
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Fecha de Inicio</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFecha(reservaInfo.fechaInicio)}
                  </p>
                </div>
              </div>
            )}

            {type === 'checkout' && reservaInfo.checkIn && (
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Registro de ingreso Realizado</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFechaHora(reservaInfo.checkIn)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Advertencias */}
          {type === 'checkin' && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <FaExclamationTriangle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Confirmar llegada del huésped
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Al realizar el ingreso, se registrará la hora actual como hora de entrada.
                </p>
              </div>
            </div>
          )}

          {type === 'checkout' && (
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                  Acción irreversible
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Al realizar la salida, la reserva se marcará como <strong>Finalizada</strong> y no podrá ser modificada.
                </p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              className="min-w-24"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="min-w-24"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </div>
              ) : (
                getButtonText()
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}