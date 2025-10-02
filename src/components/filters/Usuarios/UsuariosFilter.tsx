// src/components/filters/Usuarios/UsuariosFilter.tsx
import { FaSearch } from "react-icons/fa";

interface UsuariosFilterProps {
  filtro: string;
  setFiltro: (value: string) => void;
  estado: "" | "A" | "I";
  setEstado: (value: "" | "A" | "I") => void;
  rol: "" | "administrador" | "empleado";
  setRol: (value: "" | "administrador" | "empleado") => void;
  children?: React.ReactNode;
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
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Contenedor filtros */}
      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        {/* Buscador por nombre, CI o código */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, CI o código..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-[#3b82f6]"
          />
        </div>

        {/* Filtro de Rol */}
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value as "" | "administrador" | "empleado")}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-all duration-200 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:focus:border-[#3b82f6] md:w-48"
        >
          <option value="">Todos los roles</option>
          <option value="administrador">Administrador</option>
          <option value="empleado">Empleado</option>
        </select>

        {/* Filtro de Estado */}
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as "" | "A" | "I")}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-all duration-200 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:focus:border-[#3b82f6] md:w-48"
        >
          <option value="">Todos los estados</option>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>
      </div>

      {/* Espacio para botones u otros children */}
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}