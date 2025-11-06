// src/components/modals/AdReservas/Reserva_Eventos/DeleteEventoModal.tsx
import { useState } from "react";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useToggleEvento } from "../../../../hooks/AdReservas/Reserva_Eventos/useToggleEventos";

interface DeleteEventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reservaId: number;
  codigoReserva?: string;
  tipo: string;
}

export default function DeleteEventoModal({
  isOpen,
  onClose,
  onConfirm,
  reservaId,
  codigoReserva
}: DeleteEventoModalProps) {
  const { cancelarEvento, loading, error } = useToggleEvento();
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!reservaId) return;
    
    setInternalError(null);
    
    try {
      console.log(`🔄 Modal - Cancelando evento ID: ${reservaId}`);
      const resultado = await cancelarEvento(reservaId);
      console.log('✅ Modal - Evento cancelado exitosamente:', resultado);
      
      onConfirm();
      onClose();
    } catch (err: any) {
      console.error('❌ Modal - Error al cancelar evento:', err);
      setInternalError(err.response?.data?.error || err.response?.data?.mensaje || "Error al cancelar la reserva de evento");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cancelar Reserva de Evento</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={loading}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            ¿Estás seguro de cancelar esta reserva de evento?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {codigoReserva && (
              <>
                La reserva <strong className="text-gray-700 dark:text-gray-300">{codigoReserva}</strong> será cancelada.
                <br />
              </>
            )}
            Esta acción no se puede deshacer.
          </p>

          {(error || internalError) && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error || internalError}
              </p>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Mantener Reserva
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Cancelando...
              </div>
            ) : (
              'Sí, Cancelar'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}