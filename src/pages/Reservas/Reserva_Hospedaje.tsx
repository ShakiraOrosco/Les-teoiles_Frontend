import { useState, useEffect } from 'react';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCreateReserva } from '../../hooks/Reservas/useCreateReserva';

export default function Hospedaje() {
  const { crearReserva, isLoading, error, success, resetState } = useCreateReserva();

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCalendarInicio, setShowCalendarInicio] = useState(false);
  const [showCalendarFin, setShowCalendarFin] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setErrors({});
        resetState();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, resetState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    try {
      await crearReserva(formData);
    } catch (err) {
      console.error('Error en el submit:', err);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-teal-900">Reserva de Hospedaje</h2>
        <p className="text-gray-600 mt-2">Completa el formulario para realizar tu solicitud</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ¡Reserva creada exitosamente! Te contactaremos pronto.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Personales */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-900 border-b pb-2">
            Datos Personales
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ej: Juan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido Paterno
              </label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ej: Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido Materno
              </label>
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ej: García"
              />
            </div>
          </div>

          {errors.apellidos && (
            <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{errors.apellidos}</p>
          )}

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="7XXXXXXX"
              />
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="XXXXXXXX"
              />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="ejemplo@correo.com"
            />
          </div>
        </div>

        {/* Detalles de la Reserva */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-900 border-b pb-2">
            Detalles de la Reserva
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio *
              </label>
              <input
                type="text"
                readOnly
                value={formData.fechaInicio}
                onClick={() => {
                  setShowCalendarInicio(!showCalendarInicio);
                  setShowCalendarFin(false);
                  setCurrentMonth(new Date());
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer bg-white"
                placeholder="Selecciona fecha"
              />
              {showCalendarInicio && (
                <div className="absolute top-full mt-2 left-0 z-10">
                  {renderCalendar('inicio')}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin *
              </label>
              <input
                type="text"
                readOnly
                value={formData.fechaFin}
                onClick={() => {
                  setShowCalendarFin(!showCalendarFin);
                  setShowCalendarInicio(false);
                  setCurrentMonth(new Date());
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer bg-white"
                placeholder="Selecciona fecha"
              />
              {showCalendarFin && (
                <div className="absolute top-full mt-2 left-0 z-10">
                  {renderCalendar('fin')}
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
              max="50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ej: 4"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                ¿Habitación Amoblada? *
              </p>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="amoblado"
                    value="si"
                    checked={formData.amoblado === 'si'}
                    onChange={(e) => handleCheckboxChange('amoblado', e.target.value)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span>Sí</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="amoblado"
                    value="no"
                    checked={formData.amoblado === 'no'}
                    onChange={(e) => handleCheckboxChange('amoblado', e.target.value)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                ¿Baño Privado? *
              </p>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="banoPrivado"
                    value="si"
                    checked={formData.banoPrivado === 'si'}
                    onChange={(e) => handleCheckboxChange('banoPrivado', e.target.value)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span>Sí</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="banoPrivado"
                    value="no"
                    checked={formData.banoPrivado === 'no'}
                    onChange={(e) => handleCheckboxChange('banoPrivado', e.target.value)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </form>
    </>
  );
}