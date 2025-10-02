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

// Tipos
import { ServicioAdicional } from "../../../types/Bienes/Servicios/servicio";

// Excel y PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// MOCK DATA - Actualizado con campo tipo
const MOCK_SERVICIOS: ServicioAdicional[] = [
    { id_servicios_adicionales: 1, nombre: "Limpieza Premium", descripcion: "Servicio completo", precio: 150.0, tipo: "E", estado: "A" },
    { id_servicios_adicionales: 2, nombre: "Mantenimiento Express", descripcion: "Revisión rápida", precio: 250.5, tipo: "E", estado: "A" },
    { id_servicios_adicionales: 3, nombre: "Cambio de Aceite", descripcion: "Aceite sintético", precio: 180.0, tipo: "A", estado: "A" },
    { id_servicios_adicionales: 4, nombre: "Lavado Simple", descripcion: "Lavado exterior", precio: 50.0, tipo: "X", estado: "I" },
    { id_servicios_adicionales: 5, nombre: "Pulido de Carrocería", descripcion: "Pulido profesional", precio: 350.0, tipo: "A", estado: "A" },
    { id_servicios_adicionales: 6, nombre: "Inspección Técnica", descripcion: "Revisión completa", precio: 200.0, tipo: "X", estado: "A" },
    { id_servicios_adicionales: 7, nombre: "Cambio de Llantas", descripcion: "Instalación de neumáticos", precio: 100.0, tipo: "E", estado: "I" },
    { id_servicios_adicionales: 8, nombre: "Alineación y Balanceo", descripcion: "Alineación computarizada", precio: 120.0, tipo: "A", estado: "A" },
];

