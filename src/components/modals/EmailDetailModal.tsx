import React, { useState } from 'react'
import { X, Mail, MailOpen, Paperclip, Clock, User, Archive, Reply, ReplyAll, Forward, Trash2, MoreVertical, AlertOctagon, Star } from 'lucide-react'

interface Email {
  id: string
  subject: string
  from: string
  snippet: string
  date: string
  isRead: boolean
  hasAttachments: boolean
  body?: string
}

interface EmailDetailModalProps {
  email: Email
  onClose: () => void
  onMarkAsRead?: (emailId: string) => void
}

const EmailDetailModal: React.FC<EmailDetailModalProps> = ({ email, onClose, onMarkAsRead }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleMarkAsRead = () => {
    if (!email.isRead && onMarkAsRead) {
      onMarkAsRead(email.id)
    }
  }

  const handleArchive = () => {
    console.log('Archivando email:', email.id)
    // Aquí iría la lógica para archivar
    onClose()
  }

  const handleReply = () => {
    console.log('Respondiendo email:', email.id)
  }

  const handleReplyAll = () => {
    console.log('Responder a todos:', email.id)
  }

  const handleForward = () => {
    console.log('Reenviar email:', email.id)
  }

  const handleDelete = () => {
    console.log('Eliminar email:', email.id)
    onClose()
  }

  const handleSpam = () => {
    console.log('Marcar como spam:', email.id)
    onClose()
  }

  const handleStar = () => {
    console.log('Marcar con estrella:', email.id)
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {email.isRead ? (
                <MailOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Detalle del Email</h2>
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

        {/* Action Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            {/* Archive */}
            <button
              onClick={handleArchive}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Archivar"
            >
              <Archive className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Archivar</span>
            </button>

            {/* Reply */}
            <button
              onClick={handleReply}
              className="p-2 hover:bg-white dark:hover:bg-gray-900 rounded-lg transition-colors"
              title="Responder"
            >
              <Reply className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Star */}
            <button
              onClick={handleStar}
              className="p-2 hover:bg-white dark:hover:bg-gray-900 rounded-lg transition-colors"
              title="Destacar"
            >
              <Star className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 hover:bg-white dark:hover:bg-gray-900 rounded-lg transition-colors"
              title="Más opciones"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <button
                  onClick={handleReplyAll}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ReplyAll className="w-4 h-4" />
                  Responder a todos
                </button>
                <button
                  onClick={handleForward}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Forward className="w-4 h-4" />
                  Reenviar
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button
                  onClick={handleSpam}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <AlertOctagon className="w-4 h-4" />
                  Marcar como spam
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Asunto */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {email.subject}
            </h3>
          </div>

          {/* Información del remitente */}
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">De</p>
              <p className="text-gray-600 dark:text-gray-400">{email.from}</p>
            </div>
          </div>

          {/* Fecha */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Fecha</p>
              <p className="text-gray-600 dark:text-gray-400">{formatDate(email.date)}</p>
            </div>
          </div>

          {/* Adjuntos */}
          {email.hasAttachments && (
            <div className="flex items-start gap-3">
              <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Adjuntos</p>
                <p className="text-gray-600 dark:text-gray-400">Este email contiene archivos adjuntos</p>
              </div>
            </div>
          )}

          {/* Estado de lectura */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${email.isRead ? 'bg-gray-400' : 'bg-gray-600 dark:bg-gray-300'}`} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {email.isRead ? 'Leído' : 'No leído'}
            </span>
          </div>

          {/* Contenido del email */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="font-medium text-gray-900 dark:text-white mb-3">Contenido</p>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {email.body || email.snippet}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {!email.isRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Marcar como leído
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                Responder
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default EmailDetailModal
