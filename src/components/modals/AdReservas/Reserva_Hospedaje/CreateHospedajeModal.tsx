import { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaUpload, FaCopy, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaHome } from 'react-icons/fa';
import { Modal } from '../../../ui/modal';
import Button from '../../../ui/button/Button';
import { useCreateReserva } from '../../../../hooks/ReservasHospedaje/useCreateReserva';
import { useUploadComprobante } from '../../../../hooks/ReservasHospedaje/useUploadComprobante';
import { useObtenerTarifa } from '../../../../hooks/ReservasHospedaje/useObtenerTarifa';
import {
  validarNombreHospedaje,
  validarApellidos,
  validarTelefonoHospedaje,
  validarCarnetHospedaje,
  validarEmailHospedaje,
  validarCantidadPersonas,
  validarFormularioHospedaje,
  validarFechas,
  soloNumeros,
  soloLetras,
  bloquearEscrituraDirecta,
  validarEstructuraTexto,
  validarComprobante
} from '../../../../components/utils/validaciones';

interface HospedajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function HospedajeModal({ isOpen, onClose, onSuccess }: HospedajeModalProps) {
  const { crearReserva, isLoading, error, resetState } = useCreateReserva();
  const { subirComprobante, isLoading: isUploadingComprobante, error: uploadError } = useUploadComprobante();
  const { obtenerPrecioPorPersona, isLoading: isLoadingTarifas } = useObtenerTarifa();

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

  const [showCalendarInicio, setShowCalendarInicio] = useState(false);
  const [showCalendarFin, setShowCalendarFin] = useState(false);
  const [currentMonthInicio, setCurrentMonthInicio] = useState(new Date());
  const [currentMonthFin, setCurrentMonthFin] = useState(new Date());
  const [step, setStep] = useState<'form' | 'waiting' | 'payment' | 'success' | 'error'>('form');
  const [waitingTime, setWaitingTime] = useState(15);
  const [reservaGenId, setReservaGenId] = useState<number | null>(null);
  const [codigoReserva, setCodigoReserva] = useState('');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [errores, setErrores] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [montoTotal, setMontoTotal] = useState<number>(0);
  const [precioPorPersona, setPrecioPorPersona] = useState<number | null>(null);
  const [cantidadDias, setCantidadDias] = useState<number>(0);

  const [comprobanteError, setComprobanteError] = useState<string | null>(null);
  const [errorDetallado, setErrorDetallado] = useState<string>('');

