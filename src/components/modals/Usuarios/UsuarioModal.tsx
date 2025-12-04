import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { Usuario } from "../../../types/Usuarios/usuario";
import Alert from "../../ui/alert/Alert";

// Importa tus validaciones
import { 
    validarLongitud,   
    validarNombreHospedaje, 
    validarTelefonoHospedaje,
    validarEmailHospedaje, 
    validarRepeticionCaracteres,
    validarCarnetHospedaje,
    validarApellidos,
} from "../../utils/validaciones";

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (usuario: Usuario) => Promise<void>;
}

export default function UsuarioModal({ isOpen, onClose, onSubmit }: UsuarioModalProps) {
  const [formData, setFormData] = useState<Partial<Usuario>>({
    nombre: "",
    app_paterno: "",
    app_materno: "",
    ci: "",
    telefono: "",
    email: "",
    password: "12345678",
    rol: "empleado",
    estado: "A",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPending, setIsPending] = useState(false);
  const [alert, setAlert] = useState<{ variant: "success" | "error"; message: string } | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validar el campo en tiempo real si ya fue tocado
    if (touched[name]) {
      validarCampo(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validarCampo(name, value);
  };

  const validarCampo = (campo: string, valor: any) => {
    let error = null;

    switch (campo) {
      case "nombre":
        error = validarNombreHospedaje(valor || "");
        break;
      case "app_paterno":
        const { paterno } = validarApellidos(valor || "", formData.app_materno || "");
        error = paterno;
        break;
      case "app_materno":
        const { materno } = validarApellidos(formData.app_paterno || "", valor || "");
        error = materno;
        break;
      case "ci":
        error = validarCarnetHospedaje(valor || "");
        break;
      case "telefono":
        error = validarTelefonoHospedaje(valor || "");
        break;
      case "email":
        error = validarEmailHospedaje(valor || "");
        break;
      case "password":
        error = validarLongitud(valor || "", 6, 20, "La contraseña");
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [campo]: error || "",
    }));
  };

  const validarFormulario = () => {
    const errores: Record<string, string> = {};
    
    // Nombre
    const errorNombre = validarNombreHospedaje(formData.nombre || "");
    if (errorNombre) errores.nombre = errorNombre;
    
    // Validar apellidos
    const { paterno, materno } = validarApellidos(formData.app_paterno || "", formData.app_materno || "");
    if (paterno) errores.app_paterno = paterno;
    if (materno) errores.app_materno = materno;
    
    // CI
    const errorCI = validarCarnetHospedaje(formData.ci || "");
    if (errorCI) errores.ci = errorCI;
    
    // Teléfono
    const errorTelefono = validarTelefonoHospedaje(formData.telefono || "");
    if (errorTelefono) errores.telefono = errorTelefono;
    
    // Email
    const errorEmail = validarEmailHospedaje(formData.email || "");
    if (errorEmail) errores.email = errorEmail;
    
    // Password
    const errorPassword = validarLongitud(formData.password || "", 6, 20, "La contraseña");
    if (errorPassword) errores.password = errorPassword;
    
    // Estado
    if (!["A", "I"].includes(formData.estado || "")) {
      errores.estado = "Estado no válido";
    }
    
    // Rol
    if (!["administrador", "empleado"].includes(formData.rol || "")) {
      errores.rol = "Rol no válido";
    }

    return errores;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario completo
    const erroresForm = validarFormulario();
    
    if (Object.keys(erroresForm).length > 0) {
      setErrors(erroresForm);
      // Marcar todos los campos como tocados
      setTouched({
        nombre: true,
        app_paterno: true,
        app_materno: true,
        ci: true,
        telefono: true,
        email: true,
        password: true,
      });
      setAlert({ 
        variant: "error", 
        message: "Por favor corrige los errores en el formulario" 
      });
      return;
    }

    setIsPending(true);
    setAlert(null);

    try {
      console.log("📤 Datos a enviar:", formData);
      
      await onSubmit(formData as Usuario);
      
      setAlert({ variant: "success", message: "Usuario creado correctamente" });
      
      // Resetear formulario
      setFormData({
        nombre: "",
        app_paterno: "",
        app_materno: "",
        ci: "",
        telefono: "",
        email: "",
        password: "12345678",
        rol: "empleado",
        estado: "A",
      });
      setErrors({});
      setTouched({});
      
      setTimeout(() => onClose(), 1500);
    } catch (error: any) {
      console.error("❌ Error al crear usuario:", error);
      setAlert({ 
        variant: "error", 
        message: error?.message || "Error al crear el usuario" 
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#e2e8f6] dark:bg-[#458890] px-4 py-3 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#26a5b9] text-white">+</span>
            Nuevo Usuario
          </h2>
          <button 
            onClick={onClose} 
            disabled={isPending} 
            className="p-1 text-gray-600 hover:bg-white/20 rounded-lg dark:text-gray-300"
          >
            <FaTimes className="size-5" />
          </button>
        </div>

        {/* Alerta */}
        {alert && (
          <div className="mt-4">
            <Alert 
              variant={alert.variant} 
              title={alert.variant === "success" ? "Éxito" : "Error"} 
              message={alert.message} 
            />
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Juan"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 ${
                  errors.nombre ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
            </div>

            {/* Apellido Paterno */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Apellido Paterno <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="app_paterno"
                value={formData.app_paterno}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Pérez"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 ${
                  errors.app_paterno ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              {errors.app_paterno && <p className="text-xs text-red-500 mt-1">{errors.app_paterno}</p>}
            </div>

            {/* Apellido Materno */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Apellido Materno <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="text"
                name="app_materno"
                value={formData.app_materno}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: García"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 ${
                  errors.app_materno ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              {errors.app_materno && <p className="text-xs text-red-500 mt-1">{errors.app_materno}</p>}
            </div>

            {/* CI */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                CI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ci"
                value={formData.ci}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: 12345678"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 ${
                  errors.ci ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              {errors.ci && <p className="text-xs text-red-500 mt-1">{errors.ci}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: 70123456"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 ${
                  errors.telefono ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: usuario@correo.com"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 ${
                  errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

           {/* Rol */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 ${
                  errors.rol ? "border-red-500" : ""
                }`}
              >
                <option value="empleado">Empleado</option>
                <option value="administrador">Administrador</option>
              </select>
              {errors.rol && <p className="text-xs text-red-500 mt-1">{errors.rol}</p>}
            </div>
            
            {/* Estado */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#26a5b9]/20 focus:border-[#26a5b9] dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
                disabled={isPending}
              >
                <option value="A">Activo</option>
                <option value="I">Inactivo</option>
              </select>
              {errors.estado && <p className="text-xs text-red-500 mt-1">{errors.estado}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <button 
              type="submit" 
              id="btn-guardar-usuario"
              disabled={isPending} 
              className="px-4 py-2 rounded-lg bg-[#26a5b9] text-white hover:bg-[#26a5b9]/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Guardando..." : "Guardar Usuario"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}