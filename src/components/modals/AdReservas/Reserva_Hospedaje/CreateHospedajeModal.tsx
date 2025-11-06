import { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaUpload, FaCopy, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { Modal } from '../../../ui/modal';
import Button from '../../../ui/button/Button';
import { useCreateReservaHotel } from "../../../../hooks/AdReservas/Reserva_Hospedaje/useCreateHospedaje";
import {
  validarNombreHospedaje,
  validarTelefonoHospedaje,
  validarCarnetHospedaje,
  validarEmailHospedaje,
  validarCantidadPersonas,
  validarFormularioHospedaje,
  validarEstructuraTexto,
  validarComprobante,
  soloNumeros,
  soloLetras,
  bloquearEscrituraDirecta
} from '../../../../components/utils/validaciones';

interface HospedajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function HospedajeModal({ isOpen, onClose, onSuccess }: HospedajeModalProps) {
  const { createReserva, loading, error } = useCreateReservaHotel();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    email: '',
    carnet: '',
    fechaInicio: '',
    fechaFin: '',
    cantidadPersonas: '',
    amoblado: 'si',
    banoPrivado: 'no',
  });

  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [errores, setErrores] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [cantidadDias, setCantidadDias] = useState<number>(0);
  const [montoTotal, setMontoTotal] = useState<number>(0);
  const [precioPorPersona] = useState<number>(100);
  const [codigoReserva, setCodigoReserva] = useState('RES12345');
  const [copiado, setCopiado] = useState(false);
  const [comprobanteError, setComprobanteError] = useState<string | null>(null);

  // Estados para calendarios
  const [showCalendarInicio, setShowCalendarInicio] = useState(false);
  const [showCalendarFin, setShowCalendarFin] = useState(false);
  const [currentMonthInicio, setCurrentMonthInicio] = useState(new Date());
  const [currentMonthFin, setCurrentMonthFin] = useState(new Date());

  // Función corregida para validar fechas - SOLO EN EL MODAL
  const validarFechasCorregida = (fechaInicio: string, fechaFin: string): { inicio: string | null; fin: string | null } => {
    const errores = {
      inicio: null as string | null,
      fin: null as string | null
    };

    if (!fechaInicio) {
      errores.inicio = 'La fecha de inicio es requerida';
    }

    if (!fechaFin) {
      errores.fin = 'La fecha de fin es requerida';
    }

    if (!fechaInicio || !fechaFin) {
      return errores;
    }

    // CORREGIDO: Crear fechas sin problemas de huso horario
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Parsear fechas correctamente (YYYY-MM-DD)
    const [anioInicio, mesInicio, diaInicio] = fechaInicio.split('-').map(Number);
    const inicio = new Date(anioInicio, mesInicio - 1, diaInicio);

    const [anioFin, mesFin, diaFin] = fechaFin.split('-').map(Number);
    const fin = new Date(anioFin, mesFin - 1, diaFin);

    // Validar fecha de inicio - SOLO si es ANTERIOR a hoy
    if (inicio < hoy) {
      errores.inicio = 'La fecha de inicio no puede ser anterior a hoy';
    }

    // Validar fecha máxima (3 años)
    const maxFecha = new Date();
    maxFecha.setFullYear(maxFecha.getFullYear() + 3);
    maxFecha.setHours(0, 0, 0, 0);

    if (inicio > maxFecha) {
      errores.inicio = 'La fecha de inicio no puede ser mayor a 3 años';
    }

    // Validar que fin sea igual o posterior a inicio
    if (fin < inicio) {
      errores.fin = 'La fecha de fin debe ser igual o posterior a la fecha de inicio';
    }

    // Validar que no sea más de 3 años después de la fecha de inicio
    const maxFin = new Date(inicio);
    maxFin.setFullYear(maxFin.getFullYear() + 3);
    if (fin > maxFin) {
      errores.fin = 'La reserva no puede exceder los 3 años';
    }

    return errores;
  };

  // --- CALCULO DIAS ---
  useEffect(() => {
    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);
      const diff = fin.getTime() - inicio.getTime();
      const dias = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
      setCantidadDias(dias > 0 ? dias : 0);
    } else setCantidadDias(0);
  }, [formData.fechaInicio, formData.fechaFin]);

  // --- CALCULO MONTO ---
  useEffect(() => {
    if (formData.cantidadPersonas && cantidadDias > 0) {
      const cantidad = parseInt(formData.cantidadPersonas);
      setMontoTotal(!isNaN(cantidad) && cantidad > 0 ? precioPorPersona * cantidad * cantidadDias : 0);
    } else setMontoTotal(0);
  }, [formData.cantidadPersonas, cantidadDias, precioPorPersona]);

  // --- VALIDACIONES ---
  const validarCampo = (nombre: string, valor: string) => {
    let error: string | null = null;
    switch (nombre) {
      case 'nombre':
        error = validarNombreHospedaje(valor);
        if (valor && !error && !validarEstructuraTexto(valor)) error = 'El nombre no parece válido.';
        break;
      case 'apellidoPaterno':
      case 'apellidoMaterno':
        // SOLO validar individualmente, no la regla de "al menos uno"
        if (valor.trim()) {
          if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(valor.trim())) {
            error = `El ${nombre === 'apellidoPaterno' ? 'apellido paterno' : 'apellido materno'} solo puede contener letras`;
          }
        }
        // No establecer error de "al menos uno" aquí, eso se hace en handleSubmit
        break;
      case 'telefono': error = validarTelefonoHospedaje(valor); break;
      case 'email': error = validarEmailHospedaje(valor); break;
      case 'carnet': error = validarCarnetHospedaje(valor); break;
      case 'cantidadPersonas': error = validarCantidadPersonas(valor); break;
      case 'fechaInicio':
      case 'fechaFin':
        const fechas = validarFechasCorregida(
          nombre === 'fechaInicio' ? valor : formData.fechaInicio,
          nombre === 'fechaFin' ? valor : formData.fechaFin
        );
        error = nombre === 'fechaInicio' ? fechas.inicio : fechas.fin;
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let val = value;

    if (['nombre', 'apellidoPaterno', 'apellidoMaterno'].includes(name)) {
      val = val.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
    }
    if (name === 'telefono') val = val.slice(0, 8);
    if (name === 'carnet') val = val.slice(0, 9);
    if (name === 'cantidadPersonas') val = val.replace(/\D/g, '').slice(0, 1);

    setFormData(prev => ({ ...prev, [name]: val }));
    if (touched[name]) setErrores(prev => ({ ...prev, [name]: validarCampo(name, val) }));
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = value.trim();
    setFormData(prev => ({ ...prev, [name]: val }));
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrores(prev => ({ ...prev, [name]: validarCampo(name, val) }));
  };

  const handleCheckboxChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Funciones para el calendario
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (date: string, type: 'inicio' | 'fin') => {
    // CORREGIDO: Usar la fecha directamente sin conversiones
    setFormData(prev => ({
      ...prev,
      [type === 'inicio' ? 'fechaInicio' : 'fechaFin']: date
    }));

    // Cerrar calendario
    if (type === 'inicio') {
      setShowCalendarInicio(false);
    } else {
      setShowCalendarFin(false);
    }

    // Validar fechas CON LA FUNCIÓN CORREGIDA
    const nuevaFechaInicio = type === 'inicio' ? date : formData.fechaInicio;
    const nuevaFechaFin = type === 'fin' ? date : formData.fechaFin;

    const erroresFechas = validarFechasCorregida(nuevaFechaInicio, nuevaFechaFin);
    setErrores(prev => ({
      ...prev,
      fechaInicio: erroresFechas.inicio,
      fechaFin: erroresFechas.fin
    }));
  };

  const renderCalendar = (type: 'inicio' | 'fin') => {
    const currentMonth = type === 'inicio' ? currentMonthInicio : currentMonthFin;
    const setCurrentMonth = type === 'inicio' ? setCurrentMonthInicio : setCurrentMonthFin;

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fecha máxima: 3 años desde hoy
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 3);

    const isCurrentMonth =
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear();

    return (
      <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 w-80">
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded text-teal-600 dark:text-teal-400"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-gray-800 dark:text-white">
            {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded text-teal-600 dark:text-teal-400"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-teal-600 dark:text-teal-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />;

            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dateObj = new Date(dateStr);
            dateObj.setHours(0, 0, 0, 0);

            const isToday = isCurrentMonth && day === today.getDate();
            const isSelected = (type === 'inicio' && formData.fechaInicio === dateStr) ||
              (type === 'fin' && formData.fechaFin === dateStr);

            let isDisabled = false;

            if (type === 'inicio') {
              // Para inicio: permitir desde HOY en adelante
              isDisabled = dateObj < today || dateObj > maxDate;
            } else {
              // Para fin: validar según fecha de inicio si existe
              if (formData.fechaInicio) {
                const inicioDate = new Date(formData.fechaInicio);
                inicioDate.setHours(0, 0, 0, 0);
                const maxFin = new Date(inicioDate);
                maxFin.setFullYear(maxFin.getFullYear() + 3);

                // CORREGIDO: Solo deshabilitar si es ANTERIOR a la fecha inicio
                isDisabled = dateObj < inicioDate || dateObj > maxFin;
              } else {
                // Si no hay fecha de inicio, deshabilitar solo fechas pasadas
                isDisabled = dateObj < today;
              }
            }

            return (
              <button
                key={day}
                type="button"
                onClick={() => !isDisabled && handleDateSelect(dateStr, type)}
                disabled={isDisabled}
                className={`
                  w-8 h-8 rounded text-sm font-medium transition
                  ${isSelected
                    ? 'bg-teal-600 text-white'
                    : isToday
                      ? 'bg-teal-100 text-teal-700 border border-teal-600 dark:bg-teal-900 dark:text-teal-300'
                      : isDisabled
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setComprobanteError(null);
    if (!file) return setComprobante(null);
    const error = validarComprobante(file);
    if (error) {
      setComprobante(null);
      setComprobanteError(error);
      e.target.value = '';
      return;
    }
    setComprobante(file);
  };

  // En la función handleSubmit, modifica esta parte:
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const erroresFechas = validarFechasCorregida(formData.fechaInicio, formData.fechaFin);
    const otrosErrores = validarFormularioHospedaje(formData);

    // VERIFICACIÓN CORREGIDA - Solo mostrar error si AMBOS están vacíos
    const app_paterno = formData.apellidoPaterno.trim();
    const app_materno = formData.apellidoMaterno.trim();

    if (!app_paterno && !app_materno) {
      otrosErrores.apellidoPaterno = 'Al menos un apellido es requerido';
      otrosErrores.apellidoMaterno = 'Al menos un apellido es requerido';
    } else {
      // LIMPIAR los errores de apellidos si al menos uno tiene valor
      otrosErrores.apellidoPaterno = otrosErrores.apellidoPaterno && !app_paterno ? otrosErrores.apellidoPaterno : null;
      otrosErrores.apellidoMaterno = otrosErrores.apellidoMaterno && !app_materno ? otrosErrores.apellidoMaterno : null;
    }

    const erroresValidacion = {
      ...otrosErrores,
      fechaInicio: erroresFechas.inicio,
      fechaFin: erroresFechas.fin
    };

    setErrores(erroresValidacion);

    const hayErrores = Object.values(erroresValidacion).some(error => error !== null);

    if (hayErrores) return;

    setStep('payment');
  };

  const handleUploadComprobante = async () => {
    if (!comprobante) return;

    try {
      const app_paterno = formData.apellidoPaterno.trim();
      const app_materno = formData.apellidoMaterno.trim();

      // VERIFICACIÓN CORREGIDA - Solo mostrar error si AMBOS están vacíos
      if (!app_paterno && !app_materno) {
        setErrores(prev => ({
          ...prev,
          apellidoPaterno: 'Al menos un apellido es requerido',
          apellidoMaterno: 'Al menos un apellido es requerido'
        }));
        setStep('form');
        return;
      }

      // LIMPIAR errores de apellidos si la validación pasa
      setErrores(prev => ({
        ...prev,
        apellidoPaterno: null,
        apellidoMaterno: null
      }));

      const datosReserva = {
        nombre: formData.nombre.trim(),
        app_paterno: app_paterno,
        app_materno: app_materno,
        telefono: formData.telefono.trim(),
        ci: formData.carnet.trim(),
        email: formData.email.trim(),
        cant_personas: parseInt(formData.cantidadPersonas),
        amoblado: formData.amoblado ,
        banoPrivado: formData.banoPrivado,
        fecha_ini: formData.fechaInicio,
        fecha_fin: formData.fechaFin,
        estado: 'pendiente',
        monto_total: montoTotal,
        adelanto: montoTotal * 0.5,
      };

      console.log('📤 ENVIANDO:', datosReserva);

      const resultado = await createReserva(datosReserva);
      console.log('✅ RESPUESTA:', resultado);

      if (resultado?.codigo_reserva) {
        setCodigoReserva(resultado.codigo_reserva);
      }

      setStep('success');

      if (onSuccess) {
        onSuccess();
      }

    } catch (err: any) {
      console.error('❌ Error:', err.response?.data);

      const errorMessage = err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al crear la reserva';

      if (errorMessage.includes('datos del cliente')) {
        setErrores(prev => ({
          ...prev,
          apellidoPaterno: 'Al menos un apellido es requerido',
          apellidoMaterno: 'Al menos un apellido es requerido'
        }));
        setStep('form');
      } else {
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoReserva);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const resetearFormulario = () => {
    setFormData({
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
      email: '',
      carnet: '',
      fechaInicio: '',
      fechaFin: '',
      cantidadPersonas: '',
      amoblado: 'si',
      banoPrivado: 'no',
    });
    setErrores({});
    setTouched({});
    setStep('form');
    setComprobante(null);
    setCantidadDias(0);
    setMontoTotal(0);
    setShowCalendarInicio(false);
    setShowCalendarFin(false);
    setCodigoReserva('RES12345');
  };

  // Cerrar calendarios cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.calendar-container')) {
        setShowCalendarInicio(false);
        setShowCalendarFin(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl m-4">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 rounded-t-2xl bg-teal-500 dark:bg-teal-600 mb-4">
          <h2 className="text-xl font-bold text-white">Reserva Hospedaje</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-teal-600 dark:hover:bg-teal-700 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-4">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos Personales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-400 border-b pb-2 border-teal-200 dark:border-teal-700">
                  Datos Personales
                </h3>

                {/* Nombre y Apellidos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={soloLetras}
                      className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Ej: Juan"
                    />
                    {errores.nombre && <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                      Apellido Paterno *
                    </label>
                    <input
                      type="text"
                      name="apellidoPaterno"
                      value={formData.apellidoPaterno}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={soloLetras}
                      className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Ej: Pérez"
                    />
                    {errores.apellidoPaterno && <p className="text-xs text-red-500 mt-1">{errores.apellidoPaterno}</p>}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                      Apellido Materno
                    </label>
                    <input
                      type="text"
                      name="apellidoMaterno"
                      value={formData.apellidoMaterno}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={soloLetras}
                      className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Ej: García (opcional)"
                    />
                    {errores.apellidoMaterno && <p className="text-xs text-red-500 mt-1">{errores.apellidoMaterno}</p>}
                  </div>
                </div>

                {/* Teléfono y Carnet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) => {
                        if (!/^[0-9]$/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={8}
                      className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="7XXXXXXX"
                    />
                    {errores.telefono && <p className="text-xs text-red-500 mt-1">{errores.telefono}</p>}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                      Carnet *
                    </label>
                    <input
                      type="text"
                      name="carnet"
                      value={formData.carnet}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={soloNumeros}
                      maxLength={9}
                      className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="XXXXXXXXX"
                    />
                    {errores.carnet && <p className="text-xs text-red-500 mt-1">{errores.carnet}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="juan@email.com"
                  />
                  {errores.email && <p className="text-xs text-red-500 mt-1">{errores.email}</p>}
                </div>
              </div>

              {/* Detalles de Reserva */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-400 border-b pb-2 border-teal-200 dark:border-teal-700">
                  Detalles de la Reserva
                </h3>

                {/* Fechas con Calendarios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="calendar-container relative">
                    <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                      Fecha Inicio *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={formData.fechaInicio ? formData.fechaInicio : ''}
                        onClick={() => {
                          setShowCalendarInicio(true);
                          setShowCalendarFin(false);
                        }}
                        className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer pr-10"
                        placeholder="Seleccionar fecha"
                      />
                      <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
                    </div>
                    {errores.fechaInicio && <p className="text-xs text-red-500 mt-1">{errores.fechaInicio}</p>}
                    {showCalendarInicio && renderCalendar('inicio')}
                  </div>

                  <div className="calendar-container relative">
                    <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                      Fecha Fin *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={formData.fechaFin ? formData.fechaFin : ''}
                        onClick={() => {
                          setShowCalendarFin(true);
                          setShowCalendarInicio(false);
                        }}
                        className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer pr-10"
                        placeholder="Seleccionar fecha"
                      />
                      <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
                    </div>
                    {errores.fechaFin && <p className="text-xs text-red-500 mt-1">{errores.fechaFin}</p>}
                    {showCalendarFin && renderCalendar('fin')}
                  </div>
                </div>

                {/* Opciones de Habitación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="block mb-2 text-sm font-medium text-teal-700 dark:text-teal-300">
                      ¿Habitación Amoblada? *
                    </p>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="amoblado"
                          value="si"
                          checked={formData.amoblado === 'si'}
                          onChange={(e) => handleCheckboxChange('amoblado', e.target.value)}
                          className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500 dark:bg-gray-800 dark:border-teal-600"
                        />
                        <span className="text-sm text-teal-700 dark:text-teal-300">Sí</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="amoblado"
                          value="no"
                          checked={formData.amoblado === 'no'}
                          onChange={(e) => handleCheckboxChange('amoblado', e.target.value)}
                          className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500 dark:bg-gray-800 dark:border-teal-600"
                        />
                        <span className="text-sm text-teal-700 dark:text-teal-300">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="block mb-2 text-sm font-medium text-teal-700 dark:text-teal-300">
                      ¿Baño Privado? *
                    </p>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="banoPrivado"
                          value="si"
                          checked={formData.banoPrivado === 'si'}
                          onChange={(e) => handleCheckboxChange('banoPrivado', e.target.value)}
                          className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500 dark:bg-gray-800 dark:border-teal-600"
                        />
                        <span className="text-sm text-teal-700 dark:text-teal-300">Sí</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="banoPrivado"
                          value="no"
                          checked={formData.banoPrivado === 'no'}
                          onChange={(e) => handleCheckboxChange('banoPrivado', e.target.value)}
                          className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500 dark:bg-gray-800 dark:border-teal-600"
                        />
                        <span className="text-sm text-teal-700 dark:text-teal-300">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cantidad de Personas */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                    Cantidad Personas *
                  </label>
                  <input
                    type="number"
                    name="cantidadPersonas"
                    value={formData.cantidadPersonas}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) => { soloNumeros(e); bloquearEscrituraDirecta(e); }}
                    maxLength={1}
                    className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Ej: 1"
                    min={1}
                    max={9}
                  />
                  {errores.cantidadPersonas && <p className="text-xs text-red-500 mt-1">{errores.cantidadPersonas}</p>}
                </div>

                {/* Resumen de Monto */}
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 border border-teal-200 dark:border-teal-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-teal-700 dark:text-teal-300 mb-1">Monto Total a Pagar</p>
                      {formData.cantidadPersonas && cantidadDias > 0 && (
                        <p className="text-xs text-teal-600 dark:text-teal-400">
                          {precioPorPersona.toFixed(2)} Bs. × {formData.cantidadPersonas} persona(s) × {cantidadDias} día(s)
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                          {montoTotal.toFixed(2)}
                        </span>
                        <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">Bs.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={montoTotal === 0}
                >
                  Continuar al Pago
                </Button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-400 text-center">
                Realizar Pago
              </h3>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Sección QR */}
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                    <img
                      src="../images/ReservaPagos/ResHotel1.jpg"
                      alt="Código QR de pago"
                      className="w-full max-w-xs mx-auto rounded-xl"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      Escanea con tu aplicación bancaria
                    </p>
                    <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <p className="text-xs font-semibold">Altoke - Pago seguro</p>
                    </div>
                  </div>
                </div>

                {/* Sección Información de Pago */}
                <div className="space-y-6">
                  {/* Monto a Pagar */}
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-teal-100 dark:border-teal-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                          Monto a pagar:
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">50% de adelanto</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-teal-700 dark:text-teal-300">
                          {(montoTotal * 0.5).toFixed(2)}
                        </p>
                        <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">Bs.</p>
                      </div>
                    </div>
                  </div>

                  {/* Información Importante */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 dark:bg-amber-800 p-1 rounded-full mt-0.5">
                        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                          Importante
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          El restante 50% ({(montoTotal * 0.5).toFixed(2)} Bs.) se pagará en recepción
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comprobante de Pago */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Comprobante de Pago *
                    </label>

                    <div className={`
                      border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
                      ${comprobanteError
                        ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                        : comprobante
                          ? 'border-teal-300 bg-teal-50 dark:bg-teal-900/20 dark:border-teal-700'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20'
                      }
                    `}>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        id="comprobante"
                      />
                      <label htmlFor="comprobante" className="cursor-pointer block">
                        {comprobante ? (
                          <div className="text-teal-600 dark:text-teal-400 space-y-2">
                            <FaCheck className="w-12 h-12 mx-auto" />
                            <p className="font-semibold text-lg">✓ Archivo seleccionado</p>
                            <p className="text-sm text-teal-700 dark:text-teal-300 truncate">{comprobante.name}</p>
                            <p className="text-xs text-teal-600 dark:text-teal-400 mt-2">
                              {(comprobante.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400 space-y-3">
                            <FaUpload className="w-12 h-12 mx-auto" />
                            <div>
                              <p className="font-semibold text-teal-600 dark:text-teal-400 text-lg">Seleccionar archivo</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">JPG, PNG o PDF (máx. 5MB)</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Mensaje de error */}
                    {comprobanteError && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                        <FaTimes className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{comprobanteError}</p>
                      </div>
                    )}

                    {/* Información de tipos de archivo */}
                    <div className="flex flex-wrap gap-4 justify-center text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>JPG/JPEG</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>PNG</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>PDF</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Confirmación */}
                  <Button
                    onClick={handleUploadComprobante}
                    disabled={!comprobante || loading}
                    className="w-full py-4"
                    variant="primary"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Procesando comprobante...</span>
                      </div>
                    ) : (
                      'Confirmar Pago'
                    )}
                  </Button>

                  {/* Error de subida */}
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl">
                      <div className="flex items-center gap-2 font-semibold mb-1">
                        <FaTimes className="w-4 h-4" />
                        Error al crear reserva
                      </div>
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Información adicional en la parte inferior */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Pago seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Confirmación inmediata</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6 py-4">
              <div className="bg-teal-100 dark:bg-teal-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <FaCheck className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>

              <h3 className="text-xl font-bold text-teal-700 dark:text-teal-400">¡Reserva Exitosa!</h3>
              <p className="text-teal-600 dark:text-teal-300">Tu reserva ha sido confirmada correctamente</p>

              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                <p className="text-sm text-teal-700 dark:text-teal-300 mb-2">Tu código de reserva es:</p>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-2xl font-bold text-teal-700 dark:text-teal-300 tracking-wider">{codigoReserva}</p>
                  <button
                    onClick={copiarCodigo}
                    className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition"
                    title="Copiar código"
                  >
                    {copiado ? <FaCheck className="w-4 h-4" /> : <FaCopy className="w-4 h-4" />}
                  </button>
                </div>
                {copiado && <p className="text-xs text-teal-600 dark:text-teal-400 mt-2">✓ Copiado</p>}
              </div>

              <Button variant="primary" onClick={resetearFormulario}>Cerrar</Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}