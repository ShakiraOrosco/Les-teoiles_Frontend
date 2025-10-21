// src/pages/servicios/ServiciosAdicionalesPage.tsx
import { useState, useEffect } from "react";

// Componentes comunes
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";

// Tablas y filtros
import ServiciosTable from "../../../components/tables/Bienes/Servicios/ServiciosTable";
import { Pagination } from "../../../components/tables/Pagination";
import ServiciosFilter from "../../../components/filters/Bienes/Servicios/ServiciosFilter";

// UI
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";

// Modales
import CreateServicioModal from "../../../components/modals/Bienes/Servicios/CreateServicioModal";
import EditServicioModal from "../../../components/modals/Bienes/Servicios/EditServicioModal";

// Hooks
import { useModal } from "../../../hooks/useModal";
import { useServicios } from "../../../hooks/Bienes/Servicios/useServicios";
import ToggleServicioModal from "../../../components/modals/Bienes/Servicios/DeleteServicioModal";


// Tipos
import { ServicioAdicional } from "../../../types/Bienes/Servicios/servicio";

// Excel y PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ServiciosAdicionalesPage() {
  // Modales
  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Hook dinámico
  const { servicios, loading, refetch } = useServicios();
  const [servicioEdit, setServicioEdit] = useState<ServicioAdicional | null>(null);

  // Modal de activación/desactivación
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [servicioToggle, setServicioToggle] = useState<ServicioAdicional | null>(null);

  // Alertas
  const [alert, setAlert] = useState<{
    variant: "success" | "info" | "warning" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Filtros
  const [filtro, setFiltro] = useState("");
  const [tipo, setTipo] = useState<"" | "E" | "A" | "X">("");
  const [estado, setEstado] = useState<"" | "A" | "I">("");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 7;

  // Helper para obtener nombre del tipo
  const getTipoNombre = (tipo: string) => {
    switch (tipo) {
      case "E": return "Establecimiento";
      case "A": return "Alimentación";
      case "X": return "Extra";
      default: return "";
    }
  };

  // Filtrado
  const serviciosFiltrados = servicios.filter((servicio) => {
    const tipoCompleto = getTipoNombre(servicio.tipo);
    const matchesFiltro = `${servicio.nombre} ${servicio.descripcion || ""} ${tipoCompleto}`.toLowerCase().includes(filtro.toLowerCase());
    const matchesEstado = estado === "" || servicio.estado === estado;
    const matchesTipo = tipo === "" || servicio.tipo === tipo;
    return matchesFiltro && matchesEstado && matchesTipo;
  });

  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const serviciosPaginados = serviciosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(serviciosFiltrados.length / elementosPorPagina);

  useEffect(() => setPaginaActual(1), [filtro, estado, tipo]);

  // Handlers
  const handleEdit = (servicio: ServicioAdicional) => {
    setServicioEdit(servicio);
    setIsEditOpen(true);
  };

  const handleToggleEstado = (servicio: ServicioAdicional) => {
    setServicioToggle(servicio);
    setIsToggleOpen(true);
  };


  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

  // ====================== EXPORTAR EXCEL ======================
  const handleExportExcel = () => {
    const htmlTable = `
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Tipo</th><th>Descripción</th><th>Precio</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${serviciosFiltrados.map(s => `
            <tr>
              <td>${s.id_servicios_adicionales}</td>
              <td>${s.nombre}</td>
              <td>${getTipoNombre(s.tipo)}</td>
              <td>${s.descripcion || "Sin descripción"}</td>
              <td>${Number(s.precio).toFixed(2)}</td>
              <td>${s.estado === "A" ? "Activo" : "Inactivo"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    const blob = new Blob([htmlTable], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `servicios_adicionales_${new Date().toISOString().split("T")[0]}.xls`;
    link.click();
    URL.revokeObjectURL(url);

    setAlert({
      variant: "success",
      title: "✅ Exportación exitosa",
      message: `Se exportaron ${serviciosFiltrados.length} registros a Excel.`,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  // ====================== EXPORTAR PDF ======================
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(16);
    doc.text("SERVICIOS ADICIONALES", 150, 15, { align: "center" });

    const tableData = serviciosFiltrados.map((s, i) => [
      i + 1,
      s.nombre,
      getTipoNombre(s.tipo),
      s.descripcion || "Sin descripción",
      `Bs. ${Number(s.precio).toFixed(2)}`,
      s.estado === "A" ? "Activo" : "Inactivo",
    ]);

    autoTable(doc, {
      head: [["#", "Nombre", "Tipo", "Descripción", "Precio", "Estado"]],
      body: tableData,
      startY: 25,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [38, 165, 185] },
    });

    doc.save(`servicios_adicionales_${new Date().toISOString().split("T")[0]}.pdf`);

    setAlert({
      variant: "success",
      title: "✅ PDF generado",
      message: `Se exportaron ${serviciosFiltrados.length} registros a PDF.`,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  // REFRESH
  const onRefresh = () => refetch();

  return (
    <div>
      <PageMeta title="Servicios Adicionales" description="Gestión de servicios adicionales" />
      <PageBreadcrumb pageTitle="Servicios Adicionales" />

      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-6">
        {alert && <Alert {...alert} />}

        <ServiciosFilter
          filtro={filtro} setFiltro={setFiltro}
          tipo={tipo} setTipo={setTipo}
          estado={estado} setEstado={setEstado}
        >
          <div className="flex flex-wrap gap-2">
            <Button size="md" variant="outline" onClick={handleExportExcel}>📊 Excel</Button>
            <Button size="md" variant="outline" onClick={handleExportPDF}>📄 PDF</Button>
            <Button size="md" variant="primary" onClick={openCreateModal}>➕ Nuevo Servicio</Button>
          </div>
        </ServiciosFilter>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando <span className="font-semibold text-[#26a5b9] dark:text-[#99d8cd]">{serviciosFiltrados.length}</span> de{" "}
          <span className="font-semibold">{servicios.length}</span> servicios
        </div>

        <div className="max-w-full space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#26a5b9] mb-4"></div>
              <p className="text-center text-gray-500 dark:text-gray-400">Cargando servicios...</p>
            </div>
          ) : serviciosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e2e8f6] dark:bg-[#458890]/20 mb-4">
                <svg className="w-8 h-8 text-[#26a5b9] dark:text-[#99d8cd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No hay servicios que coincidan con el filtro</p>
            </div>
          ) : (
            <>
              <ServiciosTable servicios={serviciosPaginados} onEdit={handleEdit} onToggleEstado={handleToggleEstado} />
              <Pagination paginaActual={paginaActual} totalPaginas={totalPaginas} onPrev={onPrev} onNext={onNext} />
            </>
          )}
        </div>
      </div>

      <CreateServicioModal isOpen={isCreateOpen} onClose={closeCreateModal} />
      {servicioEdit && <EditServicioModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} servicio={servicioEdit} onEdited={onRefresh} />}
      {servicioToggle && (
        <ToggleServicioModal
          isOpen={isToggleOpen}
          onClose={() => setIsToggleOpen(false)}
          servicio={servicioToggle}
          onToggled={() => {
            refetch();
            setAlert({
              variant: "warning",
              title: "Estado actualizado",
              message: `El servicio "${servicioToggle.nombre}" cambió de estado.`,
            });
            setTimeout(() => setAlert(null), 3000);
          }}
        />
      )}

    </div>
  );
}
