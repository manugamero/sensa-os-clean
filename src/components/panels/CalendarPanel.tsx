import React, { useState, useEffect } from 'react'
import { Clock, Users, Video, Filter, Search } from 'lucide-react'
import { googleCalendarService } from '../../services/googleCalendarService'

interface Event {
  id: string
  summary: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: Array<{
    email: string
    displayName?: string
  }>
  hangoutLink?: string
}

const CalendarPanel: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [newEvent, setNewEvent] = useState({
    summary: 'Event',
    start: new Date().toISOString().slice(0, 16),
    end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    attendees: '',
    description: ''
  })

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const eventsData = await googleCalendarService.getEvents()
      setEvents(eventsData)
    } catch (error) {
      console.error('Error loading events:', error)
      const errorMessage = (error as Error).message
      
      if (errorMessage.includes('No valid authentication token')) {
        alert('❌ No hay sesión activa. Por favor, inicia sesión nuevamente.')
        // Limpiar localStorage y recargar
        localStorage.clear()
        window.location.reload()
      } else {
        alert('Error al cargar eventos: ' + errorMessage)
      }
    } finally {
      setLoading(false)
    }
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

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.summary.toLowerCase().includes(searchTerm.toLowerCase())
    if (!matchesSearch) return false

    const eventDate = new Date(event.start.dateTime)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    switch (filterType) {
      case 'today':
        return eventDate.toDateString() === today.toDateString()
      case 'week':
        return eventDate >= today && eventDate <= weekFromNow
      case 'month':
        return eventDate >= today && eventDate <= monthFromNow
      default:
        return true
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filtros y búsqueda */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title="Filtros"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        
        {showFilters && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Filtrar:</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'all' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('today')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'today' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setFilterType('week')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'week' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Esta semana
            </button>
            <button
              onClick={() => setFilterType('month')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'month' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Este mes
            </button>
          </div>
        )}
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
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {events.length === 0 ? 'No hay eventos próximos' : 'No se encontraron eventos con los filtros aplicados'}
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{event.summary}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDateTime(event.start.dateTime)}
                      </div>
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.attendees.length} invitado{event.attendees.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  {event.hangoutLink && (
                    <a
                      href={event.hangoutLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <Video className="w-4 h-4" />
                      Unirse
                    </a>
                  )}
                </div>
              </div>
            ))
        )}
        </div>
      </div>
    </div>
  )
}

export default CalendarPanel
