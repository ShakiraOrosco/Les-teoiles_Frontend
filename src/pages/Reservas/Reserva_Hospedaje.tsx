import { useState, useEffect } from 'react';
import { Home, ChevronLeft, ChevronRight, X, Upload, Copy, Check } from 'lucide-react';
import { useCreateReserva } from '../../hooks/Reservas/useCreateReserva';
import { useUploadComprobante } from '../../hooks/Reservas/useUploadComprobante';
import {
  validarNombreHospedaje,
  validarApellidos,
  validarTelefonoHospedaje,
  validarCarnetHospedaje,
  validarEmailHospedaje,
  validarCantidadPersonas,
  validarFechas,
  validarFormularioHospedaje,
  soloNumeros,
  soloLetras,
  bloquearEscrituraDirecta,
  validarEstructuraTexto,
} from '../../components/utils/validaciones';

export default function Hospedaje() {
  const { crearReserva, isLoading, error, resetState } = useCreateReserva();
  const { subirComprobante, isLoading: isUploadingComprobante, error: uploadError, success: uploadSuccess } = useUploadComprobante();

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

  useEffect(() => {
    if (step === 'waiting' && waitingTime > 0) {
      const timer = setTimeout(() => setWaitingTime(waitingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 'waiting' && waitingTime === 0) {
      setStep('payment');
    }
  }, [step, waitingTime]);

  // Validar campo individual
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
    }
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let valorFinal = value;
    
    // Para teléfono y carnet, limitar dígitos
    if (name === 'telefono' && value.length > 8) {
      valorFinal = value.slice(0, 8);
    }
    if (name === 'carnet' && value.length > 12) {
      valorFinal = value.slice(0, 12);
    }
    
    setFormData(prev => ({ ...prev, [name]: valorFinal }));
    
    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const error = validarCampo(name, valorFinal);
      setErrores(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    let error = validarCampo(name, value);
    
    // Validar estructura para nombre y apellidos
    if ((name === 'nombre' || name === 'apellidoPaterno' || name === 'apellidoMaterno') && value.trim() && !error) {
      if (!validarEstructuraTexto(value)) {
        error = `El ${name === 'nombre' ? 'nombre' : 'apellido'} no parece ser válido. Verifica que contenga letras reales.`;
      }
    }
    
    setErrores(prev => ({ ...prev, [name]: error }));
  };

  const handleCheckboxChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: string, type: 'inicio' | 'fin') => {
    if (type === 'inicio') {
      setFormData(prev => ({ ...prev, fechaInicio: date }));
      setShowCalendarInicio(false);
    } else {
      setFormData(prev => ({ ...prev, fechaFin: date }));
      setShowCalendarFin(false);
    }
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
    const isCurrentMonth =
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear();

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold">
            {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} />;
            }

            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = isCurrentMonth && day === today.getDate();
            const isSelected =
              (type === 'inicio' && formData.fechaInicio === dateStr) ||
              (type === 'fin' && formData.fechaFin === dateStr);
            const isPast = isCurrentMonth && day < today.getDate();

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDateSelect(dateStr, type)}
                disabled={isPast}
                className={`w-10 h-10 rounded text-sm font-medium transition ${
                  isSelected
                    ? 'bg-teal-600 text-white'
                    : isToday
                    ? 'bg-teal-100 text-teal-700 border border-teal-600'
                    : isPast
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
    
    // Marcar todos los campos como tocados
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
    
    // Validar todo el formulario
    const erroresValidacion = validarFormularioHospedaje(formData);
    setErrores(erroresValidacion);
    
    // Si hay errores, no continuar
    const hayErrores = Object.values(erroresValidacion).some(error => error !== null);
    if (hayErrores) {
      return;
    }
    
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setComprobante(e.target.files[0]);
    }
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
    resetState();
  };

  if (step === 'waiting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 to-teal-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-teal-100 rounded-full mb-4">
              <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-teal-900 mb-2">Analizando tu Solicitud</h2>
          <p className="text-gray-600 mb-6">Por favor espera mientras verificamos los requisitos y disponibilidad de habitaciones</p>
          <div className="text-4xl font-bold text-teal-600">{waitingTime}s</div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 to-teal-50 p-4">
        <div className="w-full max-w-2xl relative">
          <button onClick={() => setStep('form')} className="absolute -top-10 right-0 text-gray-400 hover:text-gray-600 transition z-50">
            <X className="w-6 h-6" />
          </button>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="text-center pt-8 pb-6 px-8">
              <h2 className="text-4xl font-bold text-teal-900 mb-2">Realizar Pago</h2>
              <p className="text-gray-600">Necesitamos el 50% de adelanto para confirmar tu reserva</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-8 pt-0">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-teal-400/30 rounded-2xl blur-2xl"></div>
                  <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-cyan-100/50">
                    <img src="../images/ReservaPagos/ResHotel1.jpg" alt="Código QR de pago" className="w-56 h-56 rounded-xl" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Escanea con tu aplicación bancaria</p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>Altoke - Pago seguro</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 mb-6 border border-teal-200/50 text-center w-fit mx-auto">
                  <p className="text-sm text-gray-600 mb-2">Monto a pagar:</p>
                  <div className="flex items-baseline gap-2 mb-2 justify-center">
                    <span className="text-4xl font-bold text-teal-700">250.00</span>
                    <span className="text-lg font-semibold text-teal-600">Bs.</span>
                  </div>
                  <p className="text-xs text-gray-500">(50% de adelanto)</p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mb-6">
                  <p className="text-sm text-amber-900"><strong>Importante:</strong> El restante 50% se pagará en recepción</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Comprobante de Pago *</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/40 to-teal-200/40 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative border-2 border-dashed border-gray-300 group-hover:border-teal-400 rounded-xl p-6 text-center transition-all duration-300 bg-white group-hover:bg-teal-50/50">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2 group-hover:text-teal-500 transition" />
                      <input type="file" onChange={handleFileChange} accept="image/*,.pdf" className="hidden" id="comprobante" />
                      <label htmlFor="comprobante" className="cursor-pointer">
                        <span className="text-teal-600 hover:text-teal-700 font-semibold">Seleccionar archivo</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG o PDF (máx. 5MB)</p>
                      {comprobante && (
                        <div className="flex items-center justify-center gap-2 mt-2 text-teal-600 font-medium">
                          <Check className="w-5 h-5" />
                          <span className="text-sm">✓ {comprobante.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button onClick={handleUploadComprobante} disabled={!comprobante || isUploadingComprobante} className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${comprobante && !isUploadingComprobante ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  {isUploadingComprobante ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </div>
                  ) : (
                    'Confirmar Pago'
                  )}
                </button>

                {uploadError && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg">Error: {uploadError}</div>}
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 px-8 py-4 text-center border-t border-gray-100">
              <p className="text-xs text-gray-600">💳 Pago 100% seguro • Los datos están protegidos</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 to-teal-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative">
          <button onClick={resetearFormulario} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" title="Cerrar">
            <X className="w-6 h-6" />
          </button>

          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-teal-900 mb-2">¡Reserva Exitosa!</h2>
          <p className="text-gray-600 mb-6">Tu pago del 50% ha sido recibido correctamente</p>

          <div className="bg-teal-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Tu código de reserva es:</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-mono font-bold text-teal-900">{codigoReserva}</p>
              <button onClick={copiarCodigo} className="p-2 hover:bg-teal-100 rounded-lg transition" title="Copiar código">
                {copiado ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-teal-600" />}
              </button>
            </div>
            {copiado && <p className="text-sm text-green-600 mt-2">¡Código copiado!</p>}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
            <p className="text-sm text-yellow-800"><strong>Importante:</strong> Guarda este código. El personal de administración verificará tu pago dentro de 24 horas.</p>
          </div>

          <button onClick={resetearFormulario} className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-teal-900">Reserva de Hospedaje</h2>
        <p className="text-gray-600 mt-2">Completa el formulario para realizar tu solicitud</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">Error: {error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-900 border-b pb-2">Datos Personales</h3>

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
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} onBlur={handleBlur} onKeyDown={soloNumeros} maxLength={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="7XXXXXXX" />
              {errores.telefono && <p className="text-xs text-red-600 mt-1">{errores.telefono}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad *</label>
              <input type="text" name="carnet" value={formData.carnet} onChange={handleChange} onBlur={handleBlur} onKeyDown={soloNumeros} maxLength={12} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="XXXXXXXX" />
              {errores.carnet && <p className="text-xs text-red-600 mt-1">{errores.carnet}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="ejemplo@correo.com" />
            {errores.email && <p className="text-xs text-red-600 mt-1">{errores.email}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-900 border-b pb-2">Detalles de la Reserva</h3>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Personas *</label>
            <input type="number" name="cantidadPersonas" value={formData.cantidadPersonas} onChange={handleChange} onBlur={handleBlur} onKeyDown={(e) => { soloNumeros(e); bloquearEscrituraDirecta(e); }} min="1" max="5" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden" placeholder="Ej: 1" />
            {errores.cantidadPersonas && <p className="text-xs text-red-600 mt-1">{errores.cantidadPersonas}</p>}
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
        </div>

        <button type="submit" disabled={isLoading} className={`w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </form>
    </>
  );
}