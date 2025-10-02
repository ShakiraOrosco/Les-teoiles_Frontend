// src/components/filters/Bienes/Servicios/ServiciosFilter.tsx
import { FaSearch } from "react-icons/fa";

interface ServiciosFilterProps {
  filtro: string;
  setFiltro: (value: string) => void;
  tipo: "" | "E" | "A" | "X";  // ✅ Filtro por tipo
  setTipo: (value: "" | "E" | "A" | "X") => void;
  estado: "" | "A" | "I";  // ✅ Filtro por estado
  setEstado: (value: "" | "A" | "I") => void;
  children?: React.ReactNode;
}

export default function ServiciosFilter({
  filtro,
  setFiltro,
  estado,
  setEstado,
  children,
}: ServiciosFilterProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Contenedor filtros */}
      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        {/* Buscador por nombre, descripción o tipo */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, tipo o descripción..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-[#26a5b9] focus:outline-none focus:ring-2 focus:ring-[#26a5b9]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-[#26a5b9]"
          />
        </div>

        {/* Filtro de Estado (Activo/Inactivo) */}
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as "" | "A" | "I")}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-all duration-200 focus:border-[#26a5b9] focus:outline-none focus:ring-2 focus:ring-[#26a5b9]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:focus:border-[#26a5b9] md:w-48"
        >
          <option value="">Todos los estados</option>
          <option value="A">Activos</option>
          <option value="I">Inactivos</option>
        </select>
      </div>

      {/* Espacio para botones u otros children */}
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}