import React, { useState, useEffect } from 'react'
import { Mail, MailOpen, Paperclip, Search, Filter, RefreshCw, Plus, Pin } from 'lucide-react'
import { gmailService } from '../../services/gmailService'
import EmailDetailModal from '../modals/EmailDetailModal'
import ModalWrapper from '../modals/ModalWrapper'

interface Email {
  id: string
  subject: string
  from: string
  snippet: string
  date: string
  isRead: boolean
  hasAttachments: boolean
  isPinned?: boolean
}

const MailPanel: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm] = useState('')
  const [filterType] = useState<'all' | 'unread' | 'starred' | 'important'>('all')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null)

  useEffect(() => {
    loadEmails()
  }, [])

  const loadEmails = async () => {
    try {
      setLoading(true)
      const emailsData = await gmailService.getEmails()
      setEmails(emailsData)
    } catch (error) {
      console.error('Error loading emails:', error)
      setEmails([])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (emailId: string) => {
    try {
      await gmailService.markAsRead('', emailId)
      setEmails(emails.map(email => 
        email.id === emailId ? { ...email, isRead: true } : email
      ))
    } catch (error) {
      console.error('Error marking email as read:', error)
    }
  }

  const togglePin = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, isPinned: !email.isPinned } : email
    ))
  }

  const filteredEmails = emails
    .filter(email => {
      const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           email.from.toLowerCase().includes(searchTerm.toLowerCase())
      if (!matchesSearch) return false

      switch (filterType) {
        case 'unread':
          return !email.isRead
        case 'starred':
          return email.subject.includes('★') || email.subject.includes('⭐')
        case 'important':
          return email.subject.toLowerCase().includes('important') || 
                 email.subject.toLowerCase().includes('urgent')
        default:
          return true
      }
    })
    .sort((a, b) => {
      // Pinned emails first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return 0
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('es-ES', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Contenido de la lista - se reduce cuando hay modal */}
      <div className={`h-full flex flex-col transition-all duration-300 origin-top ${selectedEmail ? 'scale-[0.98] opacity-30 pointer-events-none' : 'scale-100 opacity-100'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h2>
        <div className="flex items-center gap-1">
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
            onClick={loadEmails}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
            title="Actualizar"
          >
            <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
            title="Redactar email"
          >
            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
        {filteredEmails.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {emails.length === 0 ? 'No hay emails' : 'No se encontraron emails con los filtros aplicados'}
            </p>
          </div>
        ) : (
          filteredEmails.map((email) => (
            <div
              key={email.id}
              onMouseEnter={() => setHoveredEmail(email.id)}
              onMouseLeave={() => setHoveredEmail(null)}
              onClick={() => {
                setSelectedEmail(email)
                if (!email.isRead) {
                  markAsRead(email.id)
                }
              }}
              className={`card-hover p-3 rounded-lg border cursor-pointer bg-white dark:bg-black border-gray-200 dark:border-gray-700 relative ${
                email.isRead ? 'opacity-50' : ''
              }`}
            >
              {/* Pin button on hover */}
              {hoveredEmail === email.id && (
                <button
                  onClick={(e) => togglePin(email.id, e)}
                  className="absolute top-2 right-2 p-1.5 bg-white dark:bg-black rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors z-10"
                  title={email.isPinned ? 'Desanclar' : 'Anclar'}
                >
                  <Pin className={`w-4 h-4 ${email.isPinned ? 'text-gray-900 dark:text-white fill-current' : 'text-gray-500 dark:text-gray-400'}`} />
                </button>
              )}
              
              {/* Fila 1: De y Fecha */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {email.isRead ? (
                    <MailOpen className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  ) : (
                    <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  )}
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {email.from}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {email.isPinned && (
                    <Pin className="w-3 h-3 text-gray-600 dark:text-gray-400 fill-current" />
                  )}
                  {email.hasAttachments && (
                    <Paperclip className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(email.date)}
                  </span>
                </div>
              </div>
              
              {/* Fila 2: Asunto */}
              <p className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                {email.subject}
              </p>
              
              {/* Fila 3: Preview */}
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {email.snippet}
              </p>
            </div>
          ))
        )}
        </div>
      </div>
      </div>

      {/* Stack Modal dentro de la columna */}
      {selectedEmail && (
        <ModalWrapper>
          <EmailDetailModal
            email={selectedEmail}
            onClose={() => setSelectedEmail(null)}
          />
        </ModalWrapper>
      )}
    </div>
  )
}

export default MailPanel
