import React, { useState, useEffect } from 'react'
import { Clock, Users, Video } from 'lucide-react'

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

const CalendarPanelSafe: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simular carga de eventos (sin llamadas a Google API)
      setTimeout(() => {
        setEvents([
          {
            id: '1',
            summary: 'Reunión de equipo',
            start: { dateTime: new Date().toISOString(), timeZone: 'UTC' },
            end: { dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), timeZone: 'UTC' },
            attendees: [{ email: 'test@example.com', displayName: 'Test User' }]
          }
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading events:', error)
      setError('Error al cargar eventos')
      setLoading(false)
    }
  }

  const formatDate = (dateTime: string) => {
    try {
      const date = new Date(dateTime)
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No hay eventos próximos</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:shadow-md transition-shadow mb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{event.summary}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(event.start.dateTime)}</span>
                    </div>
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees.length} invitado{event.attendees.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                  {event.hangoutLink && (
                    <div className="mt-2">
                      <a
                        href={event.hangoutLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                      >
                        <Video className="w-4 h-4" />
                        Unirse
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CalendarPanelSafe
