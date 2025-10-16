import { useState } from "react";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import Alert from "../../../ui/alert/Alert";
import { HabitacionDTO, EstadoHabitacion, OpcionSiNo } from "../../../../types/Bienes/Habitacion/habitacion";

// Validaciones personalizadas
const validarNumeroHabitacion = (num: string) => {
  const n = Number(num);
  if (isNaN(n) || !Number.isInteger(n)) return "El número debe ser un valor entero";
  if (n < 100 || n > 999) return "El número debe estar entre 100 y 999";
  return "";
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (data: HabitacionDTO) => Promise<void>;
}

export default function CreateHabitacionModal({ isOpen, onClose, onCreated }: Props) {
  const [form, setForm] = useState<HabitacionDTO>({
    numero: "",
    tipo: "Plan A",
    piso: 1,
    estado: "DISPONIBLE",
    amoblado: "S",
    baño_priv: "S",
    tarifa_hotel: 1,
  });

  const [errors, setErrors] = useState<Record<keyof HabitacionDTO, string>>({
    numero: "",
    tipo: "",
    piso: "",
    estado: "",
    amoblado: "",
    baño_priv: "",
    tarifa_hotel: "",
  });

  const [alert, setAlert] = useState<{ variant: "success" | "error"; message: string } | null>(null);

  if (!isOpen) return null;

  const handleChange = <K extends keyof HabitacionDTO>(field: K, value: HabitacionDTO[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = { numero: "", tipo: "", piso: "", estado: "", amoblado: "", baño_priv: "", tarifa_hotel: "" };

    const errorNumero = validarNumeroHabitacion(form.numero);
    if (errorNumero) newErrors.numero = errorNumero;

    if (form.piso < 1 || form.piso > 9) newErrors.piso = "El piso debe estar entre 1 y 9";

    setErrors(newErrors);
    return !Object.values(newErrors).some(e => e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onCreated({
        ...form,
        tarifa_hotel: Number(form.tarifa_hotel),
      });

      setAlert({ variant: "success", message: "Habitación creada correctamente" });
      setForm({
        numero: "",
        tipo: "Plan A",
        piso: 1,
        estado: "DISPONIBLE",
        amoblado: "S",
        baño_priv: "S",
        tarifa_hotel: 1,
      });
      onClose();
    } catch {
      setAlert({ variant: "error", message: "Error al crear la habitación" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Nueva Habitación
        </h2>

        {alert && (
          <Alert
            variant={alert.variant}
            title={alert.variant === "success" ? "Éxito" : "Error"}
            message={alert.message}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Número */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Número *
            </label>
            <input
              type="text"
              value={form.numero}
              onChange={(e) => handleChange("numero", e.target.value)}
              placeholder="Ej: 101"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26A5B9] dark:bg-gray-800/50"
            />
            {errors.numero && <p className="text-xs text-red-500 mt-1">{errors.numero}</p>}
          </div>

          {/* Tipo */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo (Plan) *
            </label>
            <select
              value={form.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26A5B9] dark:bg-gray-800/50"
            >
              <option value="Plan A">Plan A</option>
              <option value="Plan B">Plan B</option>
              <option value="Plan C">Plan C</option>
              <option value="Plan D">Plan D</option>
            </select>
          </div>

          {/* Piso */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Piso *
            </label>
            <select
              value={form.piso}
              onChange={(e) => handleChange("piso", Number(e.target.value))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26A5B9] dark:bg-gray-800/50"
            >
              {[...Array(9)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {errors.piso && <p className="text-xs text-red-500 mt-1">{errors.piso}</p>}
          </div>

          {/* Estado */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado *
            </label>
            <select
              value={form.estado}
              onChange={(e) =>
                handleChange("estado", e.target.value as EstadoHabitacion)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26A5B9] dark:bg-gray-800/50"
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="OCUPADA">Ocupada</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
            </select>
          </div>

          {/* Amoblado */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Amoblado *
            </label>
            <select
              value={form.amoblado}
              onChange={(e) =>
                handleChange("amoblado", e.target.value as OpcionSiNo)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26A5B9] dark:bg-gray-800/50"
            >
              <option value="S">Sí</option>
              <option value="N">No</option>
            </select>
          </div>

          {/* Baño privado */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Baño privado *
            </label>
            <select
              value={form.baño_priv}
              onChange={(e) =>
                handleChange("baño_priv", e.target.value as OpcionSiNo)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26A5B9] dark:bg-gray-800/50"
            >
              <option value="S">Sí</option>
              <option value="N">No</option>
            </select>
          </div>

          {/* Tarifa */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tarifa *
            </label>
            <select
              value={form.tarifa_hotel}
              onChange={(e) => handleChange("tarifa_hotel", Number(e.target.value))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26A5B9] dark:bg-gray-800/50"
            >
              <option value={1}>Tarifa 1</option>
              <option value={2}>Tarifa 2</option>
              <option value={3}>Tarifa 3</option>
              <option value={4}>Tarifa 4</option>
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
