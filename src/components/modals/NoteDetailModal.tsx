import React, { useState, useEffect } from 'react'
import { X, CheckSquare, Square, Users, Edit, Trash2, MoreVertical, Save } from 'lucide-react'
import { todoService } from '../../services/todoService'
import { useAuth } from '../../contexts/AuthContext'

interface Note {
  id: string
  title: string
  content: string
  completed: boolean
  createdAt: string
  updatedAt: string
  mentions: string[]
  author: string
  sharedWith?: string[]
}

interface NoteDetailModalProps {
  note: Note
  onClose: () => void
  onUpdate?: (noteId: string, updates: Partial<Note>) => void
  onDelete?: (noteId: string) => void
}

const NoteDetailModal: React.FC<NoteDetailModalProps> = ({ note, onClose, onUpdate, onDelete }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note.content)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  
  // Actualizar contenido cuando cambia externamente (live sync)
  useEffect(() => {
    setEditContent(note.content)
  }, [note.content])

  const formatMarkdown = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">$1</code>')
      .replace(/@(\w+@[\w.-]+)/g, '<span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 rounded text-sm">@$1</span>')
      .replace(/\n/g, '<br>')
  }

  const handleSave = async () => {
    if (user?.email) {
      await todoService.updateNote(note.id, editContent, user.email)
    }
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
    setShowMoreMenu(false)
  }

  const toggleComplete = () => {
    if (onUpdate) {
      onUpdate(note.id, { completed: !note.completed })
    }
    setShowMoreMenu(false)
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
    <div className="h-full w-full flex flex-col bg-white dark:bg-black rounded-lg shadow-xl overflow-hidden">
        {/* Header simplificado: fecha a la izquierda, toolbar a la derecha */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/[0.08]">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(note.createdAt)}
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={toggleComplete}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
              title={note.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
            >
              {note.completed ? (
                <CheckSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <Square className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
                title="Guardar"
              >
                <Save className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}
            
            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
                title="Más opciones"
              >
                <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-black border border-gray-200 dark:border-white/[0.08] rounded-lg shadow-lg z-50">
                  <button
                    onClick={toggleComplete}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                  >
                    {note.completed ? <Square className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
                    {note.completed ? 'Marcar pendiente' : 'Marcar completada'}
                  </button>
                  <div className="border-t border-gray-200 dark:border-white/[0.08] my-1" />
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar nota
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
              title="Cerrar"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Contenido de la nota */}
          <div>
            {isEditing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none text-sm"
                rows={12}
                placeholder="Escribe tu nota aquí..."
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div
                  className={`text-sm whitespace-pre-wrap ${note.completed ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(note.content) }}
                />
              </div>
            )}
          </div>

          {/* Usuarios con acceso (nota compartida) */}
          {note.sharedWith && note.sharedWith.length > 0 && !isEditing && (
            <div className="flex items-start gap-2 pt-2 border-t border-gray-200 dark:border-white/[0.08]">
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Compartida con:</p>
                <div className="flex flex-wrap gap-2">
                  {note.sharedWith.map((email, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs"
                    >
                      {email === note.author ? `${email} (tu)` : email}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  🔄 Sincronizacion en tiempo real activa
                </p>
              </div>
            </div>
          )}

          {/* Información de fecha */}
          {!isEditing && (
            <div className="border-t border-gray-200 dark:border-white/[0.08] pt-3">
              <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-500">
                <span>Creada: {formatDate(note.createdAt)}</span>
                <span>·</span>
                <span>Modificada: {formatDate(note.updatedAt)}</span>
              </div>
            </div>
          )}
        </div>
    </div>
  )
}

export default NoteDetailModal
