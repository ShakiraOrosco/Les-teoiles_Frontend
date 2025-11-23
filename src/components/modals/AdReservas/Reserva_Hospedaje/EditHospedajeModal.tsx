import { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { Modal } from '../../../ui/modal';
import Button from '../../../ui/button/Button';
import { useUpdateHospedaje } from '../../../../hooks/AdReservas/Reserva_Hospedaje/useUpdateHospedaje';
import { ReservaHotel, DatosCliente } from '../../../../types/AdReserva/Reserva_Hospedaje/hospedaje';
import {
  validarNombreHospedaje,
  validarApellidos,
  validarTelefonoHospedaje,
  validarCarnetHospedaje,
  validarEmailHospedaje,
  validarCantidadPersonas,
  validarFormularioHospedaje,
  validarFechas,
  validarEstructuraTexto,
  soloNumeros,
  soloLetras,
  bloquearEscrituraDirecta
} from '../../../../components/utils/validaciones';

interface EditHospedajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: ReservaHotel | null;
  onSave: (reserva: ReservaHotel) => void;
}

// Función helper para obtener datos del cliente de forma segura
const getDatosCliente = (datosCliente: DatosCliente | number): DatosCliente => {
  if (typeof datosCliente === 'object' && datosCliente !== null) {
    return datosCliente;
  }
  return {
    id_datos_cliente: 0,
    nombre: '',
    app_paterno: '',
    app_materno: '',
    telefono: '',
    ci: '',
    email: ''
  };
};

