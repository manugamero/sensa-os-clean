import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Paperclip, Smile, Mic, MicOff, Phone, Video, MoreVertical, UserPlus, Settings } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: string
  timestamp: string
  type: 'text' | 'image' | 'audio'
}

interface ChatRoom {
  id: string
  name: string
  participants: string[]
  isActive: boolean
}

interface ChatDetailModalProps {
  room: ChatRoom
  onClose: () => void
}

const ChatDetailModal: React.FC<ChatDetailModalProps> = ({ room, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Cargar mensajes del localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem(`chat_messages_${room.id}`)
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    }
  }, [room.id])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'Tú',
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      const updatedMessages = [...messages, message]
      setMessages(updatedMessages)
      
      // Guardar en localStorage
      localStorage.setItem(`chat_messages_${room.id}`, JSON.stringify(updatedMessages))
      
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-black rounded-lg shadow-xl overflow-hidden">
        {/* Header simplificado: nombre del chat a la izquierda, toolbar a la derecha */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/[0.08]">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {room.name}
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
              title="Llamada de voz"
            >
              <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button 
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
              title="Videollamada"
            >
              <Video className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                    onClick={() => {
                      console.log('Añadir participante')
                      setShowMoreMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                    Añadir participante
                  </button>
                  <button
                    onClick={() => {
                      console.log('Configuración del chat')
                      setShowMoreMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg"
                  >
                    <Settings className="w-4 h-4" />
                    Configuración
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                No hay mensajes aún. Escribe algo para comenzar.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'Tú' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'Tú'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
    </div>
  )
}

export default ChatDetailModal
