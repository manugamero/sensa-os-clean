import React, { useState, useEffect } from 'react'
import { Video, Search, Filter, RefreshCw, Plus, Check } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { googleCalendarService } from '../../services/googleCalendarService'
import EventDetailModal from '../modals/EventDetailModal'
import ModalWrapper from '../modals/ModalWrapper'

interface Event {
  id: string
  summary: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  attendees?: Array<{
    email: string
    displayName?: string
  }>
  hangoutLink?: string
  isDone?: boolean
}

const CalendarPanel: React.FC = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const [showDone, setShowDone] = useState(false)
  const [newEvent, setNewEvent] = useState({
    summary: 'Event',
    start: new Date().toISOString().slice(0, 16),
    end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    attendees: '',
    description: ''
  })

  useEffect(() => {
    loadEvents()
  }, [user])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const eventsData = await googleCalendarService.getEvents()
      setEvents(eventsData)
    } catch (error) {
      console.error('Error loading events:', error)
      // No mostrar alert, solo log del error
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const toggleDone = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, isDone: !event.isDone } : event
    ))
  }

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const attendees = newEvent.attendees
        .split(',')
        .map(email => email.trim())
        .filter(email => email)
        .map(email => ({ email }))

      await googleCalendarService.createEvent('', {
        summary: newEvent.summary || 'Event',
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
        attendees,
        description: newEvent.description
      })

      setNewEvent({
        summary: 'Event',
        start: new Date().toISOString().slice(0, 16),
        end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
        attendees: '',
        description: ''
      })
      setShowCreateForm(false)
      loadEvents()
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  const formatDateTime = (start: { dateTime?: string; date?: string }, end?: { dateTime?: string; date?: string }) => {
    const startStr = start.dateTime || start.date
    if (!startStr) return 'Fecha no disponible'
    
    const startDate = new Date(startStr)
    const isAllDay = !start.dateTime // Si no tiene dateTime, es evento de día completo
    
    // Formato de fecha: Vie 17 Oct
    const dateStr = startDate.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
    
    // Si es evento de día completo
    if (isAllDay) {
      return `Todo el día · ${dateStr}`
    }
    
    // Si tiene hora específica
    const startHour = startDate.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    
    let timeRange = startHour
    
    if (end && end.dateTime) {
      const endDate = new Date(end.dateTime)
      const endHour = endDate.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      timeRange = `${startHour}-${endHour}`
    }
    
    return `${timeRange} · ${dateStr}`
  }

  const isToday = (start: { dateTime?: string; date?: string }) => {
    const dateStr = start.dateTime || start.date
    if (!dateStr) return false
    
    const eventDate = new Date(dateStr)
    const today = new Date()
    return eventDate.getDate() === today.getDate() &&
           eventDate.getMonth() === today.getMonth() &&
           eventDate.getFullYear() === today.getFullYear()
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Contenido de la lista - se reduce cuando hay modal */}
      <div className={`h-full flex flex-col transition-all duration-300 origin-top ${selectedEvent ? 'scale-[0.98] opacity-30 pointer-events-none' : 'scale-100 opacity-100'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Calendario</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowDone(!showDone)}
            className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors ${showDone ? 'bg-gray-100 dark:bg-gray-900' : ''}`}
            title={showDone ? 'Mostrar pendientes' : 'Mostrar completados'}
          >
            <Check className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
            title="Buscar"
          >
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
            title="Filtrar"
          >
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={loadEvents}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
            title="Actualizar"
          >
            <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
            title="Añadir evento"
          >
            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showCreateForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateForm(false)
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Crear evento</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                ×
              </button>
            </div>
            <form onSubmit={createEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título del evento
                </label>
                <input
                  type="text"
                  value={newEvent.summary}
                  onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                  className="input-field"
                  placeholder="Event"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Inicio
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fin
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invitados (emails separados por comas)
                </label>
                <input
                  type="text"
                  value={newEvent.attendees}
                  onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                  className="input-field"
                  placeholder="usuario1@email.com, usuario2@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Crear evento
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
        )}

        <div className="space-y-3">
        {events.filter(event => showDone ? event.isDone : !event.isDone).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No hay eventos próximos</p>
          </div>
        ) : (
          events.filter(event => showDone ? event.isDone : !event.isDone).map((event) => {
            const isTodayEvent = isToday(event.start)
            return (
            <div 
              key={event.id} 
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              onClick={() => setSelectedEvent(event)}
              className={`card-hover bg-white dark:bg-black rounded-lg border border-white/[0.08] p-3 cursor-pointer relative ${!isTodayEvent ? 'opacity-50' : ''}`}
            >
              {/* Done button on hover */}
              {hoveredEvent === event.id && (
                <button
                  onClick={(e) => toggleDone(event.id, e)}
                  className="absolute top-2 right-2 p-1.5 bg-white dark:bg-black rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors z-10"
                  title={event.isDone ? 'Marcar como pendiente' : 'Marcar como completado'}
                >
                  <Check className={`w-4 h-4 ${event.isDone ? 'text-gray-900 dark:text-white fill-current' : 'text-gray-500 dark:text-gray-400'}`} />
                </button>
              )}
              <div className="h-[60px] flex flex-col justify-between">
                {/* Fila 1: Título - altura fija */}
                <h3 className="font-semibold text-gray-900 dark:text-white truncate h-5">{event.summary || 'Sin título'}</h3>
                
                {/* Fila 2: Hora - altura fija */}
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 h-5">
                  <span className="truncate">{formatDateTime(event.start, event.end)}</span>
                </div>
                
                {/* Fila 3: Invitados y botón - altura fija */}
                <div className="flex items-center justify-between gap-2 h-5">
                  {event.attendees && event.attendees.length > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{event.attendees.length} asistente{event.attendees.length > 1 ? 's' : ''}</span>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {event.hangoutLink && (
                    <a
                      href={event.hangoutLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs"
                    >
                      <Video className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            )
          })
        )}
        </div>
      </div>
      </div>

      {/* Stack Modal dentro de la columna */}
      {selectedEvent && (
        <ModalWrapper>
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        </ModalWrapper>
      )}
    </div>
  )
}

export default CalendarPanel
