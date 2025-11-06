import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ReservasTable from "../../../components/tables/AdReservas/Reserva_Hospedaje/ReservaHospedajeTable";
import Button from "../../../components/ui/button/Button";
import { FaPlus } from "react-icons/fa";
import { Pagination } from "../../../components/tables/Pagination";
import Alert from "../../../components/ui/alert/Alert";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReservaHotel } from "../../../types/AdReserva/Reserva_Hospedaje/hospedaje";
import HospedajeModal from "../../../components/modals/AdReservas/Reserva_Hospedaje/CreateHospedajeModal";
import EditHospedajeModal from "../../../components/modals/AdReservas/Reserva_Hospedaje/EditHospedajeModal";
import { useReservasHotel } from "../../../hooks/AdReservas/Reserva_Hospedaje/useHospedaje";

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

// 📝 Función para convertir ReservaHotel a formato del modal
const convertirReservaParaModal = (reserva: ReservaHotel) => {
  const datosCliente = typeof reserva.datos_cliente === 'object' ? reserva.datos_cliente : null;
  
  return {
    id: reserva.id_reserva_hotel!,
    nombre: datosCliente?.nombre || '',
    apellidoPaterno: datosCliente?.app_paterno || '',
    apellidoMaterno: datosCliente?.app_materno || '',
    telefono: datosCliente?.telefono?.toString() || '',
    email: datosCliente?.email || '',
    carnet: datosCliente?.ci?.toString() || '',
    fechaInicio: reserva.fecha_ini || '',
    fechaFin: reserva.fecha_fin || '',
    cantidadPersonas: reserva.cant_personas?.toString() || '1',
    amoblado: reserva.amoblado === 'S' ? 'si' : 'no',
    banoPrivado: reserva.baño_priv === 'S' ? 'si' : 'no',
    montoTotal: 0,
    codigoReserva: `RES${reserva.id_reserva_hotel!}`,
    estado: reserva.estado || 'A'
  };
};

