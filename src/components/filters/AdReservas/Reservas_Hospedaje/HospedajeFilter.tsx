// src/components/filters/AdReservas/ReservaHospedajeFilter.tsx
import { FaSearch, FaUser } from "react-icons/fa";

interface ReservaHospedajeFilterProps {
    filtro: string;
    setFiltro: (value: string) => void;
    estado: "" | "P" | "C" | "A" | "F";  // CORREGIDO: Solo P=Pendiente, C=Cancelado
    setEstado: (value: "" | "P" | "C" | "A" | "F") => void;
    habitacion: string;
    setHabitacion: (value: string) => void;
    fechaFiltro: "" | "hoy" | "semana" | "mes" | "proximas";
    setFechaFiltro: (value: "" | "hoy" | "semana" | "mes" | "proximas") => void;
    children?: React.ReactNode;
    habitacionesDisponibles?: { id: number; numero: string }[];
}

export default function ReservaHospedajeFilter({
    filtro,
    setFiltro,
    estado,
    setEstado,
    children = []
}: ReservaHospedajeFilterProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Contenedor filtros */}
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:flex-wrap">
                {/* Buscador por código, cliente o habitación */}
                <div className="relative flex-1 min-w-[250px]">
                    <FaSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        id="input-busqueda-reserva-hospedaje"
                        placeholder="Buscar por código, cliente o habitación..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-[#26a5b9] focus:outline-none focus:ring-2 focus:ring-[#26a5b9]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-[#26a5b9]"
                    />
                </div>

                {/* Filtro por Estado - CORREGIDO */}
                <div className="relative min-w-[180px]">
                    <FaUser className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <select
                        value={estado}
                        id="select-estado-reserva-hospedaje"
                        onChange={(e) => setEstado(e.target.value as "" | "P" | "C" | "A" | "F")} // Agregar "F"
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 transition-all duration-200 focus:border-[#26a5b9] focus:outline-none focus:ring-2 focus:ring-[#26a5b9]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:focus:border-[#26a5b9]"
                    >
                        <option id="option-todos-estados" value="">Todos los estados</option>
                        <option id="option-pendientes" value="P">Pendientes</option>
                        <option id="option-canceladas" value="C">Canceladas</option>
                        <option id="option-finalizadas" value="F">Finalizadas</option> {/* NUEVA OPCIÓN */}
                    </select>
                </div>
            </div>

            {/* Espacio para botones u otros children */}
            {children && <div className="flex gap-2">{children}</div>}
        </div>
    );
}