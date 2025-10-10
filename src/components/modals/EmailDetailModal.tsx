import React, { useState } from 'react'
import { X, MailOpen, Paperclip, Clock, User, Archive, Reply, ReplyAll, Forward, Trash2, AlertOctagon, Star, MoreVertical } from 'lucide-react'

interface Email {
  id: string
  subject: string
  from: string
  to?: string
  snippet: string
  date: string
  isRead: boolean
  hasAttachments: boolean
  body?: string
  attachments?: Array<{
    filename: string
    mimeType: string
    size: number
    attachmentId: string
  }>
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
    <div className="h-full w-full flex flex-col bg-white dark:bg-black overflow-hidden">
        {/* Header simplificado: X a la izquierda, toolbar a la derecha */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
            title="Cerrar"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          
          <div className="flex items-center gap-1">
            <button
              onClick={handleReply}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
              title="Responder"
            >
              <Reply className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleStar}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
              title="Destacar"
            >
              <Star className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleArchive}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
              title="Archivar"
            >
              <Archive className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            
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
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-black border border-white/[0.08] rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleReplyAll}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
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
                  {!email.isRead && onMarkAsRead && (
                    <button
                      onClick={() => {
                        handleMarkAsRead()
                        setShowMoreMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <MailOpen className="w-4 h-4" />
                      Marcar como leído
                    </button>
                  )}
                  <div className="border-t border-white/[0.08] my-1" />
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
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Asunto */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {email.subject}
            </h3>
          </div>

          {/* Información del remitente */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">{email.from}</p>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(email.date)}</p>
          </div>

          {/* Adjuntos */}
          {email.hasAttachments && email.attachments && email.attachments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {email.attachments.length} {email.attachments.length === 1 ? 'Adjunto' : 'Adjuntos'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map((attachment: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-white/[0.08]"
                  >
                    <Paperclip className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                      {attachment.filename}
                    </span>
                    {attachment.size && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ({Math.round(attachment.size / 1024)}KB)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Contenido del email */}
          <div className="border-t border-white/[0.08] pt-4">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {email.body || email.snippet}
              </p>
            </div>
          </div>
        </div>

        {/* Caja de respuesta */}
        <div className="border-t border-white/[0.08] p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Responder a todos..."
              className="w-full px-3 py-2 pr-10 border border-white/[0.08] rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={handleReplyAll}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
              title="Enviar"
            >
              <ReplyAll className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
    </div>
  )
}

export default EmailDetailModal
