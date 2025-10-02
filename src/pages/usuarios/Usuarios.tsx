// src/pages/usuarios/Usuarios.tsx
import { useState, useEffect } from "react";

// Componentes comunes
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Tablas y filtros
import UsuariosTable from "../../components/tables/Usuarios/UsuariosTable";
import { Pagination } from "../../components/tables/Pagination";
import UsuariosFilter from "../../components/filters/Usuarios/UsuariosFilter";

// UI
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert";

// Modales
//import CreateUsuarioModal from "../../components/modals/Usuarios/CreateUsuarioModal";
//import EditUsuarioModal from "../../components/modals/Usuarios/EditUsuarioModal";

// Hooks
import { useModal } from "../../hooks/useModal";

// Tipos
import { Usuario } from "../../types/Usuarios/usuario";

// Excel y PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// MOCK DATA
const MOCK_USUARIOS: Usuario[] = [
    { 
        id_usuario: 1, 
        nombre: "Juan", 
        app_paterno: "Pérez", 
        app_materno: "García", 
        ci: "12345678", 
        telefono: "78945612", 
        email: "juan.perez@mail.com", 
        estado: "A", 
        rol: "administrador" 
    },
    { 
        id_usuario: 2, 
        nombre: "María", 
        app_paterno: "López", 
        app_materno: "Martínez", 
        ci: "87654321", 
        telefono: "79856234", 
        email: "maria.lopez@mail.com", 
        estado: "A", 
        rol: "empleado" 
    },
    { 
        id_usuario: 3, 
        nombre: "Carlos", 
        app_paterno: "Gómez", 
        app_materno: "Sánchez", 
        ci: "45678912", 
        telefono: "76543210", 
        email: "carlos.gomez@mail.com", 
        estado: "I", 
        rol: "empleado" 
    },
    { 
        id_usuario: 4, 
        nombre: "Ana", 
        app_paterno: "Rodríguez", 
        app_materno: "Fernández", 
        ci: "78912345", 
        telefono: "77896541", 
        email: "ana.rodriguez@mail.com", 
        estado: "A", 
        rol: "empleado" 
    },
    { 
        id_usuario: 5, 
        nombre: "Luis", 
        app_paterno: "Martínez", 
        app_materno: "Ramírez", 
        ci: "32165498", 
        telefono: "79654123", 
        email: "luis.martinez@mail.com", 
        estado: "A", 
        rol: "administrador" 
    },
    { 
        id_usuario: 6, 
        nombre: "Patricia", 
        app_paterno: "Silva", 
        app_materno: "Torres", 
        ci: "65498732", 
        telefono: "76541239", 
        email: "patricia.silva@mail.com", 
        estado: "I", 
        rol: "empleado" 
    },
    { 
        id_usuario: 7, 
        nombre: "Roberto", 
        app_paterno: "Vargas", 
        app_materno: "Castro", 
        ci: "98765432", 
        telefono: "78963214", 
        email: "roberto.vargas@mail.com", 
        estado: "A", 
        rol: "empleado" 
    },
    { 
        id_usuario: 8, 
        nombre: "Elena", 
        app_paterno: "Morales", 
        app_materno: "Díaz", 
        ci: "14785236", 
        telefono: "79632147", 
        email: "elena.morales@mail.com", 
        estado: "I", 
        rol: "empleado" 
    },
];

