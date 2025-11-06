// 📁 src/components/ReservasHospedaje/DeleteReservaModal.tsx
import { useState, useEffect } from 'react';
import { X, AlertTriangle, Trash2, CheckCircle, Loader } from 'lucide-react';
import { ReservaHotel } from '../../../../types/AdReserva/Reserva_Hospedaje/hospedaje';

interface DeleteReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: ReservaHotel | null;
  onReservaEliminada: (reservaId: number) => void;
}

export default function DeleteReservaModal({
  isOpen,
  onClose,
  reserva,
  onReservaEliminada
}: DeleteReservaModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  // Resetear estado cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setError(null);
      setIsSuccess(false);
      setConfirmText('');
    }
  }, [isOpen]);

  const handleEliminar = async () => {
    if (!reserva?.id_reserva_hotel) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/reserva-hotel/${reserva.id_reserva_hotel}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      // Éxito
      setIsSuccess(true);
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        onReservaEliminada(reserva.id_reserva_hotel!);
        onClose();
      }, 1500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la reserva';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // No renderizar si no está abierto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              isSuccess ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isSuccess ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {isSuccess ? '¡Eliminada!' : 'Eliminar Reserva'}
            </h2>
          </div>
          
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {!isSuccess ? (
            <>
              {/* Información de la reserva */}
              <div className="text-gray-600">
                <p className="mb-3 font-medium">
                  Esta acción no se puede deshacer. ¿Estás seguro de eliminar esta reserva?
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-red-800 text-sm mb-2">
                    Reserva a eliminar:
                  </p>
                  
                  {reserva && (
                    <div className="text-sm text-red-700 space-y-2">
                      {/* Información del cliente */}
                      <div className="flex justify-between">
                        <span className="font-medium">Cliente:</span>
                        <span>
                          {reserva.datos_cliente && typeof reserva.datos_cliente !== 'number' 
                            ? `${reserva.datos_cliente.nombre} ${reserva.datos_cliente.app_paterno}`
                            : 'N/A'
                          }
                        </span>
                      </div>
                      
                      {/* Fechas */}
                      <div className="flex justify-between">
                        <span className="font-medium">Fechas:</span>
                        <span>{reserva.fecha_ini} - {reserva.fecha_fin}</span>
                      </div>
                      
                      {/* Cantidad de personas */}
                      <div className="flex justify-between">
                        <span className="font-medium">Personas:</span>
                        <span>{reserva.cant_personas}</span>
                      </div>
                      
                      {/* Tipo de habitación */}
                      <div className="flex justify-between">
                        <span className="font-medium">Tipo:</span>
                        <span>
                          {reserva.amoblado === 'S' ? 'Amoblado' : 'Básico'} + 
                          {reserva.baño_priv === 'S' ? ' Baño privado' : ' Baño compartido'}
                        </span>
                      </div>
                      
                      {/* Estado */}
                      <div className="flex justify-between">
                        <span className="font-medium">Estado:</span>
                        <span className={`font-semibold ${
                          reserva.estado === 'A' ? 'text-green-600' : 
                          reserva.estado === 'C' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {reserva.estado === 'A' ? 'Activa' : 
                           reserva.estado === 'C' ? 'Cancelada' : 'Finalizada'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmación por texto */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Para confirmar, escribe <span className="font-mono text-red-600 font-bold">ELIMINAR</span>:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-center text-lg tracking-wide"
                  placeholder="ESCRIBE AQUÍ: ELIMINAR"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    Error al eliminar
                  </div>
                  <p>{error}</p>
                </div>
              )}
            </>
          ) : (
            /* Mensaje de éxito */
            <div className="text-center py-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Reserva eliminada exitosamente
              </h3>
              <p className="text-gray-600">
                La reserva ha sido eliminada permanentemente del sistema.
              </p>
            </div>
          )}
        </div>

        {/* Footer - Botones de acción */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          {!isSuccess ? (
            <>
              {/* Botón Cancelar */}
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              
              {/* Botón Eliminar */}
              <button
                onClick={handleEliminar}
                disabled={isLoading || confirmText !== 'ELIMINAR'}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Eliminar Reserva
                  </>
                )}
              </button>
            </>
          ) : (
            /* Botón de cierre cuando es éxito */
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}