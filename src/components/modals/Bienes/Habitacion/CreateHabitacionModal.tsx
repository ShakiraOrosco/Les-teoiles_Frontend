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
  validarNumeroHabitacion
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
    piso: 1, // Se actualizará automáticamente
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

  // Actualiza el form; el piso se obtiene automáticamente del primer dígito
  const handleChange = (field: keyof HabitacionDTO, value: any) => {
    let newForm = { ...form, [field]: value };

    if (field === "numero") {
      const piso = obtenerPisoDesdeNumero(value);
      newForm.piso = piso || 1; // Piso mínimo 1
    }

    setForm(newForm);
  };

  const validateForm = () => {
    const newErrors: typeof errors = { numero: "", piso: "", amoblado: "", baño_priv: "" };

    // 1️⃣ Validar que el número sea obligatorio y solo dígitos
    
    if (!form.numero) newErrors.numero = "El número de habitación es obligatorio";
    else {
      const errorNumero = validarNumeroEntero(form.numero);
      if (errorNumero) newErrors.numero = errorNumero;
    }

    // 2️⃣ Validar que el primer dígito coincida con el piso (seguridad)
    const pisoDesdeNumero = obtenerPisoDesdeNumero(form.numero);
    if (pisoDesdeNumero !== form.piso) {
      newErrors.numero = "El primer dígito del número debe coincidir con el piso";
      newErrors.piso = "El piso debe coincidir con el primer dígito del número";
    }

    // 🟩 Validar número entre 100 y 999
    if (!form.numero) {
      newErrors.numero = "El número de habitación es obligatorio";
    } else {
      const errorNumero = validarNumeroHabitacion(form.numero);
      if (errorNumero) newErrors.numero = errorNumero;
    }
    

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      numero: form.numero.trim(),
      piso: form.piso,
      amoblado: form.amoblado,
      baño_priv: form.baño_priv,
    };

    try {
      await addHabitacion(payload);
      setAlert({ variant: "success", message: "Habitación creada correctamente" });

      // Reiniciar formulario
      setForm({ numero: "", piso: 1, amoblado: "S", baño_priv: "S" });

      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 1200);
    } catch (error: any) {
      const message = error.response?.data?.error || "Error al crear la habitación";
      setAlert({ variant: "error", message });
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
              onChange={(e) => {
                // Eliminar todo lo que no sea número
                let valor = e.target.value.replace(/[^0-9]/g, "");

                // Limitar a máximo 3 dígitos
                if (valor.length > 3) {
                  valor = valor.slice(0, 3);
                }

                // Evitar valores mayores a 999
                if (Number(valor) > 999) {
                  valor = "999";
                }

                handleChange("numero", valor);
              }}
              placeholder="Ej: 101"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            />
            {errors.numero && <p className="text-xs text-red-500 mt-1">{errors.numero}</p>}
          </div>


          {/* Piso (solo lectura) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Piso
            </label>
            <input
              type="number"
              value={form.piso}
              readOnly
              className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
            />
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