export default function Usuarios() {
    // Modales
    const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Estados
    const [usuarios, setUsuarios] = useState<Usuario[]>(MOCK_USUARIOS);
    const [loading, setLoading] = useState(false);
    const [usuarioEdit, setUsuarioEdit] = useState<Usuario | null>(null);

    // Mensajes de alerta
    const [alert, setAlert] = useState<{
        variant: "success" | "info" | "warning" | "error";
        title: string;
        message: string;
    } | null>(null);

    // Filtros
    const [filtro, setFiltro] = useState("");
    const [estado, setEstado] = useState<"" | "A" | "I">("");
    const [rol, setRol] = useState<"" | "administrador" | "empleado">("");

    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 7;

    // Filtrado
  const usuariosFiltrados = usuarios.filter((usuario) => {
  const nombreCompleto = `${usuario.nombre} ${usuario.app_paterno} ${usuario.app_materno}`.toLowerCase();
  const busqueda = filtro.toLowerCase();
  
  // Genera el código del usuario (igual que en tu backend)
  const iniciales = `${usuario.nombre[0]}${usuario.app_paterno[0]}${usuario.app_materno?.[0] || ''}`.toUpperCase();
  const codigo = `${iniciales}${usuario.ci}`;
  
  const matchesFiltro = 
    nombreCompleto.includes(busqueda) ||
    usuario.email.toLowerCase().includes(busqueda) ||
    usuario.ci.includes(busqueda) ||
    codigo.toLowerCase().includes(busqueda);
    
  const matchesEstado = estado === "" || usuario.estado === estado;
  const matchesRol = rol === "" || usuario.rol === rol;
  
  return matchesFiltro && matchesEstado && matchesRol;
});

    const indiceInicio = (paginaActual - 1) * elementosPorPagina;
    const indiceFin = indiceInicio + elementosPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina);

    useEffect(() => setPaginaActual(1), [filtro, estado, rol]);

    // Handlers
    const handleEdit = (usuario: Usuario) => {
        setUsuarioEdit(usuario);
        setIsEditOpen(true);
    };

    const handleToggleEstado = (usuario: Usuario) => {
        setUsuarios((prev) =>
            prev.map((u) =>
                u.id_usuario === usuario.id_usuario
                    ? { ...u, estado: u.estado === "I" ? "A" : "I" }
                    : u
            )
        );

        setAlert({
            variant: "warning",
            title: "Estado actualizado",
            message: `El usuario "${usuario.nombre} ${usuario.app_paterno}" cambió a ${usuario.estado === "I" ? "Activo" : "Inactivo"}.`,
        });

        setTimeout(() => setAlert(null), 3000);
    };

    const handleDelete = (usuario: Usuario) => {
        if (window.confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.app_paterno}?`)) {
            setUsuarios((prev) => prev.filter((u) => u.id_usuario !== usuario.id_usuario));
            
            setAlert({
                variant: "error",
                title: "Usuario eliminado",
                message: `El usuario "${usuario.nombre} ${usuario.app_paterno}" ha sido eliminado.`,
            });

            setTimeout(() => setAlert(null), 3000);
        }
    };

    const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
    const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

    // ====================== EXPORTAR EXCEL ======================
    const handleExportExcel = () => {
        const colors = {
            azulOscuro: '#1e40af',
            azulMedio: '#3b82f6',
            azulClaro: '#93c5fd',
            azulMenta: '#dbeafe',
            blanco: '#FFFFFF',
            coralSuave: '#FF9B8A',
            grisClaro: '#F8F9FA',
            grisMedio: '#E9ECEF'
        };

        const htmlTable = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
            <head>
                <meta charset="utf-8">
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 20px;
                        background-color: ${colors.blanco};
                        color: #333;
                    }
                    
                    .report-header {
                        background: ${colors.azulOscuro};
                        color: white;
                        padding: 20px;
                        border-radius: 8px 8px 0 0;
                        margin-bottom: 0;
                        border: 1px solid ${colors.azulOscuro};
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
                        background-color: ${colors.azulMenta};
                        padding: 15px;
                        border-left: 4px solid ${colors.azulMedio};
                        margin: 10px 0;
                        border-radius: 4px;
                        border: 1px solid ${colors.azulClaro};
                    }
                    
                    .info-item {
                        margin: 5px 0;
                        font-size: 12px;
                        color: #2D3748;
                    }
                    
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        border: 2px solid ${colors.azulMedio};
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    
                    thead th {
                        background: ${colors.azulMedio};
                        color: white;
                        font-weight: 600;
                        padding: 14px 12px;
                        text-align: center;
                        border: 1px solid ${colors.azulOscuro};
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
                        background-color: ${colors.azulMenta};
                    }
                    
                    tbody tr:nth-child(odd) {
                        background-color: ${colors.blanco};
                    }
                    
                    .id {
                        text-align: center;
                        font-weight: bold;
                        color: ${colors.azulOscuro};
                        background-color: ${colors.azulMenta};
                    }
                    
                    .nombre {
                        font-weight: 600;
                        color: #2D3748;
                    }
                    
                    .rol-admin {
                        background: #9333ea !important;
                        color: white;
                        font-weight: bold;
                        text-align: center;
                        border-radius: 4px;
                        padding: 6px 10px;
                        font-size: 10px;
                        text-transform: uppercase;
                    }
                    
                    .rol-empleado {
                        background: ${colors.azulMedio} !important;
                        color: white;
                        font-weight: bold;
                        text-align: center;
                        border-radius: 4px;
                        padding: 6px 10px;
                        font-size: 10px;
                        text-transform: uppercase;
                    }
                    
                    .activo {
                        background: #10b981 !important;
                        color: white;
                        font-weight: bold;
                        text-align: center;
                        border-radius: 4px;
                        padding: 6px 10px;
                        font-size: 10px;
                        text-transform: uppercase;
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
                    }
                    
                    .suspendido {
                        background: #f59e0b !important;
                        color: white;
                        font-weight: bold;
                        text-align: center;
                        border-radius: 4px;
                        padding: 6px 10px;
                        font-size: 10px;
                        text-transform: uppercase;
                    }
                    
                    .table-footer {
                        background: ${colors.azulOscuro};
                        color: white;
                        padding: 12px;
                        text-align: center;
                        font-size: 11px;
                        border-top: 2px solid ${colors.azulMedio};
                    }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <div class="report-title">GESTIÓN DE USUARIOS</div>
                    <div class="report-subtitle">Reporte del Sistema de Administración</div>
                </div>
                
                <div class="report-info">
                    <div class="info-item"><strong>Fecha de generación:</strong> ${new Date().toLocaleString('es-BO')}</div>
                    <div class="info-item"><strong>Total de registros:</strong> ${usuariosFiltrados.length} usuarios</div>
                    <div class="info-item"><strong>Filtro aplicado:</strong> ${filtro || 'Ninguno'}</div>
                    <div class="info-item"><strong>Estado:</strong> ${estado === "A" ? "Activos" : estado === "I" ? "Inactivos" : "Todos"}</div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>CI</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usuariosFiltrados.map(u => `
                            <tr>
                                <td class="id">${u.id_usuario}</td>
                                <td class="nombre">${u.nombre} ${u.app_paterno} ${u.app_materno}</td>
                                <td>${u.ci}</td>
                                <td>${u.email}</td>
                                <td>${u.telefono || '-'}</td>
                                <td class="${u.rol === 'administrador' ? 'rol-admin' : 'rol-empleado'}">
                                    ${u.rol.charAt(0).toUpperCase() + u.rol.slice(1)}
                                </td>
                                <td class="${u.estado === 'A' ? 'activo' : u.estado === 'I' ? 'suspendido' : 'inactivo'}">
                                    ${u.estado === 'A' ? 'Activo' : u.estado === 'I' ? 'Suspendido' : 'Inactivo'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="7" class="table-footer">
                                Generado el ${new Date().toLocaleDateString('es-BO')} • ${usuariosFiltrados.length} registros encontrados
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
        link.download = `usuarios_${fecha}.xls`;
        link.click();
        
        URL.revokeObjectURL(url);

        setAlert({
            variant: "success",
            title: "✅ Exportación exitosa",
            message: `Se exportaron ${usuariosFiltrados.length} registros a Excel.`,
        });

        setTimeout(() => setAlert(null), 3000);
    };

    // ====================== EXPORTAR PDF ======================
    const handleExportPDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const colors = {
            azulOscuro: [30, 64, 175],
            azulMedio: [59, 130, 246],
            azulClaro: [147, 197, 253],
            azulMenta: [219, 234, 254],
            blanco: [255, 255, 255],
        };

        // Header
        doc.setFillColor(colors.azulOscuro[0], colors.azulOscuro[1], colors.azulOscuro[2]);
        doc.rect(0, 0, 297, 35, 'F');

        doc.setFontSize(20);
        doc.setTextColor(colors.blanco[0], colors.blanco[1], colors.blanco[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('GESTIÓN DE USUARIOS', 148.5, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.text('Reporte del Sistema de Administración', 148.5, 22, { align: 'center' });

        const fechaHora = new Date().toLocaleString('es-BO');
        doc.setFontSize(8);
        doc.text(`Generado: ${fechaHora}`, 148.5, 28, { align: 'center' });

        // Información
        const startY = 45;
        doc.setFillColor(colors.azulMenta[0], colors.azulMenta[1], colors.azulMenta[2]);
        doc.roundedRect(14, startY, 270, 15, 3, 3, 'F');
        
        doc.setDrawColor(colors.azulMedio[0], colors.azulMedio[1], colors.azulMedio[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(14, startY, 270, 15, 3, 3, 'S');

        doc.setFontSize(9);
        doc.setTextColor(colors.azulOscuro[0], colors.azulOscuro[1], colors.azulOscuro[2]);
        doc.setFont('helvetica', 'bold');
        
        doc.text(`Total: ${usuariosFiltrados.length} usuarios`, 20, startY + 8);
        doc.text(`Filtro: ${filtro || 'Ninguno'}`, 80, startY + 8);
        doc.text(`Estado: ${estado === "A" ? "Activos" : estado === "I" ? "Inactivos" : "Todos"}`, 140, startY + 8);

        // Tabla
        const tableData = usuariosFiltrados.map((u, index) => [
            (index + 1).toString(),
            `${u.nombre} ${u.app_paterno} ${u.app_materno}`,
            u.ci,
            u.email,
            u.telefono || '-',
            u.rol.charAt(0).toUpperCase() + u.rol.slice(1),
            u.estado === "A" ? "Activo" : u.estado === "I" ? "Suspendido" : "Inactivo"
        ]);

        autoTable(doc, {
            head: [['N°', 'Nombre Completo', 'CI', 'Email', 'Teléfono', 'Rol', 'Estado']],
            body: tableData,
            startY: startY + 25,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 3,
                valign: 'middle',
                halign: 'center',
            },
            headStyles: {
                fontStyle: 'bold',
                fontSize: 9,
                halign: 'center',
                cellPadding: 4,
            },
            columnStyles: {
                0: { cellWidth: 12, halign: 'center' },
                1: { cellWidth: 50, halign: 'left', fontStyle: 'bold' },
                2: { cellWidth: 25, halign: 'center' },
                3: { cellWidth: 50, halign: 'left' },
                4: { cellWidth: 25, halign: 'center' },
                5: { cellWidth: 28, halign: 'center' },
                6: { cellWidth: 25, halign: 'center' },
            },
            margin: { top: startY + 25, left: 14, right: 14 },
        });

        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFillColor(colors.azulOscuro[0], colors.azulOscuro[1], colors.azulOscuro[2]);
            doc.rect(0, 200, 297, 10, 'F');
            
            doc.setFontSize(8);
            doc.setTextColor(colors.blanco[0], colors.blanco[1], colors.blanco[2]);
            doc.text('Sistema de Gestión de Usuarios', 148.5, 205, { align: 'center' });
        }

        const fecha = new Date().toISOString().split('T')[0];
        doc.save(`usuarios_${fecha}.pdf`);

        setAlert({
            variant: "success",
            title: "✅ PDF generado",
            message: `Se exportaron ${usuariosFiltrados.length} registros a PDF.`,
        });

        setTimeout(() => setAlert(null), 3000);
    };

    // ====================== REFRESH ======================
    const refetch = (type: "created" | "edited") => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setAlert(
                type === "created"
                    ? {
                        variant: "success",
                        title: "¡Éxito!",
                        message: "El usuario fue creado correctamente.",
                    }
                    : {
                        variant: "info",
                        title: "Actualizado",
                        message: "El usuario fue editado correctamente.",
                    }
            );
            setTimeout(() => setAlert(null), 3000);
        }, 500);
    };

    return (
        <div>
            <PageMeta title="Gestión de Usuarios" description="Página de gestión de usuarios del sistema" />
            <PageBreadcrumb pageTitle="Usuarios" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-6">
                {alert && (
                    <Alert
                        variant={alert.variant}
                        title={alert.title}
                        message={alert.message}
                    />
                )}

                    <UsuariosFilter filtro={filtro} setFiltro={setFiltro} estado={estado} setEstado={setEstado} rol={rol} setRol={setRol}>
                        <div className="flex flex-wrap gap-2">
                            <Button size="md" variant="outline" onClick={handleExportExcel}>
                                📊 Excel
                            </Button>
                            <Button size="md" variant="outline" onClick={handleExportPDF}>
                                📄 PDF
                            </Button>
                            <Button size="md" variant="primary" onClick={openCreateModal}>
                                ➕ Nuevo Usuario
                            </Button>
                        </div>
                    </UsuariosFilter>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando <span className="font-semibold text-[#3b82f6] dark:text-[#93c5fd]">{usuariosFiltrados.length}</span> de{" "}
                    <span className="font-semibold">{usuarios.length}</span> usuarios
                </div>

                <div className="max-w-full space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3b82f6] mb-4"></div>
                            <p className="text-center text-gray-500 dark:text-gray-400">
                                Cargando usuarios...
                            </p>
                        </div>
                    ) : usuariosFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#dbeafe] dark:bg-[#3b82f6]/20 mb-4">
                                <svg className="w-8 h-8 text-[#3b82f6] dark:text-[#93c5fd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                No hay usuarios que coincidan con el filtro
                            </p>
                        </div>
                    ) : (
                        <>
                            <UsuariosTable
                                usuarios={usuariosPaginados}
                                onEdit={handleEdit}
                                onToggleEstado={handleToggleEstado}
                                onDelete={handleDelete}
                            />
                            <Pagination paginaActual={paginaActual} totalPaginas={totalPaginas} onPrev={onPrev} onNext={onNext} />
                        </>
                    )}
                </div>
            </div>

           
        
        </div>
    );
}