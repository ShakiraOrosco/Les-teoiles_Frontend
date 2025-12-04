import { ReactNode } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

interface UsuariosFilterProps {
    filtro: string;
    setFiltro: (value: string) => void;
    estado: "" | "A" | "I";
    setEstado: (value: "" | "A" | "I") => void;
    rol: "" | "administrador" | "empleado";
    setRol: (value: "" | "administrador" | "empleado") => void;
    children?: ReactNode;
}

export default function UsuariosFilter({
    filtro,
    setFiltro,
    estado,
    setEstado,
    rol,
    setRol,
    children,
}: UsuariosFilterProps) {
    
    const hasActiveFilters = estado !== "" || rol !== "" || filtro !== "";

    const clearFilters = () => {
        setFiltro("");
        setEstado("");
        setRol("");
    };

    return (
        <div className="space-y-4">
            {/* Barra superior: Búsqueda y Botones de acción */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Barra de búsqueda */}
                <div className="relative flex-1 w-full lg:max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 size-4" />
                    <input
                        type="text"
                        id="input-busqueda-usuarios"
                        placeholder="Buscar por nombre, CI, teléfono o correo..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#26a5b9] focus:border-[#26a5b9] transition-colors text-sm"
                    />
                    {filtro && (
                        <button
                            onClick={() => setFiltro("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <FaTimes className="size-4" />
                        </button>
                    )}
                </div>

                {/* Botones de acción (hijos) */}
                <div className="flex gap-2 w-full lg:w-auto">
                    {children}
                </div>
            </div>

            {/* Filtros secundarios */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FaFilter className="size-4 text-[#26a5b9]" />
                    <span>Filtros:</span>
                </div>

                {/* Filtro por Estado */}
                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as "" | "A" | "I")}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-[#26a5b9] focus:border-[#26a5b9] transition-colors cursor-pointer"
                >
                    <option value="">Todos los estados</option>
                    <option value="A">Activos</option>
                    <option value="I">Inactivos</option>
                </select>

                {/* Filtro por Rol */}
                <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value as "" | "administrador" | "empleado")}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-[#26a5b9] focus:border-[#26a5b9] transition-colors cursor-pointer"
                >
                    <option value="">Todos los roles</option>
                    <option value="administrador">Administradores</option>
                    <option value="empleado">Empleados</option>
                </select>

                {/* Botón limpiar filtros */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                    >
                        <FaTimes className="size-3" />
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* Indicador de filtros activos */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {filtro && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#26a5b9]/10 text-[#26a5b9] dark:bg-[#26a5b9]/20 dark:text-[#99d8cd] text-xs font-medium">
                            Búsqueda: "{filtro}"
                            <button onClick={() => setFiltro("")} className="hover:text-[#1e8a9a]">
                                <FaTimes className="size-3" />
                            </button>
                        </span>
                    )}
                    {estado && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#26a5b9]/10 text-[#26a5b9] dark:bg-[#26a5b9]/20 dark:text-[#99d8cd] text-xs font-medium">
                            Estado: {estado === "A" ? "Activo" : "Inactivo"}
                            <button onClick={() => setEstado("")} className="hover:text-[#1e8a9a]">
                                <FaTimes className="size-3" />
                            </button>
                        </span>
                    )}
                    {rol && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#26a5b9]/10 text-[#26a5b9] dark:bg-[#26a5b9]/20 dark:text-[#99d8cd] text-xs font-medium">
                            Rol: {rol === "administrador" ? "administrador" : "empleado"}
                            <button onClick={() => setRol("")} className="hover:text-[#1e8a9a]">
                                <FaTimes className="size-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}