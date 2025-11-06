import { useState, useEffect } from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash, FaCheck } from 'react-icons/fa';
import { Modal } from '../../../ui/modal';
import Button from '../../../ui/button/Button';
import { useCancelHospedaje } from '../../../../hooks/AdReservas/Reserva_Hospedaje/useToggleHospedaje';

interface EliminarReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  reservaId: number;
  codigoReserva?: string;
  tipo?: 'hospedaje' | 'evento' | 'reserva';
}

export default function EliminarReservaModal({
  isOpen,
  onClose,
  onConfirm,
  reservaId,
  codigoReserva,
  tipo = 'hospedaje'
}: EliminarReservaModalProps) {
  const { cancelReservaHotel, isCanceling, error } = useCancelHospedaje();
  const [confirmado, setConfirmado] = useState(false);

  // Resetear estado cuando se abre/cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setConfirmado(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    const success = await cancelReservaHotel(reservaId);
    
    if (success) {
      setConfirmado(true);
      // Esperar un momento antes de cerrar para mostrar el mensaje de éxito
      setTimeout(() => {
        onConfirm?.();
        onClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    if (!isCanceling) {
      setConfirmado(false);
      onClose();
    }
  };

  const getTitulo = () => {
    if (confirmado) {
      return 'Reserva Cancelada';
    }

    switch (tipo) {
      case 'hospedaje':
        return 'Cancelar Reserva de Hospedaje';
      case 'evento':
        return 'Cancelar Reserva de Evento';
      default:
        return 'Cancelar Reserva';
    }
  };

  const getMensaje = () => {
    if (confirmado) {
      return 'La reserva ha sido cancelada exitosamente.';
    }

    const baseMessage = codigoReserva 
      ? `¿Estás seguro de que deseas cancelar la reserva con código ${codigoReserva}?`
      : `¿Estás seguro de que deseas cancelar esta reserva?`;

    return `${baseMessage} Esta acción no se puede deshacer.`;
  };

  const getIcono = () => {
    if (confirmado) {
      return (
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
      );
    }

    return (
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaExclamationTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-4 py-3 rounded-t-2xl mb-6 ${
          confirmado 
            ? 'bg-green-500 dark:bg-green-600' 
            : 'bg-red-500 dark:bg-red-600'
        }`}>
          <h2 className="text-xl font-bold text-white">
            {getTitulo()}
          </h2>
          <button
            onClick={handleClose}
            disabled={isCanceling}
            className="p-2 text-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="text-center">
          {getIcono()}
          
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
            {getMensaje()}
          </p>

          {/* Mostrar errores si existen */}
          {error && !confirmado && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Botones */}
          {!confirmado ? (
            <div className="flex justify-center gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={isCanceling}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={handleConfirm}
                disabled={isCanceling}
                className="bg-red-600 hover:bg-red-700 border-red-600"
              >
                {isCanceling ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Cancelando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaTrash className="w-4 h-4" />
                    Confirmar Cancelación
                  </div>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex justify-center pt-4">
              <Button 
                variant="primary" 
                onClick={handleClose}
                className="bg-green-600 hover:bg-green-700 border-green-600"
              >
                <div className="flex items-center gap-2">
                  <FaCheck className="w-4 h-4" />
                  Cerrar
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Información adicional */}
        {!confirmado && (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                  Importante
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Al cancelar la reserva, se liberarán las fechas ocupadas y el cliente recibirá una notificación.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}