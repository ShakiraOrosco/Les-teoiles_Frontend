// src/components/modals/AdReservas/Reserva_Hospedaje/VerClienteModal.tsx
import { FaTimes, FaUser, FaPhone, FaIdCard, FaEnvelope } from "react-icons/fa";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";

interface ClienteData {
  nombre: string;
  app_paterno: string;
  app_materno?: string;
  telefono: string;
  ci: string;
  email: string;
}

interface VerClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteData | null;
}

export default function VerClienteModal({ isOpen, onClose, cliente }: VerClienteModalProps) {
  if (!isOpen || !cliente) return null;

  const nombreCompleto = `${cliente.nombre} ${cliente.app_paterno}${cliente.app_materno ? ` ${cliente.app_materno}` : ''}`.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 rounded-t-2xl bg-teal-500 dark:bg-teal-600 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaUser className="w-5 h-5" />
            Datos del Cliente
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-teal-600 dark:hover:bg-teal-700 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-4">
          {/* Nombre Completo */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="bg-teal-100 dark:bg-teal-900/20 p-2 rounded-full mt-0.5">
              <FaUser className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Nombre Completo
              </p>
              <p className="text-gray-900 dark:text-white font-semibold">
                {nombreCompleto}
              </p>
            </div>
          </div>

          {/* Carnet de Identidad */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mt-0.5">
              <FaIdCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Carnet de Identidad
              </p>
              <p className="text-gray-900 dark:text-white font-semibold">
                {cliente.ci || 'No especificado'}
              </p>
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mt-0.5">
              <FaPhone className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Teléfono
              </p>
              <p className="text-gray-900 dark:text-white font-semibold">
                {cliente.telefono || 'No especificado'}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full mt-0.5">
              <FaEnvelope className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </p>
              <p className="text-gray-900 dark:text-white font-semibold break-all">
                {cliente.email || 'No especificado'}
              </p>
            </div>
          </div>
        </div>

        {/* Botón de Cerrar */}
        <div className="flex justify-end pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}