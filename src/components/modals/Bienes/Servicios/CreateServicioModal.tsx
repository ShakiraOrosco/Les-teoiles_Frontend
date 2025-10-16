// src/components/modals/Bienes/Servicios/CreateServicioModal.tsx
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Modal } from "../../../ui/modal";
import { useCreateServicio } from "../../../../hooks/Bienes/Servicios/useCreateServicio";
import { ServicioDTO } from "../../../../types/Bienes/Servicios/servicio";
import Button from "../../../ui/button/Button";
import { TIPOS_LABEL } from "../../../../types/Bienes/Servicios/estados";
import Alert from "../../../ui/alert/Alert";

// Importa tus validaciones
import { 
    validarLongitud,    
    validarDescripcion, 
    validarPrecio 
} from "../../../utils/validaciones";

interface CreateServicioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export default function CreateServicioModal({ isOpen, onClose, onCreated }: CreateServicioModalProps) {
    const { createServicio, isPending } = useCreateServicio();

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

    const [alert, setAlert] = useState<{ variant: "success" | "error"; message: string } | null>(null);

    if (!isOpen) return null;

    // Cambios de inputs
    const handleChange = (field: keyof ServicioDTO) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const value =
            field === "precio"
                ? parseFloat(e.target.value) || 0
                : e.target.value;
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Validación usando tus funciones
    const validateForm = () => {
        const newErrors: typeof errors = { nombre: "", descripcion: "", precio: "", tipo: "", estado: "" };

        // Nombre → obligatorio, entre 1 y 20 caracteres
        const errorNombre = validarLongitud(form.nombre, 1, 20, "El nombre");
        if (errorNombre) newErrors.nombre = errorNombre;

        // Precio → mínimo 1, máximo 999.99, hasta 2 decimales
        const errorPrecio = validarPrecio(form.precio.toString(), "El precio", 999.99);
        if (errorPrecio) newErrors.precio = errorPrecio;

        // Tipo obligatorio
        if (!form.tipo) newErrors.tipo = "Debe seleccionar un tipo";

        // Descripción opcional, máximo 250 caracteres
        const errorDescripcion = validarDescripcion(form.descripcion, 250, "La descripción");
        if (errorDescripcion) newErrors.descripcion = errorDescripcion;

        setErrors(newErrors);
        return !Object.values(newErrors).some(e => e);
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await createServicio(form, () => {
                onCreated?.();
                setForm({ nombre: "", descripcion: "", precio: 0, tipo: "E", estado: "A" });
                setErrors({ nombre: "", descripcion: "", precio: "", tipo: "", estado: "" });
                setAlert({ variant: "success", message: "Servicio creado correctamente" });
                onClose();
            });
        } catch (error) {
            setAlert({ variant: "error", message: "Error al crear el servicio" });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
            <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-[#e2e8f6] dark:bg-[#458890] px-4 py-3 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#26a5b9] text-white">+</span>
                        Nuevo Servicio
                    </h2>
                    <button onClick={onClose} disabled={isPending} className="p-1 text-gray-600 hover:bg-white/20 rounded-lg dark:text-gray-300">
                        <FaTimes className="size-5" />
                    </button>
                </div>

                {/* Alerta */}
                {alert && <div className="mt-4"><Alert variant={alert.variant} title={alert.variant === "success" ? "Éxito" : "Error"} message={alert.message} /></div>}

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
                            placeholder="Ej: Limpieza Premium"
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
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
                            disabled={isPending}
                        >
                            {Object.entries(TIPOS_LABEL).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
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
                            onChange={handleChange("descripcion")}
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
                            onChange={handleChange("precio")}
                            placeholder="Ej: 150.50"
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
                        />
                        {errors.precio && <p className="text-xs text-red-500 mt-1">{errors.precio}</p>}
                        <p className="text-xs text-gray-400 mt-1">Rango permitido: 1.00 - 999.99 Bs.</p>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={onClose} disabled={isPending}>Cancelar</Button>
                        <button type="submit" disabled={isPending} className="px-4 py-2 rounded-lg bg-[#26a5b9] text-white hover:bg-[#26a5b9]/90 disabled:opacity-50">
                            {isPending ? "Creando..." : "Crear Servicio"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
