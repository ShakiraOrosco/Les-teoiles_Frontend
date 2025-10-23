// src/components/modals/Bienes/Servicios/CreateServicioModal.tsx
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import Alert from "../../../ui/alert/Alert";
import { useServiciosAdicionales } from "../../../../hooks/Bienes/Servicios/useCreateServicio";
import { ServicioDTO } from "../../../../types/Bienes/Servicios/servicio";
import { TIPOS_LABEL } from "../../../../types/Bienes/Servicios/estados";

// Validaciones
import {
  validarLongitud,
  validarDescripcion,
  validarSoloLetras,
  validarRepeticionCaracteres,
  validarNoSoloEspacios,
  validarPrecio,
} from "../../../utils/validaciones";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateServicioModal({ isOpen, onClose }: Props) {
  const { addServicio } = useServiciosAdicionales();

  const [form, setForm] = useState<ServicioDTO>({
    nombre: "",
    descripcion: "",
    precio: 0,
    tipo: "E",
    estado: "A",
  });

  const [errors, setErrors] = useState<Record<keyof ServicioDTO, string>>({
    nombre: "",
    descripcion: "",
    precio: "",
    tipo: "",
    estado: "",
  });

  const [alert, setAlert] = useState<{ variant: "success" | "error"; message: string } | null>(
    null
  );

  if (!isOpen) return null;

  // Manejo genérico de inputs
  const handleChange = (field: keyof ServicioDTO, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors: typeof errors = {
      nombre: "",
      descripcion: "",
      precio: "",
      tipo: "",
      estado: "",
    };

    // Validaciones de Nombre
    const errorNombre = validarSoloLetras(form.nombre, "El nombre ");
    if (errorNombre) newErrors.nombre = errorNombre;

    const errorLongitud = validarLongitud(form.nombre, 5, 20, "El nombre");
    if (errorLongitud) newErrors.nombre = errorLongitud;

    const errorCaracter = validarRepeticionCaracteres(form.nombre, "El nombre ");
    if (errorCaracter) newErrors.nombre = errorCaracter;

    const errorNombreEspacio = validarNoSoloEspacios(form.nombre, "El nombre");
    if (errorNombreEspacio) newErrors.nombre = errorNombreEspacio;

    // Tipo: obligatorio
    if (!form.tipo) newErrors.tipo = "Debe seleccionar un tipo";

    // Descripción: opcional, máximo 250 caracteres
    const errorDescripcion = validarDescripcion(form.descripcion, 20, 250, "La descripción");
    if (errorDescripcion) newErrors.descripcion = errorDescripcion;

    const errorCaracterDesc = validarRepeticionCaracteres(form.nombre, "El nombre ");
    if (errorCaracterDesc) newErrors.descripcion = errorCaracterDesc;

    const errorPrecio = validarPrecio(form.precio.toString(), "El precio", 1, 999.99);
    if (errorPrecio) newErrors.precio = errorPrecio;

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addServicio(form);
      setAlert({ variant: "success", message: "Servicio creado correctamente" });

      // Reiniciar formulario
      setForm({ nombre: "", descripcion: "", precio: 0, tipo: "E", estado: "A" });
      setErrors({ nombre: "", descripcion: "", precio: "", tipo: "", estado: "" });

      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 1200);
    } catch (error: any) {
      setAlert({ variant: "error", message: error.message || "Error al crear el servicio" });
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
            Nuevo Servicio
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
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => {
                const valor = e.target.value;
                // Reemplaza cualquier caracter que no sea letra o espacio
                const limpio = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                handleChange("nombre", limpio);
              }}
              placeholder="Ej: Parrilla"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
            <p className="text-xs text-gray-400 mt-1">Rango permitido: 1.00 - 999.99 Bs.</p>
          </div>

          {/* Tipo */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={form.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            >
              {Object.entries(TIPOS_LABEL).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            {errors.tipo && <p className="text-xs text-red-500 mt-1">{errors.tipo}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              placeholder="Describe el servicio..."
              rows={3}
              maxLength={250}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion}</p>}
              <p className="text-xs text-gray-400 ml-auto">{form.descripcion.length}/250</p>
            </div>
          </div>

          {/* Precio */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Precio (Bs.) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={999.99}
              step={0.01}
              value={form.precio || ""}
              onChange={(e) => {
                // Solo permitir números válidos y hasta 2 decimales
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  handleChange("precio", parseFloat(value) || 0);
                }
              }}
              onKeyDown={(e) => {
                // Bloquear "e", "+", "-", y cualquier letra
                if (
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "-" ||
                  e.key === " " // bloquear espacios
                ) {
                  e.preventDefault();
                }
              }}
              placeholder="Ej: 150.50"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            />

            {errors.precio && <p className="text-xs text-red-500 mt-1">{errors.precio}</p>}
            <p className="text-xs text-gray-400 mt-1">Rango permitido: 1.00 - 999.99 Bs.</p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear Servicio
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}