export default function ServiciosAdicionalesPage() {
    // Modales
    const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Estados
    const [servicios, setServicios] = useState<ServicioAdicional[]>(MOCK_SERVICIOS);
    const [loading, setLoading] = useState(false);
    const [servicioEdit, setServicioEdit] = useState<ServicioAdicional | null>(null);

    // Mensajes de alerta
    const [alert, setAlert] = useState<{
        variant: "success" | "info" | "warning" | "error";
        title: string;
        message: string;
    } | null>(null);

    // Filtros
    const [filtro, setFiltro] = useState("");
    const [tipo, setTipo] = useState<"" | "E" | "A" | "X">("");  // ⬅️ AGREGA ESTA LÍNEA
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

    // Filtrado - Actualizado para incluir tipo completo
    const serviciosFiltrados = servicios.filter((servicio) => {
        const tipoCompleto = getTipoNombre(servicio.tipo);
        const matchesFiltro = `${servicio.nombre} ${servicio.descripcion || ""} ${tipoCompleto}`.toLowerCase().includes(filtro.toLowerCase());
        const matchesEstado = estado === "" || servicio.estado === estado;
        return matchesFiltro && matchesEstado;
    });

    const indiceInicio = (paginaActual - 1) * elementosPorPagina;
    const indiceFin = indiceInicio + elementosPorPagina;
    const serviciosPaginados = serviciosFiltrados.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(serviciosFiltrados.length / elementosPorPagina);

    useEffect(() => setPaginaActual(1), [filtro, estado]);

    // Handlers
    const handleEdit = (servicio: ServicioAdicional) => {
        setServicioEdit(servicio);
        setIsEditOpen(true);
    };

    const handleToggleEstado = (servicio: ServicioAdicional) => {
        setServicios((prev) =>
            prev.map((s) =>
                s.id_servicios_adicionales === servicio.id_servicios_adicionales
                    ? { ...s, estado: s.estado === "I" ? "A" : "I" }
                    : s
            )
        );

        setAlert({
            variant: "warning",
            title: "Estado actualizado",
            message: `El servicio "${servicio.nombre}" cambió a ${servicio.estado === "I" ? "Activo" : "Inactivo"}.`,
        });

        setTimeout(() => setAlert(null), 3000);
    };

    const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
    const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

    // ====================== EXPORTAR EXCEL CON CAMPO TIPO ======================
    const handleExportExcel = () => {
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

        const htmlTable = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
            <head>
                <meta charset="utf-8">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>Servicios Adicionales</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                    <x:DisplayRowColHeaders/>
                                    <x:ActivePane>2</x:ActivePane>
                                    <x:FreezePanes/>
                                    <x:FrozenNoSplit/>
                                    <x:SplitHorizontal>1</x:SplitHorizontal>
                                    <x:TopRowBottomPane>1</x:TopRowBottomPane>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 20px;
                        background-color: ${colors.blanco};
                        color: #333;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .report-header {
                        background: ${colors.verdeOscuro};
                        color: white;
                        padding: 20px;
                        border-radius: 8px 8px 0 0;
                        margin-bottom: 0;
                        border: 1px solid ${colors.verdeOscuro};
                        width: 95%;
                        max-width: 1200px;
                    }
                    
                    .report-title {
                        font-size: 22px;
                        font-weight: bold;
                        margin: 0 0 5px 0;
                    }
                    
                    .report-subtitle {
                        font-size: 13px;
                        opacity: 0.9;
                        margin: 0;
                    }
                    
                    .report-info {
                        background-color: ${colors.verdeMenta};
                        padding: 15px;
                        border-left: 4px solid ${colors.verdeMedio};
                        margin: 10px 0;
                        border-radius: 4px;
                        border: 1px solid ${colors.verdeClaro};
                        width: 95%;
                        max-width: 1200px;
                    }
                    
                    .info-item {
                        margin: 5px 0;
                        font-size: 12px;
                        color: #2D3748;
                    }
                    
                    table {
                        border-collapse: collapse;
                        width: 95%;
                        max-width: 1200px;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        border: 2px solid ${colors.verdeMedio};
                        border-radius: 8px;
                        overflow: hidden;
                        margin: 0 auto;
                    }
                    
                    thead th {
                        background: ${colors.verdeMedio};
                        color: white;
                        font-weight: 600;
                        padding: 14px 12px;
                        text-align: center;
                        border: 1px solid ${colors.verdeOscuro};
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    tbody td {
                        padding: 12px 10px;
                        border: 1px solid ${colors.grisMedio};
                        font-size: 11px;
                        background-color: ${colors.blanco};
                    }
                    
                    tbody tr:nth-child(even) {
                        background-color: ${colors.verdeMenta};
                    }
                    
                    tbody tr:nth-child(odd) {
                        background-color: ${colors.blanco};
                    }
                    
                    tbody tr:hover {
                        background-color: ${colors.verdeClaro}40;
                    }
                    
                    .id {
                        text-align: center;
                        font-weight: bold;
                        color: ${colors.verdeOscuro};
                        background-color: ${colors.verdeMenta};
                        border-right: 2px solid ${colors.verdeClaro};
                    }
                    
                    .nombre {
                        font-weight: 600;
                        color: #2D3748;
                        border-left: 2px solid ${colors.verdeClaro};
                    }
                    
                    .tipo {
                        color: #4A5568;
                        font-weight: 500;
                        text-align: center;
                        background-color: ${colors.verdeMenta};
                    }
                    
                    .descripcion {
                        color: #4A5568;
                        font-style: normal;
                    }
                    
                    .precio {
                        color: ${colors.verdeOscuro};
                        font-weight: bold;
                        text-align: right;
                        font-size: 11px;
                        background-color: ${colors.verdeMenta};
                        border-left: 2px solid ${colors.verdeClaro};
                    }
                    
                    .activo {
                        background: ${colors.verdeMedio} !important;
                        color: white;
                        font-weight: bold;
                        text-align: center;
                        border-radius: 4px;
                        padding: 6px 10px;
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border: 1px solid ${colors.verdeOscuro};
                    }
                    
                    .inactivo {
                        background: ${colors.coralSuave} !important;
                        color: white;
                        font-weight: bold;
                        text-align: center;
                        border-radius: 4px;
                        padding: 6px 10px;
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border: 1px solid #E53E3E;
                    }
                    
                    .table-footer {
                        background: ${colors.verdeOscuro};
                        color: white;
                        padding: 12px;
                        text-align: center;
                        font-size: 11px;
                        border-top: 2px solid ${colors.verdeMedio};
                    }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <div class="report-title">SERVICIOS ADICIONALES</div>
                    <div class="report-subtitle">Reporte del Sistema de Gestión</div>
                </div>
                
                <div class="report-info">
                    <div class="info-item"><strong>Fecha de generación:</strong> ${new Date().toLocaleString('es-BO')}</div>
                    <div class="info-item"><strong>Total de registros:</strong> ${serviciosFiltrados.length} servicios</div>
                    <div class="info-item"><strong>Filtro aplicado:</strong> ${filtro || 'Ninguno'}</div>
                    <div class="info-item"><strong>Estado:</strong> ${estado === "A" ? "Activos" : estado === "I" ? "Inactivos" : "Todos"}</div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre del Servicio</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Precio (Bs.)</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${serviciosFiltrados.map(s => {
            const tipoNombre = s.tipo === 'E' ? 'Establecimiento' : s.tipo === 'A' ? 'Alimentación' : s.tipo === 'X' ? 'Extra' : 'N/A';
            return `
                            <tr>
                                <td class="id">${s.id_servicios_adicionales}</td>
                                <td class="nombre">${s.nombre}</td>
                                <td class="tipo">${tipoNombre}</td>
                                <td class="descripcion">${s.descripcion || "Sin descripción"}</td>
                                <td class="precio">Bs. ${s.precio.toFixed(2)}</td>
                                <td class="${s.estado === 'A' ? 'activo' : 'inactivo'}">
                                    ${s.estado === 'A' ? 'Activo' : 'Inactivo'}
                                </td>
                            </tr>
                        `;
        }).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="6" class="table-footer">
                                Generado el ${new Date().toLocaleDateString('es-BO')} • ${serviciosFiltrados.length} registros encontrados
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([htmlTable], {
            type: 'application/vnd.ms-excel;charset=utf-8;'
        });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const fecha = new Date().toISOString().split('T')[0];

        link.href = url;
        link.download = `servicios_adicionales_${fecha}.xls`;
        link.click();

        URL.revokeObjectURL(url);

        setAlert({
            variant: "success",
            title: "✅ Exportación exitosa",
            message: `Se exportaron ${serviciosFiltrados.length} registros a Excel con diseño mejorado.`,
        });

        setTimeout(() => setAlert(null), 3000);
    };

    // ====================== EXPORTAR PDF CON CAMPO TIPO ======================
    const handleExportPDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const colors = {
            verdeOscuro: [14, 124, 123],
            verdeMedio: [42, 157, 143],
            verdeClaro: [153, 216, 205],
            verdeMenta: [232, 244, 242],
            blanco: [255, 255, 255],
            coralSuave: [255, 155, 138],
            grisClaro: [248, 249, 250]
        };

        // HEADER
        doc.setFillColor(colors.verdeOscuro[0], colors.verdeOscuro[1], colors.verdeOscuro[2]);
        doc.rect(0, 0, 297, 35, 'F');

        doc.setFontSize(20);
        doc.setTextColor(colors.blanco[0], colors.blanco[1], colors.blanco[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('SERVICIOS ADICIONALES', 148.5, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(colors.blanco[0], colors.blanco[1], colors.blanco[2]);
        doc.setFont('helvetica', 'normal');
        doc.text('Reporte del Sistema de Gestión', 148.5, 22, { align: 'center' });

        const fechaHora = new Date().toLocaleString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        doc.setFontSize(8);
        doc.setTextColor(colors.blanco[0], colors.blanco[1], colors.blanco[2]);
        doc.text(`Generado: ${fechaHora}`, 148.5, 28, { align: 'center' });

        // INFORMACIÓN DE RESUMEN
        const startY = 45;

        doc.setFillColor(colors.verdeMenta[0], colors.verdeMenta[1], colors.verdeMenta[2]);
        doc.roundedRect(14, startY, 270, 15, 3, 3, 'F');

        doc.setDrawColor(colors.verdeMedio[0], colors.verdeMedio[1], colors.verdeMedio[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(14, startY, 270, 15, 3, 3, 'S');

        doc.setFontSize(9);
        doc.setTextColor(colors.verdeOscuro[0], colors.verdeOscuro[1], colors.verdeOscuro[2]);
        doc.setFont('helvetica', 'bold');

        doc.text(`Total: ${serviciosFiltrados.length} servicios`, 20, startY + 8);
        doc.text(`Filtro: ${filtro || 'Ninguno'}`, 80, startY + 8);
        doc.text(`Estado: ${estado === "A" ? "Activos" : estado === "I" ? "Inactivos" : "Todos"}`, 140, startY + 8);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-BO')}`, 200, startY + 8);

        // TABLA CON TIPO
        const tableData = serviciosFiltrados.map((s, index) => {
            const tipoNombre = s.tipo === 'E' ? 'Establecimiento' : s.tipo === 'A' ? 'Alimentación' : s.tipo === 'X' ? 'Extra' : 'N/A';
            return [
                (index + 1).toString(),
                s.nombre,
                tipoNombre,
                s.descripcion || "Sin descripción",
                `Bs. ${s.precio.toFixed(2)}`,
                s.estado === "A" ? "Activo" : "Inactivo"
            ];
        });

        autoTable(doc, {
            head: [['N°', 'Nombre del Servicio', 'Tipo', 'Descripción', 'Precio', 'Estado']],
            body: tableData,
            startY: startY + 25,
            theme: 'grid',
            styles: {
                fontSize: 9,
                cellPadding: 4,
                valign: 'middle',
                halign: 'center',
                lineWidth: 0.2,
                font: 'helvetica',
            },
            headStyles: {
                fontStyle: 'bold',
                fontSize: 10,
                halign: 'center',
                cellPadding: 5,
            },
            columnStyles: {
                0: {
                    cellWidth: 12,
                    halign: 'center',
                },
                1: {
                    cellWidth: 50,
                    halign: 'left',
                    fontStyle: 'bold',
                },
                2: {
                    cellWidth: 35,
                    halign: 'center',
                    fontStyle: 'normal',
                },
                3: {
                    cellWidth: 85,
                    halign: 'left',
                },
                4: {
                    cellWidth: 28,
                    halign: 'right',
                    fontStyle: 'bold',
                },
                5: {
                    cellWidth: 22,
                    halign: 'center',
                },
            },
            alternateRowStyles: {},
            didParseCell: function (data) {
                if (data.column.index === 5 && data.section === 'body') {
                    data.cell.styles.fontStyle = 'bold';
                }

                if (data.column.index === 0 && data.section === 'body') {
                    data.cell.styles.fontStyle = 'bold';
                }
            },
            margin: { top: startY + 25, left: 14, right: 14 },
        });

        // FOOTER
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            doc.setFillColor(colors.verdeOscuro[0], colors.verdeOscuro[1], colors.verdeOscuro[2]);
            doc.rect(0, 200, 297, 10, 'F');

            doc.setFontSize(8);
            doc.setTextColor(colors.blanco[0], colors.blanco[1], colors.blanco[2]);
            doc.text(
                'Sistema de Gestión de Servicios Adicionales',
                148.5,
                205,
                { align: 'center' }
            );
        }

        const fecha = new Date().toISOString().split('T')[0];
        doc.save(`servicios_adicionales_${fecha}.pdf`);

        setAlert({
            variant: "success",
            title: "✅ PDF generado",
            message: `Se exportaron ${serviciosFiltrados.length} registros a PDF.`,
        });

        setTimeout(() => setAlert(null), 3000);
    };

    // REFRESH
    const refetch = (type: "created" | "edited") => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setAlert(
                type === "created"
                    ? {
                        variant: "success",
                        title: "¡Éxito!",
                        message: "El servicio fue creado correctamente.",
                    }
                    : {
                        variant: "info",
                        title: "Actualizado",
                        message: "El servicio fue editado correctamente.",
                    }
            );
            setTimeout(() => setAlert(null), 3000);
        }, 500);
    };

    return (
        <div>
            <PageMeta title="Servicios Adicionales" description="Página de gestión de servicios adicionales" />
            <PageBreadcrumb pageTitle="Servicios Adicionales" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-6">
                {alert && (
                    <Alert
                        variant={alert.variant}
                        title={alert.title}
                        message={alert.message}
                    />
                )}

                <ServiciosFilter
                    filtro={filtro}
                    setFiltro={setFiltro}
                    tipo={tipo}
                    setTipo={setTipo}
                    estado={estado}
                    setEstado={setEstado}
                >
                    <div className="flex flex-wrap gap-2">
                        <Button size="md" variant="outline" onClick={handleExportExcel}>
                            📊 Excel
                        </Button>
                        <Button size="md" variant="outline" onClick={handleExportPDF}>
                            📄 PDF
                        </Button>
                        <Button size="md" variant="primary" onClick={openCreateModal}>
                            ➕ Nuevo Servicio
                        </Button>
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
                            <p className="text-center text-gray-500 dark:text-gray-400">
                                Cargando servicios...
                            </p>
                        </div>
                    ) : serviciosFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e2e8f6] dark:bg-[#458890]/20 mb-4">
                                <svg className="w-8 h-8 text-[#26a5b9] dark:text-[#99d8cd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                No hay servicios que coincidan con el filtro
                            </p>
                        </div>
                    ) : (
                        <>
                            <ServiciosTable
                                servicios={serviciosPaginados}
                                onEdit={handleEdit}
                                onToggleEstado={handleToggleEstado}
                            />
                            <Pagination paginaActual={paginaActual} totalPaginas={totalPaginas} onPrev={onPrev} onNext={onNext} />
                        </>
                    )}
                </div>
            </div>

            <CreateServicioModal isOpen={isCreateOpen} onClose={closeCreateModal} onCreated={() => refetch("created")} />
            {servicioEdit && (
                <EditServicioModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    servicio={servicioEdit}
                    onEdited={() => refetch("edited")}
                />
            )}
        </div>
    );
}