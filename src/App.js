import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';

export default function SistemaReservas() {
  const [reservas, setReservas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fecha: '',
    hora: '',
    personas: 2,
    mesa: ''
  });

  useEffect(() => {
    const reservasGuardadas = localStorage.getItem('reservas');
    if (reservasGuardadas) {
      setReservas(JSON.parse(reservasGuardadas));
    }
  }, []);

  useEffect(() => {
    if (reservas.length > 0) {
      localStorage.setItem('reservas', JSON.stringify(reservas));
    }
  }, [reservas]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarDisponibilidad = (fecha, hora, mesa) => {
    return !reservas.some(r => 
      r.fecha === fecha && r.hora === hora && r.mesa === mesa
    );
  };

  const agregarReserva = (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.fecha || !formData.hora || !formData.mesa) {
      setMensaje({ tipo: 'error', texto: 'Por favor completa todos los campos obligatorios' });
      return;
    }

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

  const eliminarReserva = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      setReservas(prev => prev.filter(r => r.id !== id));
      setMensaje({ tipo: 'exito', texto: 'Reserva eliminada' });
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 2000);
    }
  };

  const reservasFiltradas = filtroFecha
    ? reservas.filter(r => r.fecha === filtroFecha)
    : reservas;

  const reservasOrdenadas = [...reservasFiltradas].sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
    return a.hora.localeCompare(b.hora);
  });

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Sistema de Reservas</h1>
            <p style={styles.subtitle}>Gestión de reservas para restaurantes</p>
          </div>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            style={styles.btnPrimary}
          >
            <Plus size={20} />
            Nueva Reserva
          </button>
        </div>

        {/* Mensajes */}
        {mensaje.texto && (
          <div style={{
            ...styles.mensaje,
            ...(mensaje.tipo === 'exito' ? styles.mensajeExito : styles.mensajeError)
          }}>
            {mensaje.tipo === 'exito' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            {mensaje.texto}
          </div>
        )}

        {/* Formulario */}
        {mostrarFormulario && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <Plus size={24} />
              Nueva Reserva
            </h2>
            <div style={styles.formContainer}>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Nombre del Cliente *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Ej: 999888777"
                  />
                </div>
                <div>
                  <label style={styles.label}>Fecha *</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    min={hoy}
                    style={styles.input}
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Hora *</label>
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Número de Personas</label>
                  <input
                    type="number"
                    name="personas"
                    value={formData.personas}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    style={styles.input}
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Número de Mesa *</label>
                  <select
                    name="mesa"
                    value={formData.mesa}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Seleccionar mesa</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>Mesa {num}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={styles.formButtons}>
                <button
                  onClick={agregarReserva}
                  style={styles.btnSuccess}
                >
                  Guardar Reserva
                </button>
                <button
                  onClick={() => setMostrarFormulario(false)}
                  style={styles.btnSecondary}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtro y Estadísticas */}
        <div style={styles.statsGrid}>
          <div style={styles.filterCard}>
            <label style={styles.label}>Filtrar por fecha</label>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={{...styles.statCard, ...styles.statCardBlue}}>
            <Calendar size={32} style={{color: '#60a5fa'}} />
            <div>
              <p style={styles.statLabel}>Total Reservas</p>
              <p style={styles.statValue}>{reservas.length}</p>
            </div>
          </div>
          <div style={{...styles.statCard, ...styles.statCardPurple}}>
            <Users size={32} style={{color: '#c084fc'}} />
            <div>
              <p style={styles.statLabel}>Reservas Hoy</p>
              <p style={styles.statValue}>
                {reservas.filter(r => r.fecha === hoy).length}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Reservas */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Calendar size={24} />
            Reservas {filtroFecha && `- ${new Date(filtroFecha + 'T00:00:00').toLocaleDateString('es-ES', { dateStyle: 'long' })}`}
          </h2>
          
          {reservasOrdenadas.length === 0 ? (
            <div style={styles.emptyState}>
              <Calendar size={64} style={{color: '#c084fc', marginBottom: '1rem'}} />
              <p style={styles.emptyText}>No hay reservas registradas</p>
              <p style={styles.emptySubtext}>
                {filtroFecha ? 'Intenta con otra fecha' : 'Crea tu primera reserva'}
              </p>
            </div>
          ) : (
            <div style={styles.reservasList}>
              {reservasOrdenadas.map(reserva => (
                <div key={reserva.id} style={styles.reservaCard}>
                  <div style={styles.reservaGrid}>
                    <div>
                      <p style={styles.reservaLabel}>Cliente</p>
                      <p style={styles.reservaValue}>{reserva.nombre}</p>
                      {reserva.telefono && (
                        <p style={styles.reservaTel}>{reserva.telefono}</p>
                      )}
                    </div>
                    <div>
                      <p style={styles.reservaLabel}>Fecha</p>
                      <p style={styles.reservaValue}>
                        <Calendar size={16} style={{marginRight: '0.5rem'}} />
                        {new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p style={styles.reservaLabel}>Hora</p>
                      <p style={styles.reservaValue}>
                        <Clock size={16} style={{marginRight: '0.5rem'}} />
                        {reserva.hora}
                      </p>
                    </div>
                    <div>
                      <p style={styles.reservaLabel}>Personas</p>
                      <p style={styles.reservaValue}>
                        <Users size={16} style={{marginRight: '0.5rem'}} />
                        {reserva.personas}
                      </p>
                    </div>
                    <div>
                      <p style={styles.reservaLabel}>Mesa</p>
                      <p style={styles.reservaValue}>Mesa {reserva.mesa}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => eliminarReserva(reserva.id)}
                    style={styles.btnDelete}
                    title="Eliminar reserva"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>Sistema de Reservas para Restaurantes - Proyecto Académico</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #1e1b4b 100%)',
    padding: '1rem',
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#e9d5ff',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s',
  },
  mensaje: {
    marginBottom: '1.5rem',
    padding: '1rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  mensajeExito: {
    background: 'rgba(34, 197, 94, 0.2)',
    border: '1px solid rgba(34, 197, 94, 0.5)',
    color: '#86efac',
  },
  mensajeError: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    color: '#fca5a5',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  label: {
    display: 'block',
    color: '#e9d5ff',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    background: 'rgba(255, 255, 255, 0.46)',
    border: '1px solid rgba(244, 229, 229, 0.27)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
  },
  formButtons: {
    display: 'flex',
    gap: '0.75rem',
    paddingTop: '1rem',
  },
  btnSuccess: {
    flex: 1,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  btnSecondary: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  filterCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '0.75rem',
    padding: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  statCard: {
    backdropFilter: 'blur(10px)',
    borderRadius: '0.75rem',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  statCardBlue: {
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(96, 165, 250, 0.3)',
  },
  statCardPurple: {
    background: 'rgba(168, 85, 247, 0.2)',
    border: '1px solid rgba(192, 132, 252, 0.3)',
  },
  statLabel: {
    color: '#e9d5ff',
    fontSize: '0.875rem',
  },
  statValue: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 0',
  },
  emptyText: {
    color: '#e9d5ff',
    fontSize: '1.125rem',
  },
  emptySubtext: {
    color: '#ddd6fe',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
  },
  reservasList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  reservaCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    transition: 'all 0.3s',
  },
  reservaGrid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  reservaLabel: {
    color: '#ddd6fe',
    fontSize: '0.75rem',
    marginBottom: '0.25rem',
  },
  reservaValue: {
    color: 'white',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
  },
  reservaTel: {
    color: '#e9d5ff',
    fontSize: '0.875rem',
  },
  btnDelete: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#fca5a5',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    color: '#ddd6fe',
    fontSize: '0.875rem',
  },
};