  // Calcular cantidad de días (sin incluir el día de inicio)
  useEffect(() => {
    if (formData.fechaInicio && formData.fechaFin) {
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);
      const diferencia = fechaFin.getTime() - fechaInicio.getTime();
      const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
      setCantidadDias(dias > 0 ? dias : 0);
    } else {
      setCantidadDias(0);
    }
  }, [formData.fechaInicio, formData.fechaFin]);

  // Calcular el total: precio × personas × días
  useEffect(() => {
    const precio = obtenerPrecioPorPersona(formData.amoblado, formData.banoPrivado);
    setPrecioPorPersona(precio);

    if (precio && formData.cantidadPersonas && cantidadDias > 0) {
      const cantidad = parseInt(formData.cantidadPersonas);
      if (!isNaN(cantidad) && cantidad > 0) {
        setMontoTotal(precio * cantidad * cantidadDias);
      } else {
        setMontoTotal(0);
      }
    } else {
      setMontoTotal(0);
    }
  }, [formData.amoblado, formData.banoPrivado, formData.cantidadPersonas, cantidadDias, obtenerPrecioPorPersona]);

  useEffect(() => {
    if (step === 'waiting' && waitingTime > 0) {
      const timer = setTimeout(() => setWaitingTime(waitingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 'waiting' && waitingTime === 0) {
      setStep('payment');
    }
  }, [step, waitingTime]);

  const validarCampo = (nombre: string, valor: string) => {
    let error: string | null = null;

    switch (nombre) {
      case 'nombre':
        error = validarNombreHospedaje(valor);
        break;
      case 'apellidoPaterno':
      case 'apellidoMaterno':
        const erroresApellidos = validarApellidos(formData.apellidoPaterno, formData.apellidoMaterno);
        error = nombre === 'apellidoPaterno' ? erroresApellidos.paterno : erroresApellidos.materno;
        break;
      case 'telefono':
        error = validarTelefonoHospedaje(valor);
        break;
      case 'email':
        error = validarEmailHospedaje(valor);
        break;
      case 'carnet':
        error = validarCarnetHospedaje(valor);
        break;
      case 'cantidadPersonas':
        error = validarCantidadPersonas(valor);
        break;
      case 'fechaInicio':
      case 'fechaFin':
        const erroresFechas = validarFechas(
          nombre === 'fechaInicio' ? valor : formData.fechaInicio,
          nombre === 'fechaFin' ? valor : formData.fechaFin
        );
        error = nombre === 'fechaInicio' ? erroresFechas.inicio : erroresFechas.fin;
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let valorFinal = value;

    if (name === 'nombre' || name === 'apellidoPaterno' || name === 'apellidoMaterno') {
      valorFinal = value.replace(/^\s+/, '');
      valorFinal = valorFinal.replace(/\s{2,}/g, ' ');
    }

    if (name === 'telefono' && value.length > 8) {
      valorFinal = value.slice(0, 8);
    }
    if (name === 'carnet' && value.length > 9) {
      valorFinal = value.slice(0, 9);
    }
    if (name === 'cantidadPersonas') {
      valorFinal = value.replace(/\D/g, '').slice(0, 1);
    }

    setFormData(prev => ({ ...prev, [name]: valorFinal }));

    if (touched[name]) {
      const error = validarCampo(name, valorFinal);
      setErrores(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let valorLimpio = value;
    if (name === 'nombre' || name === 'apellidoPaterno' || name === 'apellidoMaterno') {
      valorLimpio = value.trim();
      setFormData(prev => ({ ...prev, [name]: valorLimpio }));
    }

    setTouched(prev => ({ ...prev, [name]: true }));
    let error = validarCampo(name, valorLimpio);

    if ((name === 'nombre' || name === 'apellidoPaterno' || name === 'apellidoMaterno') && valorLimpio && !error) {
      if (!validarEstructuraTexto(valorLimpio)) {
        error = `El ${name === 'nombre' ? 'nombre' : 'apellido'} no parece ser válido. Verifica que contenga letras reales.`;
      }
    }

    setErrores(prev => ({ ...prev, [name]: error }));
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
    const nuevaFechaInicio = type === 'inicio' ? date : formData.fechaInicio;
    const nuevaFechaFin = type === 'fin' ? date : formData.fechaFin;

    setFormData(prev => ({
      ...prev,
      [type === 'inicio' ? 'fechaInicio' : 'fechaFin']: date
    }));

    if (type === 'inicio') {
      setShowCalendarInicio(false);
    } else {
      setShowCalendarFin(false);
    }

    const erroresFechas = validarFechas(nuevaFechaInicio, nuevaFechaFin);
    setErrores(prev => ({
      ...prev,
      fechaInicio: erroresFechas.inicio,
      fechaFin: erroresFechas.fin
    }));

    setTouched(prev => ({
      ...prev,
      fechaInicio: nuevaFechaInicio ? true : prev.fechaInicio,
      fechaFin: nuevaFechaFin ? true : prev.fechaFin
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
            const isSelected = (type === 'inicio' && formData.fechaInicio === dateStr) || (type === 'fin' && formData.fechaFin === dateStr);

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
                className={`w-8 h-8 rounded text-sm font-medium transition ${isSelected
                    ? 'bg-teal-600 text-white'
                    : isToday
                      ? 'bg-teal-100 text-teal-700 border border-teal-600 dark:bg-teal-900 dark:text-teal-300'
                      : isDisabled
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-700 dark:text-gray-300'
                  }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = {
      nombre: true,
      apellidoPaterno: true,
      apellidoMaterno: true,
      telefono: true,
      email: true,
      carnet: true,
      fechaInicio: true,
      fechaFin: true,
      cantidadPersonas: true,
    };
    setTouched(allTouched);

    const erroresValidacion = validarFormularioHospedaje(formData);
    setErrores(erroresValidacion);

    const hayErrores = Object.values(erroresValidacion).some(error => error !== null);
    if (hayErrores) return;

    setStep('waiting');
    setWaitingTime(20);

    try {
      const result = await crearReserva(formData);
      if (result && result.reserva_gen_id) {
        setReservaGenId(result.reserva_gen_id);
      } else {
        throw new Error('No se recibió el ID de la reserva del servidor');
      }
    } catch (err) {
      console.error('Error en el submit:', err);
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido al procesar la reserva';
      setErrorDetallado(errorMsg);
      setStep('error');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setComprobanteError(null);

    if (!file) {
      setComprobante(null);
      return;
    }

    const error = validarComprobante(file);

    if (error) {
      setComprobanteError(error);
      event.target.value = '';
      setComprobante(null);
      return;
    }

    setComprobante(file);
    setComprobanteError(null);
  };

  const handleUploadComprobante = async () => {
    if (!comprobante || reservaGenId === null) {
      console.error('Falta comprobante o reservaGenId');
      return;
    }

    try {
      const result = await subirComprobante(reservaGenId, comprobante);
      setCodigoReserva(result.reserva_gen_id?.toString() || '');
      setStep('success');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error uploading comprobante:', err);
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
    setStep('form');
    setComprobante(null);
    setReservaGenId(null);
    setCodigoReserva('');
    setCopiado(false);
    setErrores({});
    setTouched({});
    setMontoTotal(0);
    setPrecioPorPersona(null);
    setCantidadDias(0);
    setErrorDetallado('');
    resetState();
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

  // Resetear formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      resetearFormulario();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Pantalla de error
  if (step === 'error') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
        <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
          <div className="flex items-center justify-between border-b px-4 py-3 rounded-t-2xl bg-red-500 dark:bg-red-600 mb-6">
            <h2 className="text-xl font-bold text-white">Error en la Reserva</h2>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-red-600 dark:hover:bg-red-700 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimes className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">No se pudo procesar tu reserva</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Lo sentimos, ha ocurrido un problema</p>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4 text-left">
              <p className="text-sm text-red-900 dark:text-red-300 font-semibold mb-2">Detalles del error:</p>
              <p className="text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap">{errorDetallado}</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 text-left mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Sugerencias:</strong>
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-blue-800 dark:text-blue-300 text-sm">
                <li>Verifica que las fechas seleccionadas estén disponibles</li>
                <li>Intenta con otra configuración de habitación</li>
                <li>Si el problema persiste, contacta con soporte</li>
              </ul>
            </div>


            <Button variant="primary" onClick={resetearFormulario} className="w-full">
              Volver a intentar
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (step === 'waiting') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
        <div className="relative w-full p-8 bg-white rounded-2xl dark:bg-gray-900 text-center">
          <div className="relative mb-6">
            <div className="bg-teal-100 dark:bg-teal-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <FaHome className="w-10 h-10 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-teal-200 dark:border-teal-800 border-t-teal-500 dark:border-t-teal-400 rounded-full animate-spin"></div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-3">Analizando tu Solicitud</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Por favor espera mientras verificamos los requisitos y disponibilidad de habitaciones
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 text-left mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 Tu reserva está siendo procesada. Espera un momento por favor.
            </p>
          </div>

          <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">{waitingTime}s</div>
        </div>
      </Modal>
    );
  }

  if (step === 'payment') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
        <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
          <div className="flex items-center justify-between border-b px-4 py-3 rounded-t-2xl bg-teal-500 dark:bg-teal-600 mb-6">
            <h2 className="text-xl font-bold text-white">Realizar Pago</h2>
            <button
              onClick={() => setStep('form')}
              className="p-2 text-white hover:bg-teal-600 dark:hover:bg-teal-700 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaHome className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Realizar Pago</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Confirma tu reserva con el 50% de adelanto</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <img
                  src="../images/ReservaPagos/ResHotel1.jpg"
                  alt="Código QR de pago"
                  className="w-full max-w-xs mx-auto rounded-xl"
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Escanea con tu aplicación bancaria</p>
                <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <p className="text-xs font-semibold">Altoke - Pago seguro</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-teal-100 dark:border-teal-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Monto a pagar:</p>
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

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-800 p-1 rounded-full mt-0.5">
                    <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Importante</p>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      El restante 50% ({(montoTotal * 0.5).toFixed(2)} Bs.) se pagará en recepción
                    </p>
                  </div>
                </div>
              </div>

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

                {comprobanteError && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <FaTimes className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{comprobanteError}</p>
                  </div>
                )}

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

              <Button
                onClick={handleUploadComprobante}
                disabled={!comprobante || isUploadingComprobante}
                variant="primary"
                className="w-full py-4"
              >
                {isUploadingComprobante ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando comprobante...</span>
                  </div>
                ) : (
                  'Confirmar Pago'
                )}
              </Button>

              {uploadError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl">
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <FaTimes className="w-4 h-4" />
                    Error al subir comprobante
                  </div>
                  <p>{uploadError}</p>
                </div>
              )}
            </div>
          </div>

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
      </Modal>
    );
  }

  if (step === 'success') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
        <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 text-center">
          <div className="flex items-center justify-between border-b px-4 py-3 rounded-t-2xl bg-green-500 dark:bg-green-600 mb-6">
            <h2 className="text-xl font-bold text-white">Reserva Exitosa</h2>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-green-600 dark:hover:bg-green-700 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">¡Reserva Exitosa!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Tu pago del 50% ha sido recibido correctamente</p>

          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-6 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tu código de reserva es:</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl font-bold text-teal-700 dark:text-teal-300 tracking-wider">{codigoReserva}</p>
              <button onClick={copiarCodigo} className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition" title="Copiar código">
                {copiado ? <FaCheck className="w-4 h-4" /> : <FaCopy className="w-4 h-4" />}
              </button>
            </div>
            {copiado && <p className="text-xs text-teal-600 dark:text-teal-400 mt-2">✓ Copiado</p>}
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 text-left mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-300 font-semibold">Importante: Guarda este código.</p>
          </div>

          <Button variant="primary" onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </div>
      </Modal>
    );
  }

  // STEP: FORM (formulario principal)
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 rounded-t-2xl bg-teal-500 dark:bg-teal-600 mb-6">
          <h2 className="text-xl font-bold text-white">Reserva de Hospedaje</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-teal-600 dark:hover:bg-teal-700 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-4">
          <div className="text-center mb-8">
            <div className="bg-teal-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHome className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-teal-800 dark:text-teal-400">Reserva de Hospedaje</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Completa el formulario para realizar tu solicitud</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
              <div className="flex items-start gap-2">
                <FaTimes className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Error al procesar la reserva</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos Personales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-400 border-b pb-2 border-teal-200 dark:border-teal-700">
                Datos Personales
              </h3>

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
                      if (
                        !/^[0-9]$/.test(e.key) &&
                        ![
                          'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                          'ArrowLeft', 'ArrowRight', 'Home', 'End'
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData('text');
                      if (!/^\d*$/.test(pastedText)) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={8}
                    className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="7XXXXXXX"
                    inputMode="numeric"
                  />
                  {errores.telefono && <p className="text-xs text-red-500 mt-1">{errores.telefono}</p>}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                    Carnet de Identidad *
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
                  className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition ${errores.email && touched.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-teal-300 dark:border-teal-600 focus:ring-teal-500'
                    }`}
                  placeholder="juan@email.com"
                />
                {errores.email && <p className="text-xs text-red-500 mt-1">{errores.email}</p>}
              </div>
            </div>

            {/* Detalles de la Reserva */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-400 border-b pb-2 border-teal-200 dark:border-teal-700">
                Detalles de la Reserva
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="calendar-container relative">
                  <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                    Fecha de Inicio *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={formData.fechaInicio}
                      onClick={() => {
                        setShowCalendarInicio(!showCalendarInicio);
                        setShowCalendarFin(false);
                        setCurrentMonthInicio(new Date());
                      }}
                      className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer pr-10"
                      placeholder="Selecciona fecha"
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
                  </div>
                  {errores.fechaInicio && <p className="text-xs text-red-500 mt-1">{errores.fechaInicio}</p>}
                  {showCalendarInicio && renderCalendar('inicio')}
                </div>

                <div className="calendar-container relative">
                  <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                    Fecha de Fin *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={formData.fechaFin}
                      onClick={() => {
                        setShowCalendarFin(!showCalendarFin);
                        setShowCalendarInicio(false);
                        setCurrentMonthFin(new Date());
                      }}
                      className="w-full rounded-lg border border-teal-300 dark:border-teal-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer pr-10"
                      placeholder="Selecciona fecha"
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
                  </div>
                  {errores.fechaFin && <p className="text-xs text-red-500 mt-1">{errores.fechaFin}</p>}
                  {showCalendarFin && renderCalendar('fin')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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

              <div>
                <label className="block mb-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                  Cantidad de Personas *
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

              <div className="mt-6 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border-2 border-teal-200 dark:border-teal-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-teal-700 dark:text-teal-300 mb-1">Monto Total a Pagar</p>
                    {precioPorPersona && formData.cantidadPersonas && cantidadDias > 0 && (
                      <p className="text-xs text-teal-600 dark:text-teal-400">
                        {precioPorPersona.toFixed(2)} Bs. × {formData.cantidadPersonas} persona(s) × {cantidadDias} día(s)
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-teal-700 dark:text-teal-300">
                        {montoTotal.toFixed(2)}
                      </span>
                      <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">Bs.</span>
                    </div>
                    {montoTotal > 0 && (
                      <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                        Adelanto (50%): {(montoTotal * 0.5).toFixed(2)} Bs.
                      </p>
                    )}
                  </div>
                </div>

                {!precioPorPersona && formData.cantidadPersonas && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      ⚠️ Configuración seleccionada:
                      {formData.amoblado === 'si' ? ' Amoblado' : ' Sin amoblar'} +
                      {formData.banoPrivado === 'si' ? ' Baño privado' : ' Baño compartido'}
                    </p>
                  </div>
                )}

                {cantidadDias === 0 && formData.fechaInicio && formData.fechaFin && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      ⚠️ La fecha de fin debe ser posterior a la fecha de inicio
                    </p>
                  </div>
                )}

                {!formData.fechaInicio && !formData.fechaFin && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-teal-600 dark:text-teal-400">
                      📅 Selecciona las fechas de inicio y fin
                    </p>
                  </div>
                )}

                {isLoadingTarifas && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-teal-600 dark:text-teal-400">Cargando tarifas...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading || montoTotal === 0}
              >
                {isLoading ? 'Enviando...' : montoTotal === 0 ? 'Complete el formulario' : 'Enviar Solicitud'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}