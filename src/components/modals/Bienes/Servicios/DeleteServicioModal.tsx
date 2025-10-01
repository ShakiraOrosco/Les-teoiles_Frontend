// src/components/modals/servicios/ToggleServicioModal.tsx
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import { useToggleServicio } from "../../../../hooks/Bienes/Servicios/useToggleServicio";
import { ServicioAdicional, EstadoServicio } from "../../../../types/Bienes/Servicios/servicio";

interface ToggleServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: ServicioAdicional;
  onToggled?: () => void;
}

export default function ToggleServicioModal({
  isOpen,
  onClose,
  servicio,
  onToggled,
}: ToggleServicioModalProps) {
  const { toggleEstado, isPending } = useToggleServicio()

  if (!isOpen) return null;

  const isDeleting = servicio.estado !== "I"; // Si no está inactivo, se "elimina"
  const targetEstado: EstadoServicio = isDeleting ? "I" : "A"; // Alterna entre I/A
  const actionText = isDeleting ? "Eliminar" : "Restaurar";

  const handleConfirm = async () => {
    if (!targetEstado) return;

    await toggleEstado(servicio, targetEstado, () => {
  onToggled?.();
  onClose();
});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
              <FaExclamationTriangle />
            </span>
            {actionText} Servicio
          </h2>
          <button onClick={onClose} disabled={isPending} className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg">
            <FaTimes className="size-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="mt-4 text-gray-700 dark:text-gray-300">
          <p>
            {isDeleting
              ? "¿Estás seguro de que deseas eliminar este servicio? Podrás restaurarlo cambiando nuevamente su estado."
              : "¿Deseas restaurar este servicio a su estado anterior?"}
          </p>
          <p className="mt-2 font-medium">{servicio.nombre}</p>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={isPending}>
            {isPending ? (isDeleting ? "Eliminando..." : "Restaurando...") : actionText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