export default function EditHospedajeModal({ isOpen, onClose, reserva, onSave }: EditHospedajeModalProps) {
  const { updateReservaHotel, isUpdating, error } = useUpdateHospedaje();

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
    amoblado: 'S',
    banoPrivado: 'N',
  });

  const [datosOriginales, setDatosOriginales] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    email: '',
    carnet: '',
    fechaInicio: '',
    fechaFin: '',
    cantidadPersonas: '',
    amoblado: 'S',
    banoPrivado: 'N',
  });

  const [errores, setErrores] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [cantidadDias, setCantidadDias] = useState<number>(0);
  const [montoTotal, setMontoTotal] = useState<number>(0);
  const [precioPorPersona] = useState<number>(100);

  // Estados para calendarios
  const [showCalendarInicio, setShowCalendarInicio] = useState(false);
  const [showCalendarFin, setShowCalendarFin] = useState(false);
  const [currentMonthInicio, setCurrentMonthInicio] = useState(new Date());
  const [currentMonthFin, setCurrentMonthFin] = useState(new Date());

  // Cargar datos de la reserva cuando el modal se abre
  useEffect(() => {
    if (reserva) {
      const datosCliente = getDatosCliente(reserva.datos_cliente);

      const nuevosDatos = {
        nombre: datosCliente.nombre || '',
        apellidoPaterno: datosCliente.app_paterno || '',
        apellidoMaterno: datosCliente.app_materno || '',
        telefono: datosCliente.telefono?.toString() || '',
        email: datosCliente.email || '',
        carnet: datosCliente.ci?.toString() || '',
        fechaInicio: reserva.fecha_ini || '',
        fechaFin: reserva.fecha_fin || '',
        cantidadPersonas: reserva.cant_personas?.toString() || '',
        amoblado: reserva.amoblado || 'S',
        banoPrivado: reserva.baño_priv || 'N',
      };

      setFormData(nuevosDatos);
      setDatosOriginales(nuevosDatos);

      // Calcular monto inicial
      if (reserva.fecha_ini && reserva.fecha_fin && reserva.cant_personas) {
        const inicio = new Date(reserva.fecha_ini);
        const fin = new Date(reserva.fecha_fin);
        const diff = fin.getTime() - inicio.getTime();
        const dias = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
        setCantidadDias(dias > 0 ? dias : 0);
        setMontoTotal(precioPorPersona * reserva.cant_personas * dias);
      }
    }
  }, [reserva, precioPorPersona]);

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
    } else {
      setMontoTotal(0);
    }
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
        const errs = validarApellidos(formData.apellidoPaterno, formData.apellidoMaterno);
        error = nombre === 'apellidoPaterno' ? errs.paterno : errs.materno;
        break;
      case 'telefono':
        error = validarTelefonoHospedaje(valor);
        break;
      case 'email': error = validarEmailHospedaje(valor); break;
      case 'carnet': error = validarCarnetHospedaje(valor); break;
      case 'cantidadPersonas': error = validarCantidadPersonas(valor); break;
      case 'fechaInicio':
      case 'fechaFin':
        const fechas = validarFechas(
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
    if (touched[name]) {
      setErrores(prev => ({ ...prev, [name]: validarCampo(name, val) }));
    }
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

  // Funciones para el calendario (mantener igual)
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (date: string, type: 'inicio' | 'fin') => {
    // Asegurarnos de que la fecha se mantenga sin ajustes de zona horaria
    const fechaAjustada = new Date(date);
    const fechaFormateada = fechaAjustada.toISOString().split('T')[0];

    setFormData(prev => ({
      ...prev,
      [type === 'inicio' ? 'fechaInicio' : 'fechaFin']: fechaFormateada
    }));

    if (type === 'inicio') {
      setShowCalendarInicio(false);
    } else {
      setShowCalendarFin(false);
    }

    const erroresFechas = validarFechas(
      type === 'inicio' ? fechaFormateada : formData.fechaInicio,
      type === 'fin' ? fechaFormateada : formData.fechaFin
    );
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

    const maxInicio = new Date(today);
    maxInicio.setFullYear(maxInicio.getFullYear() + 3);

    const isCurrentMonth =
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear();

    return (
      <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-teal-300 dark:border-teal-600 rounded-lg shadow-lg p-4 w-80">
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded text-teal-600 dark:text-teal-400"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-teal-700 dark:text-teal-400">
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
              isDisabled = dateObj < today || dateObj > maxInicio;
            } else {
              if (formData.fechaInicio) {
                const inicioDate = new Date(formData.fechaInicio);
                inicioDate.setHours(0, 0, 0, 0);
                const maxFin = new Date(inicioDate);
                maxFin.setFullYear(maxFin.getFullYear() + 3);

                isDisabled = dateObj <= inicioDate || dateObj > maxFin;
              } else {
                isDisabled = dateObj <= today;
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

  // Función para detectar qué campos cambiaron - CORREGIDA
  const detectarCambios = () => {
    const cambios: any = {};

    // Comparar cada campo y solo agregar si cambió
    if (formData.nombre !== datosOriginales.nombre && formData.nombre !== '') {
      cambios.nombre = formData.nombre;
    }
    if (formData.apellidoPaterno !== datosOriginales.apellidoPaterno && formData.apellidoPaterno !== '') {
      cambios.app_paterno = formData.apellidoPaterno;
    }
    if (formData.apellidoMaterno !== datosOriginales.apellidoMaterno && formData.apellidoMaterno !== '') {
      cambios.app_materno = formData.apellidoMaterno;
    }
    if (formData.telefono !== datosOriginales.telefono && formData.telefono !== '') {
      cambios.telefono = parseInt(formData.telefono) || 0;
    }
    if (formData.carnet !== datosOriginales.carnet && formData.carnet !== '') {
      cambios.ci = parseInt(formData.carnet) || 0;
    }
    if (formData.email !== datosOriginales.email && formData.email !== '') {
      cambios.email = formData.email;
    }
    if (formData.cantidadPersonas !== datosOriginales.cantidadPersonas && formData.cantidadPersonas !== '') {
      cambios.cant_personas = parseInt(formData.cantidadPersonas) || 1;
    }
    if (formData.fechaInicio !== datosOriginales.fechaInicio && formData.fechaInicio !== '') {
      cambios.fecha_ini = formData.fechaInicio;
    }
    if (formData.fechaFin !== datosOriginales.fechaFin && formData.fechaFin !== '') {
      cambios.fecha_fin = formData.fechaFin;
    }
    if (formData.amoblado !== datosOriginales.amoblado) {
      cambios.amoblado = formData.amoblado;
    }
    if (formData.banoPrivado !== datosOriginales.banoPrivado) {
      cambios.baño_priv = formData.banoPrivado;
    }

    return cambios;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reserva || !reserva.id_reserva_hotel) {
      console.error('No hay reserva válida para editar');
      return;
    }

    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    // Validar el formulario
    const formDataParaValidar = {
      ...formData,
      telefono: formData.telefono.toString(),
      carnet: formData.carnet.toString()
    };

    const erroresValidacion = validarFormularioHospedaje(formDataParaValidar);
    setErrores(erroresValidacion);

    if (Object.values(erroresValidacion).some(err => err)) return;

    try {
      // Detectar qué campos realmente cambiaron
      const cambios = detectarCambios();

      console.log('📊 Campos que cambiaron:', cambios);

      // Si no hay cambios, mostrar mensaje
      if (Object.keys(cambios).length === 0) {
        setErrores({ general: 'No se realizaron cambios en los datos' });
        return;
      }

      // Obtener IDs relacionados de forma segura
      const datosCliente = getDatosCliente(reserva.datos_cliente);
      const datosClienteId = datosCliente.id_datos_cliente;

      const reservasGenId = typeof reserva.reservas_gen === 'object'
        ? reserva.reservas_gen.id_reservas_gen
        : reserva.reservas_gen;

      const habitacionId = typeof reserva.habitacion === 'object'
        ? reserva.habitacion.id_habitacion
        : reserva.habitacion;

      // Crear objeto con todos los datos necesarios
      const reservaParaActualizar = {
        // Campos base de la reserva
        ...reserva,
        // Campos que cambiaron
        ...cambios,
        // IDs necesarios
        datos_cliente: datosClienteId,
        reservas_gen: reservasGenId,
        habitacion: habitacionId
      };

      console.log('🚀 Enviando datos para actualizar:', reservaParaActualizar);

      // Llamar al hook para actualizar
      const resultado = await updateReservaHotel(reservaParaActualizar);

      if (resultado) {
        onSave(resultado);
        onClose();
      }
    } catch (err) {
      console.error('Error al actualizar reserva:', err);
    }
  };

  const resetearFormulario = () => {
    if (reserva) {
      const datosCliente = getDatosCliente(reserva.datos_cliente);

      const nuevosDatos = {
        nombre: datosCliente.nombre || '',
        apellidoPaterno: datosCliente.app_paterno || '',
        apellidoMaterno: datosCliente.app_materno || '',
        telefono: datosCliente.telefono?.toString() || '',
        email: datosCliente.email || '',
        carnet: datosCliente.ci?.toString() || '',
        fechaInicio: reserva.fecha_ini || '',
        fechaFin: reserva.fecha_fin || '',
        cantidadPersonas: reserva.cant_personas?.toString() || '',
        amoblado: reserva.amoblado || 'S',
        banoPrivado: reserva.baño_priv || 'N',
      };

      setFormData(nuevosDatos);
      setDatosOriginales(nuevosDatos);
    }
    setErrores({});
    setTouched({});
  };

  const handleClose = () => {
    resetearFormulario();
    onClose();
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
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl m-4">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 rounded-t-2xl bg-teal-500 dark:bg-teal-600 mb-4">
          <div className="flex items-center gap-2">
            <FaEdit className="text-white" />
            <h2 className="text-xl font-bold text-white">
              Editar Reserva {reserva?.id_reserva_hotel ? `RES${reserva.id_reserva_hotel}` : ''}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-white hover:bg-teal-600 dark:hover:bg-teal-700 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Mostrar error del hook si existe */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Mostrar error de no cambios */}
        {errores.general && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">{errores.general}</p>
          </div>
        )}

        {/* Body - FORMULARIO */}
        <div className="mt-4">
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
                    Apellido Materno *
                  </label>
                  <input
                    type="text"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={soloLetras}
                    className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Ej: García"
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
                    readOnly // ← Esto hace que sea de solo lectura
                    className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" // ← Cambia estilos para indicar que es solo lectura
                    placeholder="XXXXXXXXX"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    El carnet no se puede modificar
                  </p>
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
                      placeholder="YYYY-MM-DD"
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
                      placeholder="YYYY-MM-DD"
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
                        value="S"
                        checked={formData.amoblado === 'S'}
                        onChange={(e) => handleCheckboxChange('amoblado', e.target.value)}
                        className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500 dark:bg-gray-800 dark:border-teal-600"
                      />
                      <span className="text-sm text-teal-700 dark:text-teal-300">Sí</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="amoblado"
                        value="N"
                        checked={formData.amoblado === 'N'}
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
                        value="S"
                        checked={formData.banoPrivado === 'S'}
                        onChange={(e) => handleCheckboxChange('banoPrivado', e.target.value)}
                        className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500 dark:bg-gray-800 dark:border-teal-600"
                      />
                      <span className="text-sm text-teal-700 dark:text-teal-300">Sí</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="banoPrivado"
                        value="N"
                        checked={formData.banoPrivado === 'N'}
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
              <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={montoTotal === 0 || isUpdating}
              >
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Actualizando...</span>
                  </div>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}