// src/components/Bienes/Habitacion/CreateHabitacionModal.tsx
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import Alert from "../../../ui/alert/Alert";
import { HabitacionDTO, OpcionSiNo } from "../../../../types/Bienes/Habitacion/habitacion";
import {
  validarNumeroEntero,
  obtenerPisoDesdeNumero,
  validarNumeroHabitacion,
} from "../../../utils/validaciones";
import { useHabitaciones } from "../../../../hooks/Bienes/Habitacion/useCreateHabitacion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateHabitacionModal({ isOpen, onClose }: Props) {
  const { addHabitacion } = useHabitaciones();

  const [form, setForm] = useState<HabitacionDTO>({
    numero: "",
    piso: 1,
    amoblado: "S",
    baño_priv: "S",
  });

  const [errors, setErrors] = useState<Record<keyof HabitacionDTO, string>>({
    numero: "",
    piso: "",
    amoblado: "",
    baño_priv: "",
  });

  const [alert, setAlert] = useState<{ variant: "success" | "error"; message: string } | null>(
    null
  );

  if (!isOpen) return null;

  const handleChange = <K extends keyof HabitacionDTO>(field: K, value: HabitacionDTO[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = { numero: "", piso: "", amoblado: "", baño_priv: "" };

    // 1️⃣ Validar número de habitación
    let error = validarNumeroHabitacion(form.numero);
    if (error) newErrors.numero = error;

    // 2️⃣ Validar que solo tenga dígitos
    error = validarNumeroEntero(form.numero);
    if (error) newErrors.numero = error;

    // 3️⃣ Validar que el primer dígito coincida con el piso
    const pisoDesdeNumero = obtenerPisoDesdeNumero(form.numero);
    if (pisoDesdeNumero !== form.piso) {
      newErrors.numero = "El primer dígito del número debe coincidir con el piso";
      newErrors.piso = "El piso debe coincidir con el primer dígito del número";
    }

    // 4️⃣ Validar rango del piso
    if (form.piso < 1 || form.piso > 9) newErrors.piso = "El piso debe estar entre 1 y 9";

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addHabitacion(form);
      setAlert({ variant: "success", message: "Habitación creada correctamente" });

      // Reiniciar formulario
      setForm({
        numero: "",
        piso: 1,
        amoblado: "S",
        baño_priv: "S",
      });

      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 1200);
    } catch {
      setAlert({ variant: "error", message: "Error al crear la habitación" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#e2e8f6] dark:bg-[#458890] px-4 py-3 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#26a5b9] text-white">
              +
            </span>
            Nueva Habitación
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:bg-white/20 rounded-lg dark:text-gray-300"
          >
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
              onChange={(e) => handleChange("numero", e.target.value)}
              placeholder="Ej: 101"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            />
            {errors.numero && <p className="text-xs text-red-500 mt-1">{errors.numero}</p>}
          </div>

          {/* Piso */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Piso <span className="text-red-500">*</span>
            </label>
            <select
              value={form.piso}
              onChange={(e) => handleChange("piso", Number(e.target.value))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            >
              {[...Array(9)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {errors.piso && <p className="text-xs text-red-500 mt-1">{errors.piso}</p>}
          </div>

          {/* Amoblado */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Amoblado <span className="text-red-500">*</span>
            </label>
            <select
              value={form.amoblado}
              onChange={(e) => handleChange("amoblado", e.target.value as OpcionSiNo)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            >
              <option value="S">Sí</option>
              <option value="N">No</option>
            </select>
          </div>

          {/* Baño privado */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Baño privado <span className="text-red-500">*</span>
            </label>
            <select
              value={form.baño_priv}
              onChange={(e) => handleChange("baño_priv", e.target.value as OpcionSiNo)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            >
              <option value="S">Sí</option>
              <option value="N">No</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear Habitación
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
