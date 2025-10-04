import React, { useState, useEffect } from 'react'
import { Mail, MailOpen, Paperclip, Filter, Search, Star, Plus } from 'lucide-react'
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
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'starred' | 'important'>('all')

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
      const errorMessage = (error as Error).message
      
      if (errorMessage.includes('No valid authentication token')) {
        alert('❌ No hay sesión activa. Por favor, inicia sesión nuevamente.')
        // Limpiar localStorage y recargar
        localStorage.clear()
        window.location.reload()
      } else {
        alert('Error al cargar emails: ' + errorMessage)
      }
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header con iconos colapsados */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title="Buscar"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title="Filtros"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title="Añadir"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Búsqueda expandida */}
      {showFilters && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Filtrar:</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'all' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'unread' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              No leídos
            </button>
            <button
              onClick={() => setFilterType('starred')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'starred' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Star className="w-3 h-3 inline mr-1" />
              Destacados
            </button>
            <button
              onClick={() => setFilterType('important')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'important' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Importantes
            </button>
          </div>
        </div>
      )}

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
