// src/components/filters/AdReservas/Reserva_Eventos/EventosFilter.tsx
import { FiFilter, FiX } from "react-icons/fi";

interface ReservaEventosFilterProps {
  filtro: string;
  setFiltro: (filtro: string) => void;
  estado: "" | "P" | "C" | "A" | "F";
  setEstado: (estado: "" | "P" | "C" | "A" | "F") => void;
  tipoEvento: string;
  setTipoEvento: (tipo: string) => void;
  fechaFiltro: "" | "hoy" | "semana" | "mes" | "proximas";
  setFechaFiltro: (fecha: "" | "hoy" | "semana" | "mes" | "proximas") => void;
  children?: React.ReactNode;
}

export default function ReservaEventosFilter({
  filtro,
  setFiltro,
  estado,
  setEstado,
  fechaFiltro,
  setFechaFiltro,
  children
}: ReservaEventosFilterProps) {
  const hayFiltrosActivos = filtro || estado || fechaFiltro;


  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "P": return "Pendiente";
      case "C": return "Cancelado";
      case "F": return "Finalizado";
      default: return "Todos";
    }
  };

  const getFechaLabel = (fecha: string) => {
    switch (fecha) {
      case "hoy": return "Hoy";
      case "semana": return "Esta semana";
      case "mes": return "Este mes";
      case "proximas": return "Próximas";
      default: return "Todas las fechas";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
            <FiFilter className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filtros de Eventos
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Filtra las reservas de eventos según tus necesidades
            </p>
          </div>
        </div>
      </div>

      {/* Filtros principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda general */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar
          </label>
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Código, cliente..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as "" | "P" | "C" | "A" | "F")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos los estados</option>
            <option value="P">Pendiente</option>
            <option value="F">Finalizado</option>
            <option value="C">Cancelado</option>
          </select>
        </div>
          

        {/* Filtro por fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fecha del Evento
          </label>
          <select
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value as "" | "hoy" | "semana" | "mes" | "proximas")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas las fechas</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="proximas">Próximos eventos</option>
          </select>
        </div>
      </div>

      {/* Filtros activos */}
      {hayFiltrosActivos && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Filtros activos:</span>
          
          {filtro && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900/30 dark:text-blue-300">
              Búsqueda: "{filtro}"
              <button
                onClick={() => setFiltro("")}
                className="hover:text-blue-600"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {estado && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full dark:bg-green-900/30 dark:text-green-300">
              Estado: {getEstadoLabel(estado)}
              <button
                onClick={() => setEstado("")}
                className="hover:text-green-600"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          
          
          {fechaFiltro && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full dark:bg-orange-900/30 dark:text-orange-300">
              Fecha: {getFechaLabel(fechaFiltro)}
              <button
                onClick={() => setFechaFiltro("")}
                className="hover:text-orange-600"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Botones de acción */}
      {children && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}