export default function ReservasPage() {
  const { reservas, loading, error, refetch } = useReservasHotel();
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  const [alert, setAlert] = useState<{
    variant: "success" | "info" | "warning" | "error";
    title: string;
    message: string;
  } | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reservaEdit, setReservaEdit] = useState<ReservaHotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 📄 Paginación SEGURA - asegurar que reservas es array
  const reservasArray = Array.isArray(reservas) ? reservas : [];
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const reservasPaginadas = reservasArray.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(reservasArray.length / elementosPorPagina);

  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

  // 📝 Acciones
  const handleEdit = (reserva: ReservaHotel) => {
    setReservaEdit(reserva);
    setIsEditModalOpen(true);
  };

  const handleCancel = (reserva: ReservaHotel) => {
    console.log("Cancelar reserva:", reserva);
    setAlert({
      variant: "info",
      title: "Reserva cancelada",
      message: `Reserva #${reserva.id_reserva_hotel} marcada como cancelada.`,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  // 📊 Exportar a Excel
  const handleExportExcel = () => {
    const reservasParaExportar = Array.isArray(reservas) ? reservas : [];
    
    const htmlTable = `
      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Código</th><th>Habitación</th><th>Cliente</th><th>Inicio</th><th>Fin</th><th>Personas</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${reservasParaExportar
            .map(
              (r) => {
                const habitacionId = typeof r.habitacion === 'object' ? r.habitacion.id_habitacion : r.habitacion;
                const clienteNombre = typeof r.datos_cliente === 'object' ? 
                  `${r.datos_cliente.nombre || ''} ${r.datos_cliente.app_paterno || ''}` : 
                  'Cliente no disponible';

                return `
                  <tr>
                    <td>${r.id_reserva_hotel}</td>
                    <td>RES${r.id_reserva_hotel}</td>
                    <td>${habitacionId || '-'}</td>
                    <td>${clienteNombre}</td>
                    <td>${r.fecha_ini || "-"}</td>
                    <td>${r.fecha_fin || "-"}</td>
                    <td>${r.cant_personas}</td>
                    <td>${r.estado}</td>
                  </tr>`;
              }
            )
            .join("")}
        </tbody>
      </table>
    `;
    const blob = new Blob([htmlTable], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const fecha = new Date().toISOString().split("T")[0];
    link.download = `reservas_${fecha}.xls`;
    link.click();
    setAlert({
      variant: "success",
      title: "Excel exportado",
      message: `${reservasParaExportar.length} reservas exportadas.`,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  // 📄 Exportar PDF
  const handleExportPDF = () => {
    const reservasParaExportar = Array.isArray(reservas) ? reservas : [];
    
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("REPORTE DE RESERVAS", 150, 15, { align: "center" });

    const tableData: (string | number)[][] = reservasParaExportar.map((r) => {
      const habitacionId = typeof r.habitacion === 'object' ? r.habitacion.id_habitacion : r.habitacion;
      const clienteNombre = typeof r.datos_cliente === 'object' ? 
        `${r.datos_cliente.nombre || ''} ${r.datos_cliente.app_paterno || ''}` : 
        'Cliente no disponible';

      return [
        r.id_reserva_hotel ?? "-",
        `RES${r.id_reserva_hotel}`,
        habitacionId ?? "-",
        clienteNombre,
        r.fecha_ini ?? "-",
        r.fecha_fin ?? "-",
        r.cant_personas ?? "-",
        r.estado ?? "-"
      ];
    });

    autoTable(doc, {
      head: [["ID", "Código", "Habitación", "Cliente", "Inicio", "Fin", "Personas", "Estado"]],
      body: tableData,
      startY: 25,
    });

    const fecha = new Date().toISOString().split("T")[0];
    doc.save(`reservas_${fecha}.pdf`);

    setAlert({
      variant: "success",
      title: "PDF generado",
      message: `${reservasParaExportar.length} reservas exportadas.`,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div>
      <PageMeta title="Reservas" description="Gestión de reservas de hospedaje" />
      <PageBreadcrumb pageTitle="Reservas de Hospedaje" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 px-5 py-7 xl:px-10 xl:py-12 space-y-6">
        {/* Botones sin filtro */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="text-lg font-semibold dark:text-white">
            {loading ? "Cargando reservas..." : `Total de reservas: ${reservasArray.length}`}
          </div>

          <div className="flex flex-wrap gap-2 ">
            <Button size="md" variant="primary" onClick={() => setIsModalOpen(true)}>
              <FaPlus className="mr-2" /> Nueva Reserva
            </Button>

            <Button size="md" onClick={handleExportExcel} disabled={loading}>
              📊 Excel
            </Button>
            <Button size="md" onClick={handleExportPDF} disabled={loading}>
              📄 PDF
            </Button>
          </div>
        </div>

        {/* Modal de CREAR */}
        <HospedajeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Modal de EDITAR */}
        <EditHospedajeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setReservaEdit(null);
          }}
          reserva={reservaEdit ? convertirReservaParaModal(reservaEdit) : null}
          onSave={() => {
            refetch();
            setAlert({
              variant: "success",
              title: "Reserva actualizada",
              message: "Reserva actualizada correctamente.",
            });
            setIsEditModalOpen(false);
            setReservaEdit(null);
            setTimeout(() => setAlert(null), 3000);
          }}
        />

        {alert && (
          <Alert variant={alert.variant} title={alert.title} message={alert.message} />
        )}

        <div className="max-w-full space-y-6">
          {/* LOADING DENTRO DEL CONTENEDOR */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div
                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4"
                style={{ borderTopColor: colors.verdeMedio, borderBottomColor: colors.verdeOscuro }}
              ></div>
              <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
                Cargando reservas...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Alert variant="error" title="Error" message={error} />
              <Button 
                variant="outline" 
                onClick={refetch} 
                className="mt-4"
              >
                Reintentar
              </Button>
            </div>
          ) : reservasArray.length === 0 ? (
            <div className="text-center py-16">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e2e8f6] dark:bg-[#458890]/20 mb-6"
              >
                <svg
                  className="w-10 h-10 text-[#26a5b9] dark:text-[#99d8cd]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-4">
                No hay reservas registradas
              </p>
              <Button 
                variant="primary" 
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus className="mr-2" /> Crear Primera Reserva
              </Button>
            </div>
          ) : (
            <>
              <ReservasTable
                reservas={reservasPaginadas}
                onEdit={handleEdit}
                onCancel={handleCancel}
              />
              
              {reservasArray.length > 0 && (
                <Pagination
                  paginaActual={paginaActual}
                  totalPaginas={totalPaginas}
                  onPrev={onPrev}
                  onNext={onNext}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}