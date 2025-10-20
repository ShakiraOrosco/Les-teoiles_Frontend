// src/components/modals/servicios/EditServicioModal.tsx
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import Alert from "../../../ui/alert/Alert";
import { useUpdateServicio } from "../../../../hooks/Bienes/Servicios/useUpdateServicio";
import { ServicioDTO, ServicioAdicional } from "../../../../types/Bienes/Servicios/servicio";

// Validaciones
import {
  validarLongitud,
  validarDescripcion,
  validarPrecio,
  validarSoloLetras,
  validarRepeticionCaracteres,
  validarNoSoloEspacios,
  validarNumero,
} from "../../../utils/validaciones";

interface EditServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: ServicioAdicional | null;
  onEdited?: () => void;
}

export default function EditServicioModal({
  isOpen,
  onClose,
  servicio,
  onEdited,
}: EditServicioModalProps) {
  const { updateServicio, isPending } = useUpdateServicio();

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

  // Cargar datos cuando llega el servicio
  useEffect(() => {
    if (servicio && isOpen) {
      setForm({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || "",
        precio: servicio.precio,
        tipo: servicio.tipo,
        estado: servicio.estado,
      });
      setErrors({ nombre: "", descripcion: "", precio: "", tipo: "", estado: "" });
      setAlert(null);
    }
  }, [servicio, isOpen]);

  if (!isOpen || !servicio) return null;

  // Manejo de inputs
  const handleChange = (field: keyof ServicioDTO) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = field === "precio" ? parseFloat(e.target.value) || 0 : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Validación
  const validateForm = () => {
    const newErrors: typeof errors = { nombre: "", descripcion: "", precio: "", tipo: "", estado: "" };

    // Validaciones de Nombre
    const errorNombre = validarSoloLetras(form.nombre, "El nombre ");
    if (errorNombre) newErrors.nombre = errorNombre;

    const errorLongitud = validarLongitud(form.nombre, 5, 20, "El nombre");
    if (errorLongitud) newErrors.nombre = errorLongitud;

    const errorCaracter = validarRepeticionCaracteres(form.nombre, "El nombre ");
    if (errorCaracter) newErrors.nombre = errorCaracter;

    const errorNombreEspacio = validarNoSoloEspacios(form.nombre, "El nombre");
    if (errorNombreEspacio) newErrors.nombre = errorNombreEspacio;


    // Precio: mínimo 1, máximo 999.99, hasta 2 decimales
    const errorPrecio = validarPrecio(form.precio.toString(), "El precio", 1, 999.99);
    if (errorPrecio) newErrors.precio = errorPrecio;

    const errorNumero = validarNumero(form.precio.toString(), "El precio", 999.99);
    if (errorNumero) newErrors.precio = errorNumero;

    // Tipo: obligatorio
    if (!form.tipo) newErrors.tipo = "Debe seleccionar un tipo";

    // Descripción: opcional, máximo 250 caracteres
    const errorDescripcion = validarDescripcion(form.descripcion, 20, 250, "La descripción");
    if (errorDescripcion) newErrors.descripcion = errorDescripcion;

    const errorCaracterDesc = validarRepeticionCaracteres(form.nombre, "El nombre ");
    if (errorCaracterDesc) newErrors.descripcion = errorCaracterDesc;

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  // Envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !servicio) return;

    try {
      await updateServicio(servicio.id_servicios_adicionales, form);
      setAlert({ variant: "success", message: "Servicio actualizado correctamente" });
      onEdited?.();

      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 1200);
    } catch (error: any) {
      const message = error.response?.data?.error || "Error al actualizar el servicio";
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
            Editar Servicio
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1 text-gray-600 hover:bg-white/20 rounded-lg dark:text-gray-300"
          >
            <FaTimes className="size-5" />
          </button>
        </div>

        {/* Alert */}
        {alert && <div className="mt-4">
          <Alert variant={alert.variant} title={alert.variant === "success" ? "Éxito" : "Error"} message={alert.message} />
        </div>}

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
              onChange={handleChange("nombre")}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
          </div>

          {/* Tipo */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={form.tipo}
              onChange={handleChange("tipo")}
              disabled={isPending}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            >
              <option value="E">Establecimiento</option>
              <option value="A">Alimentación</option>
              <option value="X">Extras</option>
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
              onChange={handleChange("descripcion")}
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
              onChange={handleChange("precio")}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            />
            {errors.precio && <p className="text-xs text-red-500 mt-1">{errors.precio}</p>}
            <p className="text-xs text-gray-400 mt-1">Rango permitido: 1.00 - 999.99 Bs.</p>
          </div>

          {/* Estado */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              value={form.estado}
              onChange={handleChange("estado")}
              disabled={isPending}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
            >
              <option value="A">Activo</option>
              <option value="I">Inactivo</option>
            </select>
            {errors.estado && <p className="text-xs text-red-500 mt-1">{errors.estado}</p>}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? "Actualizando..." : "Actualizar Servicio"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
