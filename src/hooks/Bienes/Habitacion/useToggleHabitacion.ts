// src/hooks/Habitacion/useToggleHabitacion.ts
import { useState } from "react";
import { Habitacion, EstadoHabitacion, OpcionSiNo } from "../../../types/Bienes/Habitacion/habitacion";
import * as habitacionService from "../../../services/Bienes/Habitacion/habitacionService";

export const useToggleHabitacion = (setHabitaciones: React.Dispatch<React.SetStateAction<Habitacion[]>>) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ⚙️ Ciclo de estados
    const getNextEstado = (estadoActual: EstadoHabitacion): EstadoHabitacion => {
        switch (estadoActual) {
            case "DISPONIBLE":
                return "OCUPADA";
            case "OCUPADA":
                return "MANTENIMIENTO";
            case "MANTENIMIENTO":
                return "DISPONIBLE";
            default:
                return "DISPONIBLE";
        }
    };

    const toggleEstadoHabitacion = async (habitacion: Habitacion) => {
        setLoading(true);
        setError(null);

        try {
            const nuevoEstado = getNextEstado(habitacion.estado);

            // Transformamos a DTO
            const habitacionDTO = {
                numero: habitacion.numero,
                tipo: habitacion.tipo,
                piso: habitacion.piso,
                estado: nuevoEstado,
                amoblado: habitacion.amoblado as OpcionSiNo,
                baño_priv: habitacion.baño_priv as OpcionSiNo,
                tarifa_hotel: typeof habitacion.tarifa_hotel === "object"
                    ? habitacion.tarifa_hotel.id_tarifa_hotel
                    : habitacion.tarifa_hotel,
            };

            // ⚡ CORRECCIÓN: primero id, luego DTO
            const updated = await habitacionService.editHabitacion(
                habitacion.id_habitacion,
                habitacionDTO
            );

            // Actualizar estado local
            setHabitaciones(prev =>
                prev.map(h =>
                    h.id_habitacion === habitacion.id_habitacion ? updated : h
                )
            );
        } catch (err) {
            setError("Error al cambiar el estado de la habitación");
        } finally {
            setLoading(false);
        }
    };

    return { toggleEstadoHabitacion, loading, error };
};
