// src/pages/habitaciones/HabitacionesPage.tsx
import { useState, useEffect } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import HabitacionesTable from "../../../components/tables/Bienes/Habitacion/HabitacionTable";
import { Pagination } from "../../../components/tables/Pagination";
import HabitacionFilter from "../../../components/filters/Bienes/Habitacion/HabitacionFilter";
import Button from "../../../components/ui/button/Button";
import { FaPlus } from "react-icons/fa";
import { useModal } from "../../../hooks/useModal";
import { EstadoHabitacion } from "../../../types/Bienes/Habitacion/habitacion";
import { useHabitaciones } from "../../../hooks/Bienes/Habitacion/useHabitacion";
import CreateHabitacionModal from "../../../components/modals/Bienes/Habitacion/CreateHabitacionModal";

export default function HabitacionesPage() {
  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const { habitaciones, loading, error, refetch } = useHabitaciones();

  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState<"" | EstadoHabitacion>("");
  const [piso, setPiso] = useState<number | "">("");

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const colores = {
    lightBg: "#e2e8f6",
    lightAccent: "#b9dcf0",
    primary: "#26a5b9",
    primaryDark: "#458890",
    secondary: "#99d8cd",
    extra: "#ddd3ef",
  };

  const habitacionesFiltradas = (habitaciones ?? [])
    .filter((h) =>
      `${h.numero} ${h.tarifa_hotel.nombre}`.toLowerCase().includes(filtro.toLowerCase())
    )
    .filter((h) => (estado === "" ? true : h.estado === estado))
    .filter((h) => (piso === "" ? true : h.piso === piso));

  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const habitacionesPaginadas = habitacionesFiltradas.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(habitacionesFiltradas.length / elementosPorPagina);

  useEffect(() => setPaginaActual(1), [filtro, estado, piso]);

  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

  const handleCreated = async () => {
    await refetch();
    closeCreateModal();
  };

  return (
    <div>
      <PageMeta title="Habitaciones" description="Gestión de habitaciones" />
      <PageBreadcrumb pageTitle="Habitaciones" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 px-5 py-7 xl:px-10 xl:py-12 space-y-6">
        <HabitacionFilter
          filtro={filtro}
          setFiltro={setFiltro}
          estado={estado}
          setEstado={setEstado}
          piso={piso}
          setPiso={setPiso}
        >
          <div className="flex flex-wrap gap-2">
            <Button size="md" variant="primary" onClick={openCreateModal}>
              <FaPlus className="size-3" /> Nueva Habitación
            </Button>
          </div>
        </HabitacionFilter>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando <span className="font-semibold text-[#26a5b9] dark:text-[#99d8cd]">{habitacionesFiltradas.length}</span> de{" "}
          <span className="font-semibold">{habitaciones?.length}</span> habitaciones
        </div>

        <div className="max-w-full space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div
                className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                style={{ borderTopColor: colores.primary, borderBottomColor: colores.primaryDark }}
              ></div>
              <p className="text-center text-gray-500 dark:text-gray-400">Cargando habitaciones...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 dark:text-red-400">{error}</p>
          ) : habitacionesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e2e8f6] dark:bg-[#458890]/20 mb-4"
              >
                <svg
                  className="w-8 h-8 text-[#26a5b9] dark:text-[#99d8cd]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                No hay habitaciones que coincidan con el filtro
              </p>
            </div>
          ) : (
            <>
              <HabitacionesTable
                habitaciones={habitacionesPaginadas}
                onEdit={() => {}}
                onToggleEstado={() => {}}
                onDelete={() => {}}
              />
              <Pagination paginaActual={paginaActual} totalPaginas={totalPaginas} onPrev={onPrev} onNext={onNext} />
            </>
          )}
        </div>
      </div>

<CreateHabitacionModal isOpen={isCreateOpen} onClose={() => {
  refetch();
  closeCreateModal();
}} />
    </div>
  );
}
