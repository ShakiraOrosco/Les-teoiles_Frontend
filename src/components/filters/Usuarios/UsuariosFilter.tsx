import React from "react";

interface UsuariosFilterProps {
  filtro: string;
  setFiltro: (v: string) => void;
  estado: "" | "A" | "I";
  setEstado: (v: "" | "A" | "I") => void;
  rol: "" | "administrador" | "empleado";
  setRol: (v: "" | "administrador" | "empleado") => void;
  children?: React.ReactNode;
}

const UsuariosFilter: React.FC<UsuariosFilterProps> = ({
  filtro,
  setFiltro,
  estado,
  setEstado,
  rol,
  setRol,
  children,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por nombre, CI, email..."
          className="input input-bordered"
        />

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as "" | "A" | "I")}
          className="select select-bordered"
        >
          <option value="">Todos</option>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>

        <select
          value={rol}
          onChange={(e) =>
            setRol(e.target.value as "" | "administrador" | "empleado")
          }
          className="select select-bordered"
        >
          <option value="">Todos los roles</option>
          <option value="administrador">Administrador</option>
          <option value="empleado">Empleado</option>
        </select>
      </div>

      {/* Zona para botones / children */}
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};

export default UsuariosFilter;
