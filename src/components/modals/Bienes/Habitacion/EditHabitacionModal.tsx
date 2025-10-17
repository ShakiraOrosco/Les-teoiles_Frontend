import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import Alert from "../../../ui/alert/Alert";
import { Habitacion, OpcionSiNo, EstadoHabitacion } from "../../../../types/Bienes/Habitacion/habitacion";
import { validarNumeroEntero, obtenerPisoDesdeNumero } from "../../../utils/validaciones";
import { useUpdateHabitacion } from "../../../../hooks/Bienes/Habitacion/useUpdateHabitacion";

interface EditHabitacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitacion: Habitacion;
  habitacionesExistentes: Habitacion[];
  onUpdated?: () => void;
}

export default function EditHabitacionModal({
  isOpen,
  onClose,
  habitacion,
  habitacionesExistentes,
  onUpdated,
}: EditHabitacionModalProps) {
  const { updateHabitacion, isUpdating } = useUpdateHabitacion();

  const [form, setForm] = useState<Habitacion>({ ...habitacion });
  const [errors, setErrors] = useState<Record<keyof Habitacion, string>>({
    id_habitacion: "",
    numero: "",
    piso: "",
    amoblado: "",
    baño_priv: "",
    estado: "",
    tarifa_hotel: "",
    precio_tarifa: "",
  });
  const [alert, setAlert] = useState<{ variant: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setForm({ ...habitacion });
  }, [habitacion]);

  if (!isOpen) return null;

  const handleChange = <K extends keyof Habitacion>(field: K, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));

    // Actualiza automáticamente el piso al cambiar el número
    if (field === "numero") {
      const piso = obtenerPisoDesdeNumero(String(value));
      setForm(prev => ({ ...prev, piso }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {
      id_habitacion: "",
      numero: "",
      piso: "",
      amoblado: "",
      baño_priv: "",
      estado: "",
      tarifa_hotel: "",
      precio_tarifa: "",
    };

    // Validar número solo dígitos
    const errorNumero = validarNumeroEntero(form.numero);
    if (errorNumero) newErrors.numero = errorNumero;

    // Primer dígito debe coincidir con el piso
    const pisoDesdeNumero = obtenerPisoDesdeNumero(String(form.numero));
    if (pisoDesdeNumero !== form.piso) {
      newErrors.numero = "El primer dígito del número debe coincidir con el piso";
    }

    // Evitar duplicados (ignora la habitación actual)
    const duplicado = habitacionesExistentes.some(
      h => h.numero === form.numero && h.id_habitacion !== habitacion.id_habitacion
    );
    if (duplicado) newErrors.numero = "Ya existe una habitación con ese número";

    setErrors(newErrors);
    return !Object.values(newErrors).some(e => e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateHabitacion(form);
      setAlert({ variant: "success", message: "Habitación actualizada correctamente" });
      onUpdated?.();

      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 1200);
    } catch (error: any) {
      const message = error.response?.data?.error || "Error al actualizar la habitación";
      setAlert({ variant: "error", message });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#e2e8f6] dark:bg-[#458890] px-4 py-3 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#26a5b9] text-white">✎</span>
            Editar Habitación
          </h2>
          <button onClick={onClose} disabled={isUpdating} className="p-1 text-gray-600 hover:bg-white/20 rounded-lg dark:text-gray-300">
            <FaTimes className="size-5" />
          </button>
        </div>

        {/* Alertas */}
        {alert && (
          <div className="mt-4">
            <Alert
              variant={alert.variant}
              title={alert.variant === "success" ? "Éxito" : "Error"}
              message={alert.message}
            />
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Número */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Número <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.numero}
              onChange={e => handleChange("numero", e.target.value)}
              placeholder="Ej: 101"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            />
            {errors.numero && <p className="text-xs text-red-500 mt-1">{errors.numero}</p>}
          </div>

          {/* Piso */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Piso
            </label>
            <input
              type="number"
              value={form.piso}
              readOnly
              className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800/50 dark:text-gray-300"
            />
            {errors.piso && <p className="text-xs text-red-500 mt-1">{errors.piso}</p>}
          </div>

          {/* Amoblado */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Amoblado
            </label>
            <select
              value={form.amoblado}
              onChange={e => handleChange("amoblado", e.target.value as OpcionSiNo)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            >
              <option value="S">Sí</option>
              <option value="N">No</option>
            </select>
          </div>

          {/* Baño Privado */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Baño Privado
            </label>
            <select
              value={form.baño_priv}
              onChange={e => handleChange("baño_priv", e.target.value as OpcionSiNo)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            >
              <option value="S">Sí</option>
              <option value="N">No</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              value={form.estado}
              onChange={e => handleChange("estado", e.target.value as EstadoHabitacion)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="OCUPADA">Ocupada</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isUpdating}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={isUpdating}>
              {isUpdating ? "Actualizando..." : "Actualizar Habitación"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
