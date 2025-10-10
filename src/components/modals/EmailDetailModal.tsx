import React, { useState, useEffect } from 'react'
import { X, MailOpen, Paperclip, Clock, User, Archive, Reply, ReplyAll, Forward, Trash2, AlertOctagon, Star, MoreVertical } from 'lucide-react'
import { gmailService } from '../../services/gmailService'
import FilePreview from '../FilePreview'

interface Email {
  id: string
  threadId?: string
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
  const [threadMessages, setThreadMessages] = useState<Email[]>([email])
  const [loadingThread, setLoadingThread] = useState(false)
  const [previewFile, setPreviewFile] = useState<{
    url: string
    filename: string
    mimeType: string
    size: number
    messageId: string
    attachmentId: string
  } | null>(null)

  // Cargar thread completo al abrir
  useEffect(() => {
    const loadThread = async () => {
      if (email.threadId) {
        setLoadingThread(true)
        try {
          const messages = await gmailService.getThread(email.threadId)
          if (messages.length > 1) {
            setThreadMessages(messages)
          }
        } catch (error) {
          console.error('Error loading thread:', error)
        } finally {
          setLoadingThread(false)
        }
      }
    }
    loadThread()
  }, [email.threadId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      weekday: 'short',
      month: 'short',
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

  const handlePreviewAttachment = async (messageId: string, attachment: any) => {
    try {
      const blob = await gmailService.downloadAttachment(messageId, attachment.attachmentId)
      const url = window.URL.createObjectURL(blob)
      setPreviewFile({
        url,
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        size: attachment.size,
        messageId,
        attachmentId: attachment.attachmentId
      })
    } catch (error) {
      console.error('Error loading attachment:', error)
      alert('Error al cargar el archivo')
    }
  }

  const handleDownloadAttachment = async () => {
    if (!previewFile) return
    
    try {
      const a = document.createElement('a')
      a.href = previewFile.url
      a.download = previewFile.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading attachment:', error)
      alert('Error al descargar el archivo')
    }
  }

  const handleClosePreview = () => {
    if (previewFile) {
      window.URL.revokeObjectURL(previewFile.url)
      setPreviewFile(null)
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
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/[0.08]">
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
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-black border border-gray-200 dark:border-white/[0.08] rounded-lg shadow-lg z-50">
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
                  <div className="border-t border-gray-200 dark:border-white/[0.08] my-1" />
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {email.subject}
            </h3>
            {threadMessages.length > 1 && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {threadMessages.length} mensajes
              </p>
            )}
          </div>

          {loadingThread && (
            <p className="text-sm text-gray-500 dark:text-gray-500">Cargando conversación...</p>
          )}

          {/* Thread de mensajes */}
          <div className="space-y-4">
            {threadMessages.map((message, index) => (
              <div key={message.id}>
                {/* Separador entre mensajes */}
                {index > 0 && (
                  <div className="border-t border-gray-200 dark:border-white/[0.08] my-4" />
                )}

                {/* Información del mensaje */}
                <div className="space-y-3">
                  {/* Remitente y fecha */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {message.from}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                        {formatDate(message.date)}
                      </p>
                    </div>
                  </div>

                  {/* Adjuntos del mensaje */}
                  {message.hasAttachments && message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">
                          {message.attachments.length} {message.attachments.length === 1 ? 'Adjunto' : 'Adjuntos'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.attachments.map((attachment: any, attIndex: number) => (
                          <button
                            key={attIndex}
                            onClick={() => handlePreviewAttachment(message.id, attachment)}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-white/[0.08] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Paperclip className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                              {attachment.filename}
                            </span>
                            {attachment.size && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                ({Math.round(attachment.size / 1024)}KB)
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contenido del mensaje */}
                  <div className="pl-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                        {message.body || message.snippet}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Caja de respuesta */}
        <div className="border-t border-gray-200 dark:border-white/[0.08] p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Responder a todos..."
              className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-white/[0.08] rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
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

      {/* File Preview */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={handleClosePreview}
          onDownload={handleDownloadAttachment}
        />
      )}
    </div>
  )
}

export default EmailDetailModal
