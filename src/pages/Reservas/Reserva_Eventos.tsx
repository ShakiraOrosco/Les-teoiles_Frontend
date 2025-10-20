import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

interface FormErrors {
  [key: string]: string;
}

export default function Eventos() {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    telefono: '',
    email: '',
    carnet: '',
    fechaInicio: '',
    fechaFin: '',
    cantidadPersonas: '',
    tipoEvento: '',
    horaInicio: '',
    horaFin: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Validaciones individuales
  const validarNombre = (nombre: string): string => {
    if (!nombre.trim()) return 'El nombre completo es requerido';
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(nombre)) return 'El nombre solo debe contener letras';
    return '';
  };

  const validarTelefono = (telefono: string): string => {
    if (!telefono.trim()) return 'El teléfono es requerido';
    const soloNumeros = telefono.replace(/\D/g, '');
    if (!/^[67]\d{7}$/.test(soloNumeros)) return 'Ingresa un teléfono válido (7XXXXXXX o 6XXXXXXX)';
    return '';
  };

  const validarEmail = (email: string): string => {
    if (!email.trim()) return 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un email válido';
    return '';
  };

  const validarCarnet = (carnet: string): string => {
    if (!carnet.trim()) return 'El carnet de identidad es requerido';
    const soloNumeros = carnet.replace(/\D/g, '');
    if (!/^\d{7,10}$/.test(soloNumeros)) return 'Ingresa un carnet válido (7-10 dígitos)';
    return '';
  };

  const validarTipoEvento = (tipo: string): string => {
    if (!tipo.trim()) return 'El tipo de evento es requerido';
    if (tipo.trim().length < 3) return 'El tipo de evento debe tener al menos 3 caracteres';
    return '';
  };

  const validarFechaInicio = (fecha: string): string => {
    if (!fecha) return 'La fecha de inicio es requerida';
    const today = new Date().toISOString().split('T')[0];
    if (fecha < today) return 'La fecha no puede ser anterior a hoy';
    return '';
  };

  const validarFechaFin = (fechaFin: string, fechaInicio: string): string => {
    if (!fechaFin) return 'La fecha de fin es requerida';
    if (fechaFin < fechaInicio) return 'La fecha de fin debe ser igual o posterior a la de inicio';
    return '';
  };

  const validarCantidad = (cantidad: string): string => {
    if (!cantidad) return 'La cantidad de personas es requerida';
    const num = parseInt(cantidad);
    if (num < 1 || num > 500) return 'Debe haber entre 1 y 500 personas';
    return '';
  };

  const validarHoraInicio = (hora: string): string => {
    if (!hora) return 'La hora de inicio es requerida';
    return '';
  };

  const validarHoraFin = (horaFin: string, horaInicio: string): string => {
    if (!horaFin) return 'La hora de fin es requerida';
    if (horaFin <= horaInicio) return 'La hora de fin debe ser posterior a la de inicio';
    return '';
  };

  const validarFormulario = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.nombreCompleto = validarNombre(formData.nombreCompleto);
    newErrors.telefono = validarTelefono(formData.telefono);
    newErrors.email = validarEmail(formData.email);
    newErrors.carnet = validarCarnet(formData.carnet);
    newErrors.tipoEvento = validarTipoEvento(formData.tipoEvento);
    newErrors.fechaInicio = validarFechaInicio(formData.fechaInicio);
    newErrors.fechaFin = validarFechaFin(formData.fechaFin, formData.fechaInicio);
    newErrors.cantidadPersonas = validarCantidad(formData.cantidadPersonas);
    newErrors.horaInicio = validarHoraInicio(formData.horaInicio);
    newErrors.horaFin = validarHoraFin(formData.horaFin, formData.horaInicio);

    // Eliminar errores vacíos
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (validarFormulario()) {
      console.log('Datos validados:', formData);
      alert('¡Solicitud enviada exitosamente!');
      setFormData({
        nombreCompleto: '',
        telefono: '',
        email: '',
        carnet: '',
        fechaInicio: '',
        fechaFin: '',
        cantidadPersonas: '',
        tipoEvento: '',
        horaInicio: '',
        horaFin: '',
      });
      setSubmitted(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-teal-900">Reserva de Eventos</h2>
        <p className="text-gray-600 mt-2">Completa el formulario para realizar tu solicitud</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Personales */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-900 border-b pb-2">
            Datos Personales
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                submitted && errors.nombreCompleto
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-teal-500'
              }`}
              placeholder="Ej: Juan Pérez García"
            />
            {submitted && errors.nombreCompleto && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.nombreCompleto}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                  submitted && errors.telefono
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-teal-500'
                }`}
                placeholder="7XXXXXXX"
              />
              {submitted && errors.telefono && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.telefono}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carnet de Identidad *
              </label>
              <input
                type="text"
                name="carnet"
                value={formData.carnet}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                  submitted && errors.carnet
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-teal-500'
                }`}
                placeholder="XXXXXXXX"
              />
              {submitted && errors.carnet && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.carnet}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                submitted && errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-teal-500'
              }`}
              placeholder="ejemplo@correo.com"
            />
            {submitted && errors.email && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </div>
            )}
          </div>
        </div>

        {/* Detalles del Evento */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-900 border-b pb-2">
            Detalles del Evento
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Evento *
            </label>
            <input
              type="text"
              name="tipoEvento"
              value={formData.tipoEvento}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                submitted && errors.tipoEvento
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-teal-500'
              }`}
              placeholder="Ej: Cumpleaños, Reunión, etc."
            />
            {submitted && errors.tipoEvento && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.tipoEvento}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                  submitted && errors.fechaInicio
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-teal-500'
                }`}
              />
              {submitted && errors.fechaInicio && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fechaInicio}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin *
              </label>
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                  submitted && errors.fechaFin
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-teal-500'
                }`}
              />
              {submitted && errors.fechaFin && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fechaFin}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad de Personas *
            </label>
            <input
              type="number"
              name="cantidadPersonas"
              value={formData.cantidadPersonas}
              onChange={handleChange}
              min="1"
              max="500"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                submitted && errors.cantidadPersonas
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-teal-500'
              }`}
              placeholder="Ej: 50"
            />
            {submitted && errors.cantidadPersonas && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.cantidadPersonas}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Inicio *
              </label>
              <input
                type="time"
                name="horaInicio"
                value={formData.horaInicio}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                  submitted && errors.horaInicio
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-teal-500'
                }`}
              />
              {submitted && errors.horaInicio && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.horaInicio}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Fin *
              </label>
              <input
                type="time"
                name="horaFin"
                value={formData.horaFin}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                  submitted && errors.horaFin
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-teal-500'
                }`}
              />
              {submitted && errors.horaFin && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.horaFin}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold"
        >
          Enviar Solicitud
        </button>
      </form>
    </>
  );
}