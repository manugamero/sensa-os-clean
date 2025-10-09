import React, { useState } from 'react'
import { X, Clock, Users, Video, Calendar, Edit, Trash2, MoreVertical, Copy } from 'lucide-react'

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
  const [showMoreMenu, setShowMoreMenu] = useState(false)

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

  const handleEdit = () => {
    console.log('Editar evento:', event.id)
    setShowMoreMenu(false)
  }

  const handleDelete = () => {
    console.log('Eliminar evento:', event.id)
    setShowMoreMenu(false)
  }

  const handleDuplicate = () => {
    console.log('Duplicar evento:', event.id)
    setShowMoreMenu(false)
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-black rounded-lg shadow-xl overflow-hidden">
        {/* Header unificado con toolbar de iconos */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 dark:bg-gray-950 rounded">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Evento</h2>
          </div>
          
          <div className="flex items-center gap-1">
            {event.hangoutLink && (
              <a
                href={event.hangoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
                title="Unirse a videollamada"
              >
                <Video className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </a>
            )}
            
            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
                title="Más opciones"
              >
                <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                  >
                    <Edit className="w-4 h-4" />
                    Editar evento
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicar evento
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar evento
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
              title="Cerrar"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Título del evento */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {event.summary}
            </h3>
          </div>

          {/* Fecha y hora */}
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDateTime(event.start.dateTime)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Hasta: {formatDateTime(event.end.dateTime)}
              </p>
            </div>
          </div>

          {/* Asistentes */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="space-y-1">
                {event.attendees.map((attendee, index) => (
                  <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {attendee.displayName || attendee.email}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          {event.description && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}
        </div>
    </div>
  )
}

export default EventDetailModal
