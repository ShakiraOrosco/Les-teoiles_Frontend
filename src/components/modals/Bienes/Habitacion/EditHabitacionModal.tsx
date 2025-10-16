// src/components/modals/Bienes/Habitacion/EditHabitacionModal.tsx
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import Alert from "../../../ui/alert/Alert";
import { HabitacionDTO } from "../../../../types/Bienes/Habitacion/habitacion"; // usa tu tipo global
import { validarLongitud, validarNumeroDel1Al9 } from "../../../utils/validaciones";

interface EditHabitacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    habitacion: HabitacionDTO;
    onUpdated?: () => void;
    updateHabitacion: (data: HabitacionDTO, callback?: () => void) => Promise<void>;
    isPending?: boolean;
}

export default function EditHabitacionModal({
    isOpen,
    onClose,
    habitacion,
    onUpdated,
    updateHabitacion,
    isPending = false,
}: EditHabitacionModalProps) {
    const [form, setForm] = useState<HabitacionDTO>({ ...habitacion });
    const [errors, setErrors] = useState<Record<keyof HabitacionDTO, string>>({
        numero: "", tipo: "", piso: "", estado: "", amoblado: "", baño_priv: "", tarifa_hotel: ""
    });
    const [alert, setAlert] = useState<{ variant: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        setForm({ ...habitacion });
    }, [habitacion]);

    if (!isOpen) return null;

    const handleChange = <K extends keyof HabitacionDTO>(field: K, value: HabitacionDTO[K]) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const newErrors: typeof errors = { numero: "", tipo: "", piso: "", estado: "", amoblado: "", baño_priv: "", tarifa_hotel: "" };

        const errorNumero = validarNumeroDel1Al9(form.numero, "Número de habitación");
        if (errorNumero) newErrors.numero = errorNumero;

        const errorTipo = validarLongitud(form.tipo, 1, 20, "Tipo de habitación");
        if (errorTipo) newErrors.tipo = errorTipo;

        if (form.piso < 0) newErrors.piso = "El piso debe ser mayor o igual a 0";

        setErrors(newErrors);
        return !Object.values(newErrors).some(e => e);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await updateHabitacion(form, () => {
                onUpdated?.();
                setAlert({ variant: "success", message: "Habitación actualizada correctamente" });
                onClose();
            });
        } catch {
            setAlert({ variant: "error", message: "Error al actualizar la habitación" });
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
                    <button onClick={onClose} disabled={isPending} className="p-1 text-gray-600 hover:bg-white/20 rounded-lg dark:text-gray-300">
                        <FaTimes className="size-5" />
                    </button>
                </div>

                {/* Alerta */}
                {alert && <div className="mt-4"><Alert variant={alert.variant} title={alert.variant === "success" ? "Éxito" : "Error"} message={alert.message} /></div>}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Número */}
                    <div>
                        <label>Número <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={form.numero}
                            onChange={e => handleChange("numero", e.target.value)}
                            placeholder="Ej: 1"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                        {errors.numero && <p className="text-xs text-red-500 mt-1">{errors.numero}</p>}
                    </div>

                    {/* Tipo */}
                    <div>
                        <label>Tipo <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={form.tipo}
                            onChange={e => handleChange("tipo", e.target.value)}
                            placeholder="Ej: Sencilla, Doble, Suite"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                        {errors.tipo && <p className="text-xs text-red-500 mt-1">{errors.tipo}</p>}
                    </div>

                    {/* Piso */}
                    <div>
                        <label>Piso <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            min={0}
                            value={form.piso || ""}
                            onChange={e => handleChange("piso", Number(e.target.value))}
                            placeholder="Ej: 1"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                        {errors.piso && <p className="text-xs text-red-500 mt-1">{errors.piso}</p>}
                    </div>

                    {/* Estado */}
                    <div>
                        <label>Estado <span className="text-red-500">*</span></label>
                        <select
                            value={form.estado}
                            onChange={e => handleChange("estado", e.target.value as "DISPONIBLE" | "OCUPADA" | "MANTENIMIENTO")}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            <option value="DISPONIBLE">Disponible</option>
                            <option value="OCUPADA">Ocupada</option>
                            <option value="MANTENIMIENTO">Mantenimiento</option>
                        </select>
                    </div>

                    {/* Amoblado */}
                    <div>
                        <label>Amoblado <span className="text-red-500">*</span></label>
                        <select
                            value={form.amoblado}
                            onChange={e => handleChange("amoblado", e.target.value as "S" | "N")}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            <option value="S">Sí</option>
                            <option value="N">No</option>
                        </select>
                    </div>

                    {/* Baño privado */}
                    <div>
                        <label>Baño Privado <span className="text-red-500">*</span></label>
                        <select
                            value={form.baño_priv}
                            onChange={e => handleChange("baño_priv", e.target.value as "S" | "N")}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            <option value="S">Sí</option>
                            <option value="N">No</option>
                        </select>
                    </div>

                    {/* Tarifa */}
                    <div>
                        <label>Tarifa <span className="text-red-500">*</span></label>
                        <select
                            value={form.tarifa_hotel}
                            onChange={e => handleChange("tarifa_hotel", Number(e.target.value))}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            <option value={1}>Tarifa 1</option>
                            <option value={2}>Tarifa 2</option>
                            <option value={3}>Tarifa 3</option>
                            <option value={4}>Tarifa 4</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={onClose} disabled={isPending}>Cancelar</Button>
                        <button type="submit" disabled={isPending} className="px-4 py-2 rounded-lg bg-[#26a5b9] text-white">
                            {isPending ? "Actualizando..." : "Actualizar Habitación"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
