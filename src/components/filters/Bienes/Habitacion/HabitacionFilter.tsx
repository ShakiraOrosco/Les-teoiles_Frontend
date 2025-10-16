// src/components/filters/Bienes/Habitacion/HabitacionFilter.tsx
import React from "react";

interface HabitacionFilterProps {
  filtro: string;
  setFiltro: React.Dispatch<React.SetStateAction<string>>;
  estado: "" | "DISPONIBLE" | "OCUPADA" | "MANTENIMIENTO";
  setEstado: React.Dispatch<React.SetStateAction<"" | "DISPONIBLE" | "OCUPADA" | "MANTENIMIENTO">>;
  piso: number | "";
  setPiso: React.Dispatch<React.SetStateAction<number | "">>;
  children?: React.ReactNode; // botones o acciones adicionales
}

export default function HabitacionFilter({
  filtro,
  setFiltro,
  estado,
  setEstado,
  piso,
  setPiso,
  children,
}: HabitacionFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 
      rounded-xl">
      
      {/* Campo de búsqueda */}
      <div className="flex items-center gap-2 w-full md:w-1/3">
        <label htmlFor="busqueda-habitacion" className="sr-only">
          Buscar habitación
        </label>
        <input
          id="busqueda-habitacion"
          type="text"
          placeholder="Buscar por número o tipo..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-[#26a5b9] focus:outline-none focus:ring-2 focus:ring-[#26a5b9]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-[#26a5b9]"
        />
      </div>

      {/* Filtros adicionales */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Estado */}
        <div className="flex flex-col">
          <select
            id="estado-habitacion"
            value={estado}
            onChange={(e) => setEstado(e.target.value as "" | "DISPONIBLE" | "OCUPADA" | "MANTENIMIENTO")}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-all duration-200 focus:border-[#26a5b9] focus:outline-none focus:ring-2 focus:ring-[#26a5b9]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:focus:border-[#26a5b9] md:w-48"
          >
            <option value="">Todos los estados</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="OCUPADA">Ocupada</option>
            <option value="MANTENIMIENTO">Mantenimiento</option>
          </select>
        </div>

        {/* Piso */}
        <div className="flex flex-col">          
          <select
            id="piso-habitacion"
            value={piso}
            onChange={(e) => {
              const value = e.target.value;
              setPiso(value === "" ? "" : Number(value));
            }}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-all duration-200 focus:border-[#26a5b9] focus:outline-none focus:ring-2 focus:ring-[#26a5b9]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:focus:border-[#26a5b9] md:w-48"
          >
            <option value="">Todos los pisos</option>
            {[1,2,3,4,5,6,7,8,9].map((num) => (
              <option key={num} value={num}>Piso {num}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones / acciones adicionales */}
      {children && (
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          {children}
        </div>
      )}
    </div>
  );
}
