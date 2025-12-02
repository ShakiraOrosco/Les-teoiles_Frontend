// components/modals/AdReservas/Reserva_Evento/CheckInOutEventoModal.tsx
import React from 'react';
import Button from '../../../ui/button/Button';
import { FaSignInAlt, FaSignOutAlt, FaTimes, FaCalendar, FaUsers, FaClock } from 'react-icons/fa';

interface CheckInOutEventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'checkin' | 'checkout';
  reservaInfo: {
    id: number;
    cliente: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    cantPersonas: number;
    servicios?: string[];
    checkIn?: string;
  };
  isLoading: boolean;
}

const CheckInOutEventoModal: React.FC<CheckInOutEventoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  reservaInfo,
  isLoading,
}) => {
  if (!isOpen) return null;

  const isCheckIn = type === 'checkin';
  const title = isCheckIn ? 'Confirmar Ingreso Evento' : 'Confirmar Salida Evento';
  const icon = isCheckIn ? FaSignInAlt : FaSignOutAlt;
  const buttonText = isCheckIn ? 'Confirmar Ingreso' : 'Confirmar Salida';
  const IconComponent = icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <IconComponent className={`w-6 h-6 ${isCheckIn ? 'text-green-600' : 'text-blue-600'}`} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Información de la reserva */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Reserva ID:</span>
              <span className="font-semibold text-gray-900 dark:text-white">EVT{reservaInfo.id}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FaUsers className="text-gray-400 w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {reservaInfo.cliente} • {reservaInfo.cantPersonas} personas
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FaCalendar className="text-gray-400 w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {reservaInfo.fecha}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FaClock className="text-gray-400 w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {reservaInfo.horaInicio} - {reservaInfo.horaFin}
              </span>
            </div>

            {/* Servicios contratados */}
            {reservaInfo.servicios && reservaInfo.servicios.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Servicios:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {reservaInfo.servicios.map((servicio, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
                    >
                      {servicio}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingreso anterior (para salida) */}
            {!isCheckIn && reservaInfo.checkIn && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingreso:</span>
                <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                  {new Date(reservaInfo.checkIn).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Mensaje de confirmación */}
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {isCheckIn 
              ? '¿Estás seguro de que deseas registrar el ingreso para este evento?'
              : '¿Estás seguro de que deseas registrar la salida y finalizar el evento?'
            }
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={isCheckIn ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
          >
            {isLoading ? 'Procesando...' : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckInOutEventoModal;