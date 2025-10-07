import React, { useState, useEffect } from 'react'
import { Mail, MailOpen, Paperclip } from 'lucide-react'
import { useStackModal } from '../../contexts/StackModalContext'
import { gmailService } from '../../services/gmailService'

interface Email {
  id: string
  subject: string
  from: string
  snippet: string
  date: string
  isRead: boolean
  hasAttachments: boolean
}

const MailPanel: React.FC = () => {
  const { openEmailModal } = useStackModal()
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm] = useState('')
  const [filterType] = useState<'all' | 'unread' | 'starred' | 'important'>('all')

  useEffect(() => {
    loadEmails()
    
    // Si falla, mostrar emails de ejemplo
    setTimeout(() => {
      if (emails.length === 0 && !loading) {
        setEmails([
          {
            id: '1',
            subject: 'Bienvenido a Sensa OS',
            from: 'hello@sensa.app',
            snippet: 'Gracias por usar Sensa OS. Aquí tienes algunos consejos para empezar...',
            date: new Date().toISOString(),
            isRead: false,
            hasAttachments: false
          },
          {
            id: '2',
            subject: 'Actualización del proyecto',
            from: 'team@example.com',
            snippet: 'El proyecto ha sido actualizado con nuevas funcionalidades...',
            date: new Date(Date.now() - 3600000).toISOString(),
            isRead: true,
            hasAttachments: true
          }
        ])
      }
    }, 3000)
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

  const filteredEmails = emails.filter(email => {
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
    <div className="h-full flex flex-col">

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
              onClick={() => {
                openEmailModal(email)
                if (!email.isRead) {
                  markAsRead(email.id)
                }
              }}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                !email.isRead 
                  ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700' 
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {email.isRead ? (
                    <MailOpen className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm font-medium truncate ${
                      !email.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {email.from}
                    </p>
                    <div className="flex items-center gap-2">
                      {email.hasAttachments && (
                        <Paperclip className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(email.date)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1">
                    {email.subject}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {email.snippet}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  )
}

export default MailPanel
