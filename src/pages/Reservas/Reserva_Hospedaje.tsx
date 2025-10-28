import { useState, useEffect } from 'react';
import { Home, ChevronLeft, ChevronRight, X, Upload, Copy, Check } from 'lucide-react';
import { useCreateReserva } from '../../hooks/ReservasHospedaje/useCreateReserva';
import { useUploadComprobante } from '../../hooks/ReservasHospedaje/useUploadComprobante';
import { useObtenerTarifa } from '../../hooks/ReservasHospedaje/useObtenerTarifa';
// 1. Importa la función validarFechas en tu componente Hospedaje
import {
  validarNombreHospedaje,
  validarApellidos,
  validarTelefonoHospedaje,
  validarCarnetHospedaje,
  validarEmailHospedaje,
  validarCantidadPersonas,
  validarFormularioHospedaje,
  validarFechas, // <- Agregar esta importación
  soloNumeros,
  soloLetras,
  bloquearEscrituraDirecta,
  validarEstructuraTexto,
  validarComprobante
} from '../../components/utils/validaciones';

export default function Hospedaje() {
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [step, setStep] = useState<'form' | 'waiting' | 'payment' | 'success'>('form');
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

  // Calcular cantidad de días (inclusivo: cuenta tanto el día de inicio como el de fin)
  useEffect(() => {
    if (formData.fechaInicio && formData.fechaFin) {
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);
      const diferencia = fechaFin.getTime() - fechaInicio.getTime();
      const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1; // +1 para contar inclusivamente
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

  // 2. Modifica la función validarCampo para incluir las validaciones de fecha
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
    // NUEVAS VALIDACIONES DE FECHAS
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
  
  // Limpieza de espacios para campos de texto (nombre y apellidos)
  if (name === 'nombre' || name === 'apellidoPaterno' || name === 'apellidoMaterno') {
    // Eliminar espacios al inicio
    valorFinal = value.replace(/^\s+/, '');
    // Reemplazar múltiples espacios consecutivos por uno solo
    valorFinal = valorFinal.replace(/\s{2,}/g, ' ');
  }
  
  if (name === 'telefono' && value.length > 8) {
    valorFinal = value.slice(0, 8);
  }
  if (name === 'carnet' && value.length > 9) {
    valorFinal = value.slice(0, 9);
  }
    // Para cantidad de personas, limitar a 1 dígito
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
  
  // Limpiar espacios al final cuando pierde el foco
  let valorLimpio = value;
  if (name === 'nombre' || name === 'apellidoPaterno' || name === 'apellidoMaterno') {
    valorLimpio = value.trim(); // Elimina espacios al inicio Y al final
    // Actualizar el formData con el valor limpio
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

 const handleDateSelect = (date: string, type: 'inicio' | 'fin') => {
  // Actualizar formData primero
  const nuevaFechaInicio = type === 'inicio' ? date : formData.fechaInicio;
  const nuevaFechaFin = type === 'fin' ? date : formData.fechaFin;
  
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
  
  // Validar AMBAS fechas siempre
  const erroresFechas = validarFechas(nuevaFechaInicio, nuevaFechaFin);
  setErrores(prev => ({ 
    ...prev, 
    fechaInicio: erroresFechas.inicio,
    fechaFin: erroresFechas.fin
  }));
  
  // Marcar ambos campos como tocados si tienen valor
  setTouched(prev => ({ 
    ...prev, 
    fechaInicio: nuevaFechaInicio ? true : prev.fechaInicio,
    fechaFin: nuevaFechaFin ? true : prev.fechaFin
  }));
};

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

const renderCalendar = (type: 'inicio' | 'fin') => {
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
  const maxInicio = new Date(today);
  maxInicio.setFullYear(maxInicio.getFullYear() + 3);

  const isCurrentMonth =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold">
          {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </span>
        <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600">{day}</div>
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
          
          // Deshabilitar según el tipo de calendario
          let isDisabled = false;
          if (type === 'inicio') {
            // Para inicio: deshabilitar HOY y fechas anteriores, permitir desde MAÑANA
            isDisabled = dateObj < today || dateObj > maxInicio; // ✅ CAMBIO: < en lugar de <=
          } else {
            // Para fin: validar según fecha de inicio si existe
            if (formData.fechaInicio) {
              const inicioDate = new Date(formData.fechaInicio);
              inicioDate.setHours(0, 0, 0, 0);
              const maxFin = new Date(inicioDate);
              maxFin.setFullYear(maxFin.getFullYear() + 3);
              
              isDisabled = dateObj <= inicioDate || dateObj > maxFin; // ✅ Aquí sí usa <= porque debe ser DESPUÉS de inicio
            } else {
              // Si no hay fecha de inicio, deshabilitar hoy y fechas pasadas
              isDisabled = dateObj <= today;
            }
          }

          return (
            <button 
              key={day} 
              type="button" 
              onClick={() => !isDisabled && handleDateSelect(dateStr, type)} 
              disabled={isDisabled} 
              className={`w-10 h-10 rounded text-sm font-medium transition ${
                isSelected 
                  ? 'bg-teal-600 text-white' 
                  : isToday 
                    ? 'bg-teal-100 text-teal-700 border border-teal-600' 
                    : isDisabled 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'hover:bg-gray-100'
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
    setWaitingTime(30);

    try {
      const result = await crearReserva(formData);
      if (result && result.reserva_gen_id) {
        setReservaGenId(result.reserva_gen_id);
      } else {
        throw new Error('No se recibió el ID de la reserva del servidor');
      }
    } catch (err) {
      console.error('Error en el submit:', err);
      setStep('form');
    }
  };

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  
  // Limpiar error previo
  setComprobanteError(null);
  
  if (!file) {
    setComprobante(null);
    return;
  }

  // Usar la validación separada
  const error = validarComprobante(file);
  
  if (error) {
    setComprobanteError(error);
    event.target.value = ''; // Limpiar el input
    setComprobante(null);
    return;
  }

  // Si pasa la validación, guardar el archivo y limpiar error
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
    resetState();
  };

  if (step === 'waiting') {
    return (
      <div className="min-h-screen bg-teal-50 p-6 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="relative mb-6">
            <div className="bg-teal-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <svg className="w-16 h-16 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-teal-800 mb-3">Analizando tu Solicitud</h2>
          <p className="text-gray-600 mb-8">Por favor espera mientras verificamos los requisitos y disponibilidad de habitaciones</p>
          <div className="text-5xl font-bold text-teal-600">{waitingTime}s</div>
        </div>
      </div>
    );
  }

if (step === 'payment') {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 relative">
        <button 
          onClick={() => setStep('form')} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header mejorado */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Home className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Realizar Pago</h2>
          <p className="text-gray-600 text-lg">Confirma tu reserva con el 50% de adelanto</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Sección QR - Mejorada */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <img 
                src="../images/ReservaPagos/ResHotel1.jpg" 
                alt="Código QR de pago" 
                className="w-full max-w-xs mx-auto rounded-xl"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-gray-600 text-sm font-medium">Escanea con tu aplicación bancaria</p>
              <div className="flex items-center justify-center gap-2 text-teal-600">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <p className="text-xs font-semibold">Altoke - Pago seguro</p>
              </div>
            </div>
          </div>

          {/* Sección Información de Pago - Mejorada */}
          <div className="space-y-6">
            {/* Monto a Pagar */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Monto a pagar:</p>
                  <p className="text-xs text-gray-500">50% de adelanto</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-teal-700">
                    {(montoTotal * 0.5).toFixed(2)}
                  </p>
                  <p className="text-lg font-semibold text-teal-600">Bs.</p>
                </div>
              </div>
            </div>

            {/* Información Importante */}
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-1 rounded-full mt-0.5">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">Importante</p>
                  <p className="text-sm text-amber-700">
                    El restante 50% ({(montoTotal * 0.5).toFixed(2)} Bs.) se pagará en recepción
                  </p>
                </div>
              </div>
            </div>

            {/* Comprobante de Pago - Mejorado */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Comprobante de Pago *
              </label>
              
              <div className={`
                border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
                ${comprobanteError 
                  ? 'border-red-300 bg-red-50' 
                  : comprobante
                    ? 'border-teal-300 bg-teal-50'
                    : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50'
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
                    <div className="text-teal-600 space-y-2">
                      <Check className="w-12 h-12 mx-auto" />
                      <p className="font-semibold text-lg">✓ Archivo seleccionado</p>
                      <p className="text-sm text-teal-700 truncate">{comprobante.name}</p>
                      <p className="text-xs text-teal-600 mt-2">
                        {(comprobante.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-500 space-y-3">
                      <Upload className="w-12 h-12 mx-auto" />
                      <div>
                        <p className="font-semibold text-teal-600 text-lg">Seleccionar archivo</p>
                        <p className="text-sm text-gray-500 mt-1">JPG, PNG o PDF (máx. 5MB)</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
              
              {/* Mensaje de error mejorado */}
              {comprobanteError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{comprobanteError}</p>
                </div>
              )}

              {/* Información de tipos de archivo */}
              <div className="flex flex-wrap gap-4 justify-center text-xs text-gray-500">
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
            <button 
              onClick={handleUploadComprobante} 
              disabled={!comprobante || isUploadingComprobante}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg transition-all
                ${comprobante && !isUploadingComprobante 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isUploadingComprobante ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando comprobante...</span>
                </div>
              ) : (
                'Confirmar Pago'
              )}
            </button>

            {/* Error de subida */}
            {uploadError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <X className="w-4 h-4" />
                  Error al subir comprobante
                </div>
                <p>{uploadError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional en la parte inferior */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
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
    </div>
  );
}
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center relative">
          <button onClick={resetearFormulario} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" title="Cerrar">
            <X className="w-6 h-6" />
          </button>

          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-teal-800 mb-2">¡Reserva Exitosa!</h2>
          <p className="text-gray-600 mb-6">Tu pago del 50% ha sido recibido correctamente</p>

          <div className="bg-teal-50 rounded-lg p-6 mb-4">
            <p className="text-sm text-gray-600 mb-2">Tu código de reserva es:</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-4xl font-bold text-teal-700 tracking-wider">{codigoReserva}</p>
              <button onClick={copiarCodigo} className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition" title="Copiar código">
                {copiado ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copiado && <p className="text-xs text-teal-600 mt-2">✓ Copiado</p>}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left mb-6">
            <p className="text-sm text-yellow-800 font-semibold">Importante: Guarda este código.</p>
          </div>

          <button onClick={resetearFormulario} className="w-full bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg transition font-semibold">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-teal-800">Reserva de Hospedaje</h2>
          <p className="text-gray-600 mt-2">Completa el formulario para realizar tu solicitud</p>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">Error: {error}</div>}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-teal-800 border-b pb-2">Datos Personales</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} onKeyDown={soloLetras} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Ej: Juan" />
                  {errores.nombre && <p className="text-xs text-red-600 mt-1">{errores.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
                  <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} onBlur={handleBlur} onKeyDown={soloLetras} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Ej: Pérez" />
                  {errores.apellidoPaterno && <p className="text-xs text-red-600 mt-1">{errores.apellidoPaterno}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
                  <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} onBlur={handleBlur} onKeyDown={soloLetras} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Ej: García" />
                  {errores.apellidoMaterno && <p className="text-xs text-red-600 mt-1">{errores.apellidoMaterno}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input 
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    // Solo permitir números y teclas de control
                    if (
                      !/^[0-9]$/.test(e.key) && // No es un número del 0-9
                      ![
                        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                        'ArrowLeft', 'ArrowRight', 'Home', 'End'
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    // Validar contenido pegado
                    const pastedText = e.clipboardData.getData('text');
                    if (!/^\d*$/.test(pastedText)) {
                      e.preventDefault();
                    }
                  }}
                  maxLength={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                  placeholder="7XXXXXXX"
                  inputMode="numeric" // Muestra teclado numérico en móviles
                />
                {errores.telefono && <p className="text-xs text-red-600 mt-1">{errores.telefono}</p>}
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad *</label>
                  <input type="text" name="carnet" value={formData.carnet} onChange={handleChange} onBlur={handleBlur} onKeyDown={soloNumeros} maxLength={9} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="XXXXXXXXX" />
                  {errores.carnet && <p className="text-xs text-red-600 mt-1">{errores.carnet}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
               <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  // Prevenir la tecla espacio
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                  errores.email && touched.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-cyan-500'
                }`}
                placeholder="juan@email.com"
              />
                {errores.email && <p className="text-xs text-red-600 mt-1">{errores.email}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-teal-800 border-b pb-2">Detalles de la Reserva</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio *</label>
                  <input type="text" readOnly value={formData.fechaInicio} onClick={() => { setShowCalendarInicio(!showCalendarInicio); setShowCalendarFin(false); setCurrentMonth(new Date()); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer bg-white" placeholder="Selecciona fecha" />
                  {errores.fechaInicio && <p className="text-xs text-red-600 mt-1">{errores.fechaInicio}</p>}
                  {showCalendarInicio && <div className="absolute top-full mt-2 left-0 z-10">{renderCalendar('inicio')}</div>}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin *</label>
                  <input type="text" readOnly value={formData.fechaFin} onClick={() => { setShowCalendarFin(!showCalendarFin); setShowCalendarInicio(false); setCurrentMonth(new Date()); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer bg-white" placeholder="Selecciona fecha" />
                  {errores.fechaFin && <p className="text-xs text-red-600 mt-1">{errores.fechaFin}</p>}
                  {showCalendarFin && <div className="absolute top-full mt-2 left-0 z-10">{renderCalendar('fin')}</div>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">¿Habitación Amoblada? *</p>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="amoblado" value="si" checked={formData.amoblado === 'si'} onChange={(e) => handleCheckboxChange('amoblado', e.target.value)} className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                      <span>Sí</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="amoblado" value="no" checked={formData.amoblado === 'no'} onChange={(e) => handleCheckboxChange('amoblado', e.target.value)} className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">¿Baño Privado? *</p>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="banoPrivado" value="si" checked={formData.banoPrivado === 'si'} onChange={(e) => handleCheckboxChange('banoPrivado', e.target.value)} className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                      <span>Sí</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="banoPrivado" value="no" checked={formData.banoPrivado === 'no'} onChange={(e) => handleCheckboxChange('banoPrivado', e.target.value)} className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Personas *</label>
                <input type="number" name="cantidadPersonas" value={formData.cantidadPersonas} onChange={handleChange} onBlur={handleBlur} onKeyDown={(e) => { soloNumeros(e); bloquearEscrituraDirecta(e); }} maxLength={1} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden" placeholder="Ej: 1" />
                {errores.cantidadPersonas && <p className="text-xs text-red-600 mt-1">{errores.cantidadPersonas}</p>}
              </div>

              <div className="mt-6 bg-teal-50 rounded-xl p-6 border-2 border-teal-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monto Total a Pagar</p>
                    {precioPorPersona && formData.cantidadPersonas && cantidadDias > 0 && (
                      <p className="text-xs text-gray-500">
                        {precioPorPersona.toFixed(2)} Bs. × {formData.cantidadPersonas} persona(s) × {cantidadDias} día(s)
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-teal-700">
                        {montoTotal.toFixed(2)}
                      </span>
                      <span className="text-lg font-semibold text-teal-600">Bs.</span>
                    </div>
                    {montoTotal > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Adelanto (50%): {(montoTotal * 0.5).toFixed(2)} Bs.
                      </p>
                    )}
                  </div>
                </div>

                {!precioPorPersona && formData.cantidadPersonas && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-amber-600">
                      ⚠️ Configuración seleccionada: 
                      {formData.amoblado === 'si' ? ' Amoblado' : ' Sin amoblar'} + 
                      {formData.banoPrivado === 'si' ? ' Baño privado' : ' Baño compartido'}
                    </p>
                  </div>
                )}

                {cantidadDias === 0 && formData.fechaInicio && formData.fechaFin && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-red-600">
                      ⚠️ La fecha de fin debe ser posterior a la fecha de inicio
                    </p>
                  </div>
                )}

                {!formData.fechaInicio && !formData.fechaFin && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-500">
                      📅 Selecciona las fechas de inicio y fin
                    </p>
                  </div>
                )}

                {isLoadingTarifas && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-500">Cargando tarifas...</p>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={isLoading || montoTotal === 0} className={`w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg transition font-semibold text-lg ${(isLoading || montoTotal === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isLoading ? 'Enviando...' : montoTotal === 0 ? 'Complete el formulario' : 'Enviar Solicitud'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}