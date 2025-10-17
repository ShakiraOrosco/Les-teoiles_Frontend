import { useState, useEffect } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import HabitacionesTable from "../../../components/tables/Bienes/Habitacion/HabitacionTable";
import { Pagination } from "../../../components/tables/Pagination";
import HabitacionFilter from "../../../components/filters/Bienes/Habitacion/HabitacionFilter";
import Button from "../../../components/ui/button/Button";
import { FaPlus } from "react-icons/fa";
import { useModal } from "../../../hooks/useModal";
import { EstadoHabitacion, Habitacion } from "../../../types/Bienes/Habitacion/habitacion";
import { useHabitaciones } from "../../../hooks/Bienes/Habitacion/useHabitacion";
import CreateHabitacionModal from "../../../components/modals/Bienes/Habitacion/CreateHabitacionModal";
import EditHabitacionModal from "../../../components/modals/Bienes/Habitacion/EditHabitacionModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Alert from "../../../components/ui/alert/Alert";

export default function HabitacionesPage() {
  // Modales
  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();

  const { habitaciones, loading, error, refetch } = useHabitaciones();

  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<Habitacion | null>(null);

  // Filtros
  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState<"" | EstadoHabitacion>("");
  const [piso, setPiso] = useState<number | "">("");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // Alertas
  const [alert, setAlert] = useState<{
    variant: "success" | "info" | "warning" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Colores para Excel/PDF
  const colors = {
    verdeOscuro: '#0E7C7B',
    verdeMedio: '#2A9D8F',
    verdeClaro: '#99D8CD',
    verdeMenta: '#E8F4F2',
    blanco: '#FFFFFF',
    coralSuave: '#FF9B8A',
    grisClaro: '#F8F9FA',
    grisMedio: '#E9ECEF'
  };

  // 🔎 Filtrado
  const habitacionesFiltradas = (habitaciones ?? [])
    .filter(h => `${h.numero} ${h.tarifa_hotel.nombre}`.toLowerCase().includes(filtro.toLowerCase()))
    .filter(h => (estado === "" ? true : h.estado === estado))
    .filter(h => (piso === "" ? true : h.piso === piso));

  // 📄 Paginación
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const habitacionesPaginadas = habitacionesFiltradas.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(habitacionesFiltradas.length / elementosPorPagina);

  useEffect(() => setPaginaActual(1), [filtro, estado, piso]);

  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

  // 🧩 Manejo de edición
  const handleEdit = (habitacion: Habitacion) => {
    setHabitacionSeleccionada(habitacion);
    openEditModal();
  };

  // ====================== EXPORTAR EXCEL ======================
  const handleExportExcel = () => {
    const htmlTable = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', sans-serif; margin: 20px; background-color: ${colors.blanco}; }
            table { border-collapse: collapse; width: 95%; max-width: 1200px; margin: 0 auto; border: 2px solid ${colors.verdeMedio}; border-radius: 8px; overflow: hidden; }
            thead th { background: ${colors.verdeMedio}; color: white; padding: 12px; border: 1px solid ${colors.verdeOscuro}; text-align: center; }
            tbody td { padding: 10px; border: 1px solid ${colors.grisMedio}; text-align: center; }
            tbody tr:nth-child(even) { background-color: ${colors.verdeMenta}; }
            tbody tr:nth-child(odd) { background-color: ${colors.blanco}; }
            .activo { background: ${colors.verdeMedio}; color: white; font-weight: bold; }
            .inactivo { background: ${colors.coralSuave}; color: white; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center;color:${colors.verdeOscuro}">REPORTE DE HABITACIONES</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Número</th>
                <th>Piso</th>
                <th>Amoblado</th>
                <th>Baño Privado</th>
                <th>Tarifa</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${habitacionesFiltradas.map(h => `
                <tr>
                  <td>${h.id_habitacion}</td>
                  <td>${h.numero}</td>
                  <td>${h.piso}</td>
                  <td>${h.amoblado === "S" ? "Sí" : "No"}</td>
                  <td>${h.baño_priv === "S" ? "Sí" : "No"}</td>
                  <td>${h.tarifa_hotel.nombre}</td>
                  <td class="${h.estado === "DISPONIBLE" ? 'activo' : 'inactivo'}">${h.estado}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fecha = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `habitaciones_${fecha}.xls`;
    link.click();
    URL.revokeObjectURL(url);

    setAlert({ variant: "success", title: "✅ Exportación Excel", message: `Se exportaron ${habitacionesFiltradas.length} registros.` });
    setTimeout(() => setAlert(null), 3000);
  };

  // ====================== EXPORTAR PDF ======================
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // HEADER
    doc.setFillColor(14, 124, 123);
    doc.rect(0, 0, 297, 30, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('REPORTE DE HABITACIONES', 148.5, 15, { align: 'center' });

    const tableData = habitacionesFiltradas.map((h, i) => [
      i + 1,
      h.numero,
      h.piso,
      h.amoblado === "S" ? "Sí" : "No",
      h.baño_priv === "S" ? "Sí" : "No",
      h.tarifa_hotel.nombre,
      h.estado
    ]);

    autoTable(doc, {
      head: [['#', 'Número', 'Piso', 'Amoblado', 'Baño Privado', 'Tarifa', 'Estado']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 9, halign: 'center', valign: 'middle' },
      headStyles: { fillColor: [42, 157, 143], textColor: [255, 255, 255], fontStyle: 'bold' },
    });

    const fecha = new Date().toISOString().split('T')[0];
    doc.save(`habitaciones_${fecha}.pdf`);

    setAlert({ variant: "success", title: "✅ PDF generado", message: `Se exportaron ${habitacionesFiltradas.length} registros.` });
    setTimeout(() => setAlert(null), 3000);
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
              <FaPlus className="mr-2" /> Nueva Habitación
            </Button>
            <Button size="md" onClick={handleExportExcel}>📊 Excel</Button>
            <Button size="md" onClick={handleExportPDF}>📄 PDF</Button>
          </div>
        </HabitacionFilter>

        {alert && (
          <Alert variant={alert.variant} title={alert.title} message={alert.message} />
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando <span className="font-semibold text-[#26a5b9] dark:text-[#99d8cd]">{habitacionesFiltradas.length}</span> de{" "}
          <span className="font-semibold">{habitaciones?.length}</span> habitaciones
        </div>

        <div className="max-w-full space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div
                className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                style={{ borderTopColor: colors.verdeMedio, borderBottomColor: colors.verdeOscuro }}
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
                onEdit={handleEdit}
                onToggleEstado={() => { }}
                onDelete={() => { }}
              />
              <Pagination paginaActual={paginaActual} totalPaginas={totalPaginas} onPrev={onPrev} onNext={onNext} />
            </>
          )}
        </div>
      </div>

      {/* 🏠 Modal Crear */}
      <CreateHabitacionModal
        isOpen={isCreateOpen}
        onClose={() => {
          refetch();
          closeCreateModal();
        }}
      />

      {/* 📝 Modal Editar */}
      {habitacionSeleccionada && (
        <EditHabitacionModal
          isOpen={isEditOpen}
          onClose={() => {
            refetch();
            closeEditModal();
            setHabitacionSeleccionada(null);
          }}
          habitacion={habitacionSeleccionada}
          habitacionesExistentes={habitaciones ?? []}
          onUpdated={refetch}
        />
      )}
    </div>
  );
}
