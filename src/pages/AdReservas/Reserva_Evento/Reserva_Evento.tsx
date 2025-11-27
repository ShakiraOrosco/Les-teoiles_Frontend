import { useState, useMemo } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ReservasEventosTable from "../../../components/tables/AdReservas/Reserva_Eventos/ReservaEventoTable";
import ReservaEventosFilter from "../../../components/filters/AdReservas/Reservas_Eventos/EventosFilter";
import Button from "../../../components/ui/button/Button";
import { FaPlus } from "react-icons/fa";
import { Pagination } from "../../../components/tables/Pagination";
import Alert from "../../../components/ui/alert/Alert";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReservaEvento } from "../../../types/AdReserva/Reservas_Eventos/eventos";
import EventoModal from "../../../components/modals/AdReservas/Reserva_Eventos/CreateEventoModal";
import EditEventoModal from "../../../components/modals/AdReservas/Reserva_Eventos/EditEventoModal";
import DeleteEventoModal from "../../../components/modals/AdReservas/Reserva_Eventos/DeleteEventoModal";
import ViewEventoModal from "../../../components/modals/AdReservas/Reserva_Eventos/ViewEventoModal";
import { useEventos } from "../../../hooks/AdReservas/Reserva_Eventos/useEventos";

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

export default function ReservasEventosPage() {
    const { eventos, loading, error, refetch } = useEventos();
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 6;

    // ESTADOS PARA FILTROS
    const [filtro, setFiltro] = useState("");
    const [filtroEstado, setFiltroEstado] = useState<"" | "P" | "C" | "A" | "F">("");
    const [filtroTipoEvento, setFiltroTipoEvento] = useState("");
    const [filtroFecha, setFiltroFecha] = useState<"" | "hoy" | "semana" | "mes" | "proximas">("");

    const [alert, setAlert] = useState<{
        variant: "success" | "info" | "warning" | "error";
        title: string;
        message: string;
    } | null>(null);

    // ESTADOS PARA MODALES
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [reservaEdit, setReservaEdit] = useState<ReservaEvento | null>(null);
    const [reservaDelete, setReservaDelete] = useState<ReservaEvento | null>(null);
    const [selectedReserva, setSelectedReserva] = useState<ReservaEvento | null>(null);

    // 🔹 Función para obtener fecha actual en Bolivia
    const getHoyBolivia = () => {
        const ahora = new Date();
        return ahora.toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' });
    };

    // 📊 FILTRADO DE RESERVAS DE EVENTOS - CORREGIDO CON ZONA HORARIA BOLIVIA
    const reservasFiltradas = useMemo(() => {
        let filtered = Array.isArray(eventos) ? eventos : [];
        const hoyBolivia = getHoyBolivia(); // Formato YYYY-MM-DD

        console.log("Total eventos:", filtered.length);
        console.log("Hoy en Bolivia:", hoyBolivia);
        console.log("Filtros aplicados:", { filtro, filtroEstado, filtroTipoEvento, filtroFecha });

        // Filtro por texto (código, cliente, tipo de evento)
        if (filtro) {
            const filtroLower = filtro.toLowerCase();
            filtered = filtered.filter(reserva => {
                const codigo = `EVT${reserva.id_reservas_evento}`.toLowerCase();
                const clienteNombre = `${reserva.datos_cliente?.nombre || ''} ${reserva.datos_cliente?.app_paterno || ''}`.toLowerCase();

                return codigo.includes(filtroLower) ||
                    clienteNombre.includes(filtroLower)
            });
        }

        // Filtro por estado
        if (filtroEstado) {
            filtered = filtered.filter(reserva => {
                // Si es cancelado, usar el estado directamente
                if (filtroEstado === "C") {
                    return reserva.estado === "C";
                }

                // Para los demás estados, determinar según fechas usando strings
                const fechaEventoStr = reserva.fecha ? reserva.fecha.split('T')[0] : null;

                if (filtroEstado === "P") {
                    // Pendiente: fecha futura y no cancelado
                    return fechaEventoStr && fechaEventoStr > hoyBolivia && reserva.estado !== "C";
                }

                if (filtroEstado === "A") {
                    // Activa: fecha es hoy y no cancelado
                    return fechaEventoStr && fechaEventoStr === hoyBolivia && reserva.estado !== "C";
                }

                if (filtroEstado === "F") {
                    // Finalizada: fecha anterior a hoy y no cancelado
                    return fechaEventoStr && fechaEventoStr < hoyBolivia && reserva.estado !== "C";
                }

                return true;
            });
        }

        // Filtro por fecha - CORREGIDO
        if (filtroFecha) {
            filtered = filtered.filter(reserva => {
                if (!reserva.fecha) return false;

                const fechaEventoStr = reserva.fecha.split('T')[0]; // YYYY-MM-DD

                switch (filtroFecha) {
                    case "hoy":
                        return fechaEventoStr === hoyBolivia;
                    
                    case "semana": {
                        // Calcular fecha de una semana después
                        const hoyDate = new Date(hoyBolivia + 'T00:00:00');
                        const semanaSiguiente = new Date(hoyDate);
                        semanaSiguiente.setDate(hoyDate.getDate() + 7);
                        const semanaSiguienteStr = semanaSiguiente.toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' });
                        
                        return fechaEventoStr >= hoyBolivia && fechaEventoStr <= semanaSiguienteStr;
                    }
                    
                    case "mes": {
                        // Calcular fecha de un mes después
                        const hoyDate = new Date(hoyBolivia + 'T00:00:00');
                        const mesSiguiente = new Date(hoyDate);
                        mesSiguiente.setMonth(hoyDate.getMonth() + 1);
                        const mesSiguienteStr = mesSiguiente.toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' });
                        
                        return fechaEventoStr >= hoyBolivia && fechaEventoStr <= mesSiguienteStr;
                    }
                    
                    case "proximas":
                        return fechaEventoStr > hoyBolivia;
                    
                    default:
                        return true;
                }
            });
        }

        console.log("Eventos después de filtrar:", filtered.length);
        return filtered;
    }, [eventos, filtro, filtroEstado, filtroTipoEvento, filtroFecha]);


    // 📄 Paginación
    const reservasArray = reservasFiltradas;
    const indiceInicio = (paginaActual - 1) * elementosPorPagina;
    const indiceFin = indiceInicio + elementosPorPagina;
    const reservasPaginadas = reservasArray.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(reservasArray.length / elementosPorPagina);

    const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
    const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

    // 📝 Acciones
    const handleEdit = (reserva: ReservaEvento) => {
        setReservaEdit(reserva);
        setIsEditModalOpen(true);
    };

    const handleDelete = (reserva: ReservaEvento) => {
        setReservaDelete(reserva);
        setIsDeleteModalOpen(true);
    };

    const handleView = (reserva: ReservaEvento) => {
        setSelectedReserva(reserva);
        setIsViewModalOpen(true);
    };

    const handleConfirmDelete = () => {
        refetch();
        setAlert({
            variant: "success",
            title: "Reserva cancelada",
            message: `La reserva de evento ha sido cancelada exitosamente.`,
        });
        setTimeout(() => setAlert(null), 3000);
    };

    const handleSaveEdit = () => {
        refetch();
        setAlert({
            variant: "success",
            title: "Reserva actualizada",
            message: "Reserva de evento actualizada correctamente.",
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
            <th>ID</th><th>Código</th><th>Cliente</th><th>Tipo Evento</th><th>Fecha</th><th>Hora Inicio</th><th>Hora Fin</th><th>Personas</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${reservasParaExportar
                .map(
                    (r) => `
                <tr>
                  <td>${r.id_reservas_evento}</td>
                  <td>EVT${r.id_reservas_evento}</td>
                  <td>${r.datos_cliente?.nombre || ''} ${r.datos_cliente?.app_paterno || ''}</td>
                  <td>${r.estado || '-'}</td>
                  <td>${r.fecha || "-"}</td>
                  <td>${r.hora_ini || "-"}</td>
                  <td>${r.hora_fin || "-"}</td>
                  <td>${r.cant_personas}</td>
                  <td>${r.estado}</td>
                </tr>`
                )
                .join("")}
        </tbody>
      </table>
    `;
        const blob = new Blob([htmlTable], { type: "application/vnd.ms-excel;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const fecha = new Date().toISOString().split("T")[0];
        link.download = `reservas_eventos_${fecha}.xls`;
        link.click();
        setAlert({
            variant: "success",
            title: "Excel exportado",
            message: `${reservasParaExportar.length} reservas de eventos exportadas.`,
        });
        setTimeout(() => setAlert(null), 3000);
    };

    // 📄 Exportar PDF
    const handleExportPDF = () => {
        const reservasParaExportar = reservasFiltradas;

        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(16);
        doc.text("REPORTE DE RESERVAS DE EVENTOS", 150, 15, { align: "center" });

        const tableData: (string | number)[][] = reservasParaExportar.map((r) => [
            r.id_reservas_evento ?? "-",
            `EVT${r.id_reservas_evento}`,
            `${r.datos_cliente?.nombre || ''} ${r.datos_cliente?.app_paterno || ''}`,
            r.estado ?? "-",
            r.fecha ?? "-",
            r.hora_ini ?? "-",
            r.hora_fin ?? "-",
            r.cant_personas ?? "-",
            r.estado ?? "-"
        ]);

        autoTable(doc, {
            head: [["ID", "Código", "Cliente", "Tipo Evento", "Fecha", "Hora Inicio", "Hora Fin", "Personas", "Estado"]],
            body: tableData,
            startY: 25,
        });

        const fecha = new Date().toISOString().split("T")[0];
        doc.save(`reservas_eventos_${fecha}.pdf`);

        setAlert({
            variant: "success",
            title: "PDF generado",
            message: `${reservasParaExportar.length} reservas de eventos exportadas.`,
        });
        setTimeout(() => setAlert(null), 3000);
    };

    return (
        <div>
            <PageMeta title="Reservas de Eventos" description="Gestión de reservas de eventos" />
            <PageBreadcrumb pageTitle="Reservas de Eventos" />

            <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 px-5 py-7 xl:px-10 xl:py-12 space-y-6">
                {/* FILTROS */}
                <ReservaEventosFilter
                    filtro={filtro}
                    setFiltro={setFiltro}
                    estado={filtroEstado}
                    setEstado={setFiltroEstado}
                    tipoEvento={filtroTipoEvento}
                    setTipoEvento={setFiltroTipoEvento}
                    fechaFiltro={filtroFecha}
                    setFechaFiltro={setFiltroFecha}
                >
                    {/* Botones de acción */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="md"
                            variant="primary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaPlus className="mr-2" /> Nuevo Evento
                        </Button>

                        <Button size="md" onClick={handleExportExcel} disabled={loading}>
                            📊 Excel
                        </Button>
                        <Button size="md" onClick={handleExportPDF} disabled={loading}>
                            📄 PDF
                        </Button>
                    </div>
                </ReservaEventosFilter>

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

                {/* Modal de CREAR NUEVO EVENTO */}
                <EventoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        refetch();
                        setAlert({
                            variant: "success",
                            title: "Reserva creada",
                            message: "Reserva de evento creada correctamente.",
                        });
                        setTimeout(() => setAlert(null), 3000);
                    }}
                />

                {/* Modal de EDITAR */}
                <EditEventoModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setReservaEdit(null);
                    }}
                    reservaData={reservaEdit}
                    onSuccess={handleSaveEdit}
                />

                {/* Modal de ELIMINAR */}
                <DeleteEventoModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setReservaDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    reservaId={reservaDelete?.id_reservas_evento || 0}
                    codigoReserva={reservaDelete ? `EVT${reservaDelete.id_reservas_evento}` : undefined}
                    tipo="evento"
                />

                {/* Modal de VER DETALLES */}
                <ViewEventoModal
                    isOpen={isViewModalOpen}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setSelectedReserva(null);
                    }}
                    reserva={selectedReserva}
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
                                Cargando reservas de eventos...
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
                                No hay reservas de eventos registradas
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
                            <ReservasEventosTable
                                reservas={reservasPaginadas}
                                onEdit={handleEdit}
                                onCancel={handleDelete}
                                onView={handleView}
                                onRefresh={refetch}
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