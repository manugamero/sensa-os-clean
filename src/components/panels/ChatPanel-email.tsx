import React, { useState, useEffect } from 'react'
import { Search, Filter, RefreshCw, Plus, Send, Users } from 'lucide-react'
import ModalWrapper from '../modals/ModalWrapper'

interface EmailThread {
  id: string
  subject: string
  participants: string[]
  lastMessage: string
  lastMessageDate: string
  unreadCount: number
  messages: ThreadMessage[]
}

interface ThreadMessage {
  id: string
  from: string
  content: string
  date: string
}

const ChatPanelEmail: React.FC = () => {
  const [threads, setThreads] = useState<EmailThread[]>([])
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  const [newChatEmail, setNewChatEmail] = useState('')
  const [newChatSubject, setNewChatSubject] = useState('')

  useEffect(() => {
    loadThreads()
  }, [])

  const loadThreads = async () => {
    try {
      setLoading(true)
      // Aquí cargaríamos los threads de Gmail
      // Por ahora usamos datos de ejemplo
      const mockThreads: EmailThread[] = [
        {
          id: '1',
          subject: 'Proyecto Q1',
          participants: ['maria@example.com', 'juan@example.com'],
          lastMessage: 'Perfecto, entonces quedamos así',
          lastMessageDate: new Date().toISOString(),
          unreadCount: 2,
          messages: [
            {
              id: 'm1',
              from: 'maria@example.com',
              content: 'Hola, ¿cómo va el proyecto?',
              date: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 'm2',
              from: 'juan@example.com',
              content: 'Muy bien, ya casi terminamos',
              date: new Date(Date.now() - 1800000).toISOString()
            },
            {
              id: 'm3',
              from: 'maria@example.com',
              content: 'Perfecto, entonces quedamos así',
              date: new Date().toISOString()
            }
          ]
        }
      ]
      setThreads(mockThreads)
    } catch (error) {
      console.error('Error loading threads:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return

    // Aquí enviaríamos el mensaje vía Gmail API
    console.log('Sending message:', newMessage, 'to thread:', selectedThread.id)
    
    // Simular agregar mensaje
    const newMsg: ThreadMessage = {
      id: `m${Date.now()}`,
      from: 'me',
      content: newMessage,
      date: new Date().toISOString()
    }

    setSelectedThread({
      ...selectedThread,
      messages: [...selectedThread.messages, newMsg]
    })

    setNewMessage('')
  }

  const createNewChat = async () => {
    if (!newChatEmail.trim() || !newChatSubject.trim()) return

    // Aquí crearíamos un nuevo thread de email
    console.log('Creating new chat/thread:', { to: newChatEmail, subject: newChatSubject })
    
    const newThread: EmailThread = {
      id: `t${Date.now()}`,
      subject: newChatSubject,
      participants: [newChatEmail],
      lastMessage: '',
      lastMessageDate: new Date().toISOString(),
      unreadCount: 0,
      messages: []
    }

    setThreads([newThread, ...threads])
    setShowNewChat(false)
    setNewChatEmail('')
    setNewChatSubject('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div className={`h-full flex flex-col relative transition-transform duration-300 ${selectedThread ? 'scale-95' : 'scale-100'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat (Email)</h2>
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            title="Buscar"
          >
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            title="Filtrar"
          >
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={loadThreads}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            title="Actualizar"
          >
            <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setShowNewChat(true)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            title="Nueva conversación"
          >
            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* New Chat Form */}
      {showNewChat && (
        <div className="mb-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Nueva Conversación</h3>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email del destinatario"
              value={newChatEmail}
              onChange={(e) => setNewChatEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              type="text"
              placeholder="Asunto de la conversación"
              value={newChatSubject}
              onChange={(e) => setNewChatSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <div className="flex gap-2">
              <button
                onClick={createNewChat}
                className="flex-1 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Crear
              </button>
              <button
                onClick={() => setShowNewChat(false)}
                className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className="p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{thread.subject}</h3>
                    {thread.unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-600 dark:bg-gray-300 text-white dark:text-gray-900 rounded-full">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>{thread.participants.join(', ')}</span>
                  </div>
                </div>
              </div>
              {thread.lastMessage && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {thread.lastMessage}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {threads.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No hay conversaciones</p>
        </div>
      )}

      {/* Thread Detail Modal */}
      {selectedThread && (
        <ModalWrapper>
          <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{selectedThread.subject}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedThread.participants.join(', ')}
                </p>
              </div>
              <button
                onClick={() => setSelectedThread(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.from === 'me'
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    {msg.from !== 'me' && (
                      <p className="text-xs font-medium mb-1 opacity-70">{msg.from}</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-60">
                      {new Date(msg.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  )
}

export default ChatPanelEmail
