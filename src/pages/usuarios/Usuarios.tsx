import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import UsuarioTable from "../../components/ui/table/Usuarios/UsuariosTable";
import { Pagination } from "../../components/tables/Pagination";
import { useUsuarios } from "../../hooks/Usuario/useUsuarios";
import Button from "../../components/ui/button/Button";
import { FaPlus } from "react-icons/fa";
import { useModal } from "../../hooks/useModal";
import { Usuario } from "../../types/Usuarios/usuario";
import UsuariosFilter from "../../components/filters/Usuarios/UsuariosFilter";
import UsuarioModal from "../../components/modals/Usuarios/UsuarioModal";
import EditUsuarioModal from "../../components/modals/Usuarios/EditUsuarioModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Alert from "../../components/ui/alert/Alert";

export default function Usuarios() {

    const { openModal, isOpen, closeModal } = useModal();
    const { usuarios, loading, error, addUsuario, editarUsuario } = useUsuarios();

    // Estado para edición
    const [usuarioEdit, setUsuarioEdit] = useState<Usuario | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Función para abrir el modal de edición con el usuario seleccionado
    const handleEdit = (usuario: Usuario) => {
        setUsuarioEdit(usuario);
        setIsEditOpen(true);
    };
    
    const handleUpdate = async (updatedData: Partial<Usuario>) => {
        if (usuarioEdit) {
            await editarUsuario(usuarioEdit.id_usuario, updatedData);
            setIsEditOpen(false);
            setUsuarioEdit(null);
        }
    };

    // ---------- Filtro de texto y estado ----------
    const [filtro, setFiltro] = useState("");
    const [estado, setEstado] = useState<"" | "A" | "I">("");
    const [rol, setRol] = useState<"" | "administrador" | "empleado">("");

    // ------------- Paginación ------------
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 6;

    // ------------- Alertas ------------
    const [alert, setAlert] = useState<{
        variant: "success" | "info" | "warning" | "error";
        title: string;
        message: string;
    } | null>(null);

    // ------------- Colores ------------
    const colors = {
        azulOscuro: '#1e40af',
        azulMedio: '#26a5b9',
        azulClaro: '#99d8cd',
        azulMenta: '#e2e8f6',
        blanco: '#FFFFFF',
        coralSuave: '#FF9B8A',
        grisClaro: '#F8F9FA',
        grisMedio: '#E9ECEF'
    };

    // -------------- Filtrado -------------
    const usuariosFiltrados = (usuarios ?? [])
        .filter((usuario) =>
            `${usuario.nombre} ${usuario.app_paterno} ${usuario.app_materno} ${usuario.ci} ${usuario.telefono} ${usuario.email}`
                .toLowerCase()
                .includes(filtro.toLowerCase())
        )
        .filter((usuario) =>
            estado === "A"
                ? usuario.estado === "A"
                : estado === "I"
                ? usuario.estado === "I"
                : true
        )
        .filter((usuario) =>
            rol === "administrador"
                ? usuario.rol === "administrador"
                : rol === "empleado"
                ? usuario.rol === "empleado"
                : true
        );

    // ------------- Paginación -----------
    const indiceInicio = (paginaActual - 1) * elementosPorPagina;
    const indiceFin = indiceInicio + elementosPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina);

    // Reiniciar a la primera página al cambiar el filtro
    useEffect(() => {
        setPaginaActual(1);
    }, [filtro, estado, rol]);

    // Cambios de página
    const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
    const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

    // ====================== EXPORTAR EXCEL ======================
    const handleExportExcel = () => {
        const htmlTable = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; margin: 20px; background-color: ${colors.blanco}; }
                        table { border-collapse: collapse; width: 95%; max-width: 1400px; margin: 0 auto; border: 2px solid ${colors.azulMedio}; border-radius: 8px; overflow: hidden; }
                        thead th { background: ${colors.azulMedio}; color: white; padding: 12px; border: 1px solid ${colors.azulOscuro}; text-align: center; }
                        tbody td { padding: 10px; border: 1px solid ${colors.grisMedio}; text-align: center; }
                        tbody tr:nth-child(even) { background-color: ${colors.azulMenta}; }
                        tbody tr:nth-child(odd) { background-color: ${colors.blanco}; }
                        .activo { background: ${colors.azulMedio}; color: white; font-weight: bold; }
                        .inactivo { background: ${colors.coralSuave}; color: white; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h2 style="text-align:center;color:${colors.azulOscuro}">REPORTE DE USUARIOS</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre Completo</th>
                                <th>CI</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${usuariosFiltrados.map(u => `
                                <tr>
                                    <td>${u.id_usuario}</td>
                                    <td>${u.nombre} ${u.app_paterno} ${u.app_materno || ''}</td>
                                    <td>${u.ci}</td>
                                    <td>${u.telefono}</td>
                                    <td>${u.email || '-'}</td>
                                    <td>${u.rol === 'administrador' ? 'Administrador' : 'Empleado'}</td>
                                    <td class="${u.estado === "A" ? 'activo' : 'inactivo'}">${u.estado === "A" ? "Activo" : "Inactivo"}</td>
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
        link.download = `usuarios_${fecha}.xls`;
        link.click();
        URL.revokeObjectURL(url);

        setAlert({ variant: "success", title: "✅ Exportación Excel", message: `Se exportaron ${usuariosFiltrados.length} registros.` });
        setTimeout(() => setAlert(null), 3000);
    };

    // ====================== EXPORTAR PDF ======================
    const handleExportPDF = () => {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        // HEADER
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, 297, 30, 'F');
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text('REPORTE DE USUARIOS', 148.5, 15, { align: 'center' });

        const tableData = usuariosFiltrados.map((u, i) => [
            i + 1,
            `${u.nombre} ${u.app_paterno} ${u.app_materno || ''}`,
            u.ci,
            u.telefono,
            u.email || '-',
            u.rol === 'administrador' ? 'Administrador' : 'Empleado',
            u.estado === "A" ? "Activo" : "Inactivo"
        ]);

        autoTable(doc, {
            head: [['#', 'Nombre Completo', 'CI', 'Teléfono', 'Correo', 'Rol', 'Estado']],
            body: tableData,
            startY: 35,
            theme: 'grid',
            styles: { fontSize: 9, halign: 'center', valign: 'middle' },
            headStyles: { fillColor: [38, 165, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
        });

        const fecha = new Date().toISOString().split('T')[0];
        doc.save(`usuarios_${fecha}.pdf`);

        setAlert({ variant: "success", title: "✅ PDF generado", message: `Se exportaron ${usuariosFiltrados.length} registros.` });
        setTimeout(() => setAlert(null), 3000);
    };

    return (
        <div>
            <PageMeta title="Usuarios" description="Página de gestión de usuarios" />
            <PageBreadcrumb pageTitle="Usuarios" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-10">
                <UsuariosFilter
                    filtro={filtro}
                    setFiltro={setFiltro}
                    estado={estado}
                    setEstado={setEstado}
                    rol={rol}
                    setRol={setRol}
                >
                    <div className="flex flex-wrap gap-2">
                        <Button size="md" variant="primary" onClick={openModal}>
                            <FaPlus className="size-3 mr-2" />
                            Nuevo Usuario
                        </Button>
                        <Button size="md" onClick={handleExportExcel}>📊 Excel</Button>
                        <Button size="md" onClick={handleExportPDF}>📄 PDF</Button>
                    </div>
                </UsuariosFilter>

                {/* Alerta */}
                {alert && (
                    <Alert variant={alert.variant} title={alert.title} message={alert.message} />
                )}

                {/* Contador de registros */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando <span className="font-semibold text-[#26a5b9] dark:text-[#99d8cd]">{usuariosFiltrados.length}</span> de{" "}
                    <span className="font-semibold">{usuarios?.length}</span> usuarios
                </div>

                {/* === Tabla === */}
                <div className="max-w-full space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                                style={{ borderTopColor: colors.azulMedio, borderBottomColor: colors.azulOscuro }}
                            ></div>
                            <p className="text-center text-gray-500 dark:text-gray-400 mt-3">Cargando usuarios...</p>
                        </div>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : usuariosFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e2e8f6] dark:bg-[#458890]/20 mb-4">
                                <svg
                                    className="w-8 h-8 text-[#26a5b9] dark:text-[#99d8cd]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                No hay usuarios que coincidan con el filtro
                            </p>
                        </div>
                    ) : (
                        <>
                            <UsuarioTable usuarios={usuariosPaginados} onEdit={handleEdit} />
                            <Pagination
                                paginaActual={paginaActual}
                                totalPaginas={totalPaginas}
                                onPrev={onPrev}
                                onNext={onNext}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* === Modal para nuevo usuario === */}
            <UsuarioModal
                isOpen={isOpen}
                onClose={closeModal}
                onSubmit={addUsuario}
            />

            {/* Modal de Editar */}
            {isEditOpen && usuarioEdit && (
                <EditUsuarioModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSubmit={(data) => editarUsuario(usuarioEdit.id_usuario, data)}
                    usuario={usuarioEdit}
                />
            )}

        </div>
    );
}