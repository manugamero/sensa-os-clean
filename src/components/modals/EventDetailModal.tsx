import React from 'react'
import { X, Clock, Users, Video, Calendar } from 'lucide-react'

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
  description?: string
}

interface EventDetailModalProps {
  event: Event
  onClose: () => void
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div 
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Detalle del Evento</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Información completa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Título del evento */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {event.summary}
            </h3>
          </div>

          {/* Fecha y hora */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Fecha y hora</p>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDateTime(event.start.dateTime)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hasta: {formatDateTime(event.end.dateTime)}
              </p>
            </div>
          </div>

          {/* Asistentes */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Asistentes</p>
                <div className="space-y-1">
                  {event.attendees.map((attendee, index) => (
                    <p key={index} className="text-gray-600 dark:text-gray-400">
                      {attendee.displayName || attendee.email}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Link de videollamada */}
          {event.hangoutLink && (
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Videollamada</p>
                <a
                  href={event.hangoutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white hover:underline"
                >
                  Unirse a la videollamada
                </a>
              </div>
            </div>
          )}

          {/* Descripción */}
          {event.description && (
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">Descripción</p>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cerrar
            </button>
            {event.hangoutLink && (
              <a
                href={event.hangoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Unirse
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailModal
