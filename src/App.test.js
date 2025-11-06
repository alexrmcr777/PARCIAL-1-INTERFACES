import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';

export default function SistemaReservas() {
  const [reservas, setReservas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fecha: '',
    hora: '',
    personas: 2,
    mesa: ''
  });

  // Cargar reservas guardadas al iniciar
  useEffect(() => {
    const reservasGuardadas = localStorage.getItem('reservas');
    if (reservasGuardadas) {
      setReservas(JSON.parse(reservasGuardadas));
    }
  }, []);

  // Guardar reservas cuando cambien
  useEffect(() => {
    if (reservas.length > 0) {
      localStorage.setItem('reservas', JSON.stringify(reservas));
    }
  }, [reservas]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar disponibilidad (evitar duplicaciones)
  const validarDisponibilidad = (fecha, hora, mesa) => {
    return !reservas.some(r => 
      r.fecha === fecha && r.hora === hora && r.mesa === mesa
    );
  };

  // Agregar nueva reserva
  const agregarReserva = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre || !formData.fecha || !formData.hora || !formData.mesa) {
      setMensaje({ tipo: 'error', texto: 'Por favor completa todos los campos obligatorios' });
      return;
    }

    // Verificar disponibilidad
    if (!validarDisponibilidad(formData.fecha, formData.hora, formData.mesa)) {
      setMensaje({ tipo: 'error', texto: 'Esta mesa ya está reservada en ese horario' });
      return;
    }

    const nuevaReserva = {
      id: Date.now(),
      ...formData,
      fechaCreacion: new Date().toISOString()
    };

    setReservas(prev => [...prev, nuevaReserva]);
    setMensaje({ tipo: 'exito', texto: 'Reserva creada exitosamente' });
    
    // Limpiar formulario
    setFormData({
      nombre: '',
      telefono: '',
      fecha: '',
      hora: '',
      personas: 2,
      mesa: ''
    });
    
    setTimeout(() => {
      setMostrarFormulario(false);
      setMensaje({ tipo: '', texto: '' });
    }, 2000);
  };

  // Eliminar reserva
  const eliminarReserva = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      setReservas(prev => prev.filter(r => r.id !== id));
      setMensaje({ tipo: 'exito', texto: 'Reserva eliminada' });
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 2000);
    }
  };

  // Filtrar reservas por fecha
  const reservasFiltradas = filtroFecha
    ? reservas.filter(r => r.fecha === filtroFecha)
    : reservas;

  // Ordenar reservas por fecha y hora
  const reservasOrdenadas = [...reservasFiltradas].sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
    return a.hora.localeCompare(b.hora);
  });

  // Obtener fecha de hoy
  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Sistema de Reservas</h1>
              <p className="text-purple-200">Gestión de reservas para restaurantes</p>
            </div>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={20} />
              Nueva Reserva
            </button>
          </div>
        </div>

        {/* Mensajes */}
        {mensaje.texto && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            mensaje.tipo === 'exito' 
              ? 'bg-green-500/20 border border-green-500/50 text-green-100' 
              : 'bg-red-500/20 border border-red-500/50 text-red-100'
          }`}>
            {mensaje.tipo === 'exito' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            {mensaje.texto}
          </div>
        )}

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus size={24} />
              Nueva Reserva
            </h2>
            <form onSubmit={agregarReserva} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 mb-2 font-medium">Nombre del Cliente *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2 font-medium">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: 999888777"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2 font-medium">Fecha *</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    min={hoy}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2 font-medium">Hora *</label>
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2 font-medium">Número de Personas</label>
                  <input
                    type="number"
                    name="personas"
                    value={formData.personas}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2 font-medium">Número de Mesa *</label>
                  <select
                    name="mesa"
                    value={formData.mesa}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Seleccionar mesa</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num} className="bg-slate-800">Mesa {num}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg"
                >
                  Guardar Reserva
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="px-6 py-3 rounded-lg font-semibold bg-white/10 text-white hover:bg-white/20 transition-all duration-300 border border-white/30"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtro y Estadísticas */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <label className="block text-purple-200 mb-2 font-medium">Filtrar por fecha</label>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-4 border border-blue-400/30">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-300" size={32} />
              <div>
                <p className="text-blue-200 text-sm">Total Reservas</p>
                <p className="text-white text-2xl font-bold">{reservas.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-4 border border-purple-400/30">
            <div className="flex items-center gap-3">
              <Users className="text-purple-300" size={32} />
              <div>
                <p className="text-purple-200 text-sm">Reservas Hoy</p>
                <p className="text-white text-2xl font-bold">
                  {reservas.filter(r => r.fecha === hoy).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Reservas */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar size={24} />
            Reservas {filtroFecha && `- ${new Date(filtroFecha + 'T00:00:00').toLocaleDateString('es-ES', { dateStyle: 'long' })}`}
          </h2>
          
          {reservasOrdenadas.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-purple-300 mb-4" />
              <p className="text-purple-200 text-lg">No hay reservas registradas</p>
              <p className="text-purple-300 text-sm mt-2">
                {filtroFecha ? 'Intenta con otra fecha' : 'Crea tu primera reserva'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservasOrdenadas.map(reserva => (
                <div
                  key={reserva.id}
                  className="bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 grid md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-purple-300 text-xs mb-1">Cliente</p>
                        <p className="text-white font-semibold">{reserva.nombre}</p>
                        {reserva.telefono && (
                          <p className="text-purple-200 text-sm">{reserva.telefono}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-purple-300 text-xs mb-1">Fecha</p>
                        <p className="text-white font-semibold flex items-center gap-2">
                          <Calendar size={16} />
                          {new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-purple-300 text-xs mb-1">Hora</p>
                        <p className="text-white font-semibold flex items-center gap-2">
                          <Clock size={16} />
                          {reserva.hora}
                        </p>
                      </div>
                      <div>
                        <p className="text-purple-300 text-xs mb-1">Personas</p>
                        <p className="text-white font-semibold flex items-center gap-2">
                          <Users size={16} />
                          {reserva.personas}
                        </p>
                      </div>
                      <div>
                        <p className="text-purple-300 text-xs mb-1">Mesa</p>
                        <p className="text-white font-semibold">Mesa {reserva.mesa}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarReserva(reserva.id)}
                      className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-2 rounded-lg transition-all duration-300 border border-red-500/30"
                      title="Eliminar reserva"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con información */}
        <div className="mt-6 text-center text-purple-300 text-sm">
          <p>Sistema de Reservas para Restaurantes - Proyecto Académico</p>
        </div>
      </div>
    </div>
  );
}