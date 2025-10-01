// src/components/modals/Bienes/Servicios/CreateServicioModal.tsx
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Modal } from "../../../ui/modal";
import { useCreateServicio } from "../../../../hooks/Bienes/Servicios/useCreateServicio";
import { ServicioDTO } from "../../../../types/Bienes/Servicios/servicio";
import Button from "../../../ui/button/Button";
import { ESTADOS_LABEL } from "../../../../types/Bienes/Servicios/estados";
import Alert from "../../../ui/alert/Alert";

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
        estado: "A",
    });

    const [errors, setErrors] = useState<Record<keyof ServicioDTO, string>>({
        nombre: "",
        descripcion: "",
        precio: "",
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

    // Validación
    // Validación dentro del modal
    const validateForm = () => {
        const newErrors: typeof errors = { nombre: "", descripcion: "", precio: "", estado: "" };

        // Nombre obligatorio
        if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";

        // Precio obligatorio, mínimo 1, máximo 999.99, hasta 2 decimales
        if (form.precio < 1) newErrors.precio = "El precio no puede ser menor a 1";
        else if (form.precio > 999.99) newErrors.precio = "El precio no puede ser mayor a 999.99";
        else if (!/^\d+(\.\d{1,2})?$/.test(form.precio.toString()))
            newErrors.precio = "El precio solo puede tener 2 decimales";

        // Estado obligatorio
        if (!form.estado) newErrors.estado = "Debe seleccionar un estado";

        // Descripción opcional
        if (form.descripcion && form.descripcion.length > 250)
            newErrors.descripcion = "La descripción no puede superar 250 caracteres";

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
                setForm({ nombre: "", descripcion: "", precio: 0, estado: "A" });
                setErrors({ nombre: "", descripcion: "", precio: "", estado: "" });
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
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                        <input
                            type="text"
                            value={form.nombre}
                            onChange={handleChange("nombre")}
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
                        />
                        {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                        <textarea
                            value={form.descripcion}
                            onChange={handleChange("descripcion")}
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
                        />
                        {errors.descripcion && <p className="text-xs text-red-500 mt-1">{errors.descripcion}</p>}
                    </div>

                    {/* Precio */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Precio (Bs.)</label>
                        <input
                            type="number"
                            min={0}
                            max={999.99}
                            step={0.01}
                            value={form.precio}
                            onChange={handleChange("precio")}
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
                        />
                        {errors.precio && <p className="text-xs text-red-500 mt-1">{errors.precio}</p>}
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                        <select
                            value={form.estado}
                            onChange={handleChange("estado")}
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
                            disabled={isPending}
                        >
                            {Object.entries(ESTADOS_LABEL).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        {errors.estado && <p className="text-xs text-red-500 mt-1">{errors.estado}</p>}
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
