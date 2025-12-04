import { useState, useMemo } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ReservasTable from "../../../components/tables/AdReservas/Reserva_Hospedaje/ReservaHospedajeTable";
import ReservaHospedajeFilter from "../../../components/filters/AdReservas/Reservas_Hospedaje/HospedajeFilter";
import Button from "../../../components/ui/button/Button";
import { FaPlus } from "react-icons/fa";
import { Pagination } from "../../../components/tables/Pagination";
import Alert from "../../../components/ui/alert/Alert";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReservaHotel } from "../../../types/AdReserva/Reserva_Hospedaje/hospedaje";
import HospedajeModal from "../../../components/modals/AdReservas/Reserva_Hospedaje/CreateHospedajeModal";
import EditHospedajeModal from "../../../components/modals/AdReservas/Reserva_Hospedaje/EditHospedajeModal";
import EliminarReservaModal from "../../../components/modals/AdReservas/Reserva_Hospedaje/DeleteHospedajeModal";
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

export default function ReservasPage() {
  const { reservas, loading, error, refetch } = useReservasHotel();
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  // NUEVOS ESTADOS PARA FILTROS
  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"" | "P" | "C" | "A" | "F">(""); 
  const [filtroHabitacion, setFiltroHabitacion] = useState("");
  const [filtroFecha, setFiltroFecha] = useState<"" | "hoy" | "semana" | "mes" | "proximas">("");

  const [alert, setAlert] = useState<{
    variant: "success" | "info" | "warning" | "error";
    title: string;
    message: string;
  } | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reservaEdit, setReservaEdit] = useState<ReservaHotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reservaDelete, setReservaDelete] = useState<ReservaHotel | null>(null);

  // 📊 FILTRADO DE RESERVAS - VERSIÓN CON "FINALIZADAS"
  const reservasFiltradas = useMemo(() => {
    let filtered = Array.isArray(reservas) ? reservas : [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Filtro por texto (código, cliente, habitación)
    if (filtro) {
      const filtroLower = filtro.toLowerCase();
      filtered = filtered.filter(reserva => {
        const codigo = `RES${reserva.id_reserva_hotel}`.toLowerCase();

        const habitacionInfo = (typeof reserva.habitacion === 'object' && reserva.habitacion !== null) ?
          (reserva.habitacion.numero || String(reserva.habitacion)).toLowerCase() :
          String(reserva.habitacion).toLowerCase();

        const clienteInfo = typeof reserva.datos_cliente === 'object' ?
          `${reserva.datos_cliente.nombre || ''} ${reserva.datos_cliente.app_paterno || ''}`.toLowerCase() :
          '';

        return codigo.includes(filtroLower) ||
          habitacionInfo.includes(filtroLower) ||
          clienteInfo.includes(filtroLower);
      });
    }

    // Filtro por estado - ACTUALIZADO CON "FINALIZADAS"
    if (filtroEstado) {
      filtered = filtered.filter(reserva => {
        // Si es cancelado, usar el estado directamente
        if (filtroEstado === "C") {
          return reserva.estado === "C";
        }

        // Para los demás estados, determinar según fechas
        const fechaInicio = reserva.fecha_ini ? new Date(reserva.fecha_ini) : null;
        const fechaFin = reserva.fecha_fin ? new Date(reserva.fecha_fin) : null;

        if (filtroEstado === "P") {
          // Pendiente: sin fecha de inicio o fecha futura
          return !fechaInicio || fechaInicio > hoy;
        }

        if (filtroEstado === "A") {
          // Activa: con fecha de inicio hoy o en el pasado, y fecha fin hoy o en el futuro
          return fechaInicio && fechaInicio <= hoy && (!fechaFin || fechaFin >= hoy);
        }

        if (filtroEstado === "F") {
          // Finalizada: fecha de fin es anterior a hoy
          return fechaFin && fechaFin < hoy;
        }

        return true;
      });
    }

    return filtered;
  }, [reservas, filtro, filtroEstado, filtroHabitacion, filtroFecha]);

  // 📄 Paginación SEGURA - usar reservas filtradas
  const reservasArray = reservasFiltradas;
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const reservasPaginadas = reservasArray.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(reservasArray.length / elementosPorPagina);

  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

  // Obtener habitaciones únicas para el filtro
  const habitacionesDisponibles = useMemo(() => {
    const habitacionesMap = new Map();

    reservas.forEach(reserva => {
      if (typeof reserva.habitacion === 'object' && reserva.habitacion !== null) {
        const hab = reserva.habitacion;
        if (hab.id_habitacion && hab.numero) {
          habitacionesMap.set(hab.id_habitacion, {
            id: hab.id_habitacion,
            numero: hab.numero
          });
        }
      }
    });

    return Array.from(habitacionesMap.values());
  }, [reservas]);

  // 📝 Acciones
  const handleEdit = (reserva: ReservaHotel) => {
    setReservaEdit(reserva);
    setIsEditModalOpen(true);
  };

  const handleDelete = (reserva: ReservaHotel) => {
    setReservaDelete(reserva);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    refetch();
    setAlert({
      variant: "success",
      title: "Reserva cancelada",
      message: `La reserva ha sido cancelada exitosamente.`,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSaveEdit = (reservaActualizada: ReservaHotel) => {
    refetch();
    setAlert({
      variant: "success",
      title: "Reserva actualizada",
      message: "Reserva actualizada correctamente.",
    });
    setIsEditModalOpen(false);
    setReservaEdit(null);
    setTimeout(() => setAlert(null), 3000);
  };

  // 📊 Exportar a Excel
  const handleExportExcel = () => {
    const reservasParaExportar = reservasFiltradas;

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
    const reservasParaExportar = reservasFiltradas;

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
        {/* FILTROS - REEMPLAZA LA SECCIÓN DE BOTONES ACTUAL */}
        <ReservaHospedajeFilter
          filtro={filtro}
          setFiltro={setFiltro}
          estado={filtroEstado}
          setEstado={setFiltroEstado}
          habitacion={filtroHabitacion}
          setHabitacion={setFiltroHabitacion}
          fechaFiltro={filtroFecha}
          setFechaFiltro={setFiltroFecha}
          habitacionesDisponibles={habitacionesDisponibles}
        >
          {/* Botones de acción */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="md"
              id="btn-nueva-reserva"
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus className="mr-2" />Nueva Reserva
            </Button>

            <Button size="md" id="btn-exportar-excel" onClick={handleExportExcel} disabled={loading}>
              📊 Excel
            </Button>
            <Button size="md" id="btn-exportar-pdf" onClick={handleExportPDF} disabled={loading}>
              📄 PDF
            </Button>
          </div>
        </ReservaHospedajeFilter>

        {/* Información de resultados */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold dark:text-white">
            {loading ? "Cargando reservas..." : `Mostrando ${reservasPaginadas.length} de ${reservasArray.length} reservas`}
          </div>

          {reservasArray.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Página {paginaActual} de {totalPaginas}
            </div>
          )}
        </div>

        {/* Modal de CREAR */}
        <HospedajeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            refetch();
            setAlert({
              variant: "success",
              title: "Reserva creada",
              message: "Reserva creada correctamente.",
            });
            setTimeout(() => setAlert(null), 3000);
          }}
        />

        {/* Modal de EDITAR */}
        <EditHospedajeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setReservaEdit(null);
          }}
          reserva={reservaEdit}
          onSave={handleSaveEdit}
        />

        {/* Modal de ELIMINAR */}
        <EliminarReservaModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setReservaDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          reservaId={reservaDelete?.id_reserva_hotel || 0}
          codigoReserva={reservaDelete ? `RES${reservaDelete.id_reserva_hotel}` : undefined}
          tipo="hospedaje"
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
                onCancel={handleDelete}
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