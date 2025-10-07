import React, { useState } from 'react'
import { X, CheckSquare, Square, Users, Hash, Bold, Italic, List, Edit, Trash2 } from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  completed: boolean
  createdAt: string
  updatedAt: string
  mentions: string[]
  author: string
}

interface NoteDetailModalProps {
  note: Note
  onClose: () => void
  onUpdate?: (noteId: string, updates: Partial<Note>) => void
  onDelete?: (noteId: string) => void
}

const NoteDetailModal: React.FC<NoteDetailModalProps> = ({ note, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note.content)

  const formatMarkdown = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">$1</code>')
      .replace(/@(\w+@[\w.-]+)/g, '<span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 rounded text-sm">@$1</span>')
      .replace(/\n/g, '<br>')
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(note.id, { content: editContent })
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (onDelete && window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      onDelete(note.id)
      onClose()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
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
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {note.completed ? (
                <CheckSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Square className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Detalle de la Nota</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Información completa</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Edit className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Estado de completado */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdate?.(note.id, { completed: !note.completed })}
              className="flex-shrink-0"
            >
              {note.completed ? (
                <CheckSquare className="w-6 h-6 text-gray-600" />
              ) : (
                <Square className="w-6 h-6 text-gray-400" />
              )}
            </button>
            <span className={`text-sm font-medium ${note.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
              {note.completed ? 'Completada' : 'Pendiente'}
            </span>
          </div>

          {/* Contenido de la nota */}
          <div>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
                  rows={8}
                  placeholder="Escribe tu nota aquí..."
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div
                  className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(note.content) }}
                />
              </div>
            )}
          </div>

          {/* Menciones */}
          {note.mentions && note.mentions.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Menciones</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {note.mentions.map((mention, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm"
                    >
                      @{mention}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Información de fecha */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Creada</p>
                <p className="text-gray-600 dark:text-gray-400">{formatDate(note.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Modificada</p>
                <p className="text-gray-600 dark:text-gray-400">{formatDate(note.updatedAt)}</p>
              </div>
            </div>
          </div>
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
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailModal
