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

export default function Usuarios() {

    const { openModal, isOpen, closeModal } = useModal();
    const { usuarios, loading, error, addUsuario } = useUsuarios();


    // Estado para edición
    const [usuarioEdit, setUsuarioEdit] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Función para abrir el modal de edición con el usuario seleccionado
    const handleEdit = (usuario: Usuario) => {
        setIsEditOpen(true);
        console.log("Editando usuario:", usuario);
        // Aquí podrías guardar el usuario en un estado para pasarlo al modal
        // setUsuarioSeleccionado(usuario);
    };


    // ---------- Filtro de texto y estado ----------
    const [filtro, setFiltro] = useState("");
    const [estado, setEstado] = useState<"" | "A" | "I">("");
    const [rol, setRol] = useState<"" | "administrador" | "empleado">("");


    // ------------- Paginación ------------
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 6;

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
    }, [filtro, estado]);

    // Cambios de página
    const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
    const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));


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
                    <Button size="md" variant="primary" onClick={openModal}>
                        <FaPlus className="size-3" />
                        Nuevo Usuario
                    </Button>
                </UsuariosFilter>

                {/* === Tabla === */}
                <div className="max-w-full space-y-6">
                    {loading ? (
                        <p className="text-center text-gray-500">Cargando...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : usuariosFiltrados.length === 0 ? (
                        <p className="text-center text-gray-500">No hay usuarios.</p>
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
        </div>
    );
}
