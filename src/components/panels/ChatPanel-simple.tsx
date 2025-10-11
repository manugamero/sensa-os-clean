import React, { useState, useEffect } from 'react'
import { Search, Filter, RefreshCw, Plus, Check } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { chatService, ChatRoom } from '../../services/chatService'
import ChatDetailModal from '../modals/ChatDetailModal'
import ModalWrapper from '../modals/ModalWrapper'

const ChatPanelSimple: React.FC = () => {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null)
  const [showDone, setShowDone] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newConversation, setNewConversation] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    if (user?.email) {
      loadConversations()
    }
  }, [user])

  const loadConversations = async () => {
    if (!user?.email) return
    
    try {
      setLoading(true)
      const conversations = await chatService.getUserConversations(user.email)
      
      // Asegurar que siempre existe el chat "public" por defecto
      const publicChat = conversations.find(c => c.id === 'public')
      if (!publicChat) {
        const defaultPublicChat: ChatRoom = {
          id: 'public',
          name: 'public',
          participants: [user.email],
          isActive: true,
          isPinned: true,
          isDone: false,
          createdAt: new Date().toISOString()
        }
        conversations.unshift(defaultPublicChat)
        // Guardar en localStorage
        localStorage.setItem(`chat_room_public`, JSON.stringify(defaultPublicChat))
      }
      
      setRooms(conversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
      // Si hay error, al menos crear el chat public
      const defaultPublicChat: ChatRoom = {
        id: 'public',
        name: 'public',
        participants: [user?.email || ''],
        isActive: true,
        isPinned: true,
        isDone: false,
        createdAt: new Date().toISOString()
      }
      setRooms([defaultPublicChat])
    } finally {
      setLoading(false)
    }
  }

  const createConversation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newConversation.email.trim() || !user?.email) return

    try {
      const room = await chatService.createConversation(
        newConversation.name,
        newConversation.email,
        user.email
      )

      setRooms([room, ...rooms])
      setNewConversation({ name: '', email: '' })
      setShowCreateForm(false)
      
      console.log(`✉️ Invitación enviada a ${newConversation.email}`)
    } catch (error) {
      console.error('Error creating conversation:', error)
      alert('Error al crear la conversación. Por favor, intenta de nuevo.')
    }
  }

  const toggleDone = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const room = rooms.find(r => r.id === roomId)
    const willBeDone = room && !room.isDone
    
    // Actualizar el estado
    const updatedRooms = rooms.map(room => 
      room.id === roomId ? { ...room, isDone: !room.isDone } : room
    )
    setRooms(updatedRooms)
    
    // Si se marcó como done y el modal está abierto, abrir el siguiente
    if (willBeDone && selectedRoom?.id === roomId) {
      // Filtrar según el estado actual de showDone
      const currentFilteredRooms = updatedRooms.filter(r => {
        if (showDone && !r.isDone) return false
        if (!showDone && r.isDone) return false
        return true
      })
      
      const currentIndex = currentFilteredRooms.findIndex(r => r.id === roomId)
      let nextRoom: ChatRoom | null = null
      
      if (currentIndex !== -1 && currentIndex < currentFilteredRooms.length - 1) {
        nextRoom = currentFilteredRooms[currentIndex + 1]
      } else if (currentIndex > 0) {
        nextRoom = currentFilteredRooms[currentIndex - 1]
      }
      
      setSelectedRoom(nextRoom)
    }
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Contenido de la lista - se reduce cuando hay modal */}
      <div className={`h-full flex flex-col transition-all duration-300 origin-top ${selectedRoom ? 'scale-[0.98] opacity-30 pointer-events-none' : 'scale-100 opacity-100'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowDone(!showDone)}
            className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors ${showDone ? 'bg-gray-100 dark:bg-gray-900' : ''}`}
            title={showDone ? 'Mostrar pendientes' : 'Mostrar completados'}
          >
            <Check className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
            title="Buscar"
          >
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
            title="Filtrar"
          >
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={loadConversations}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
            title="Actualizar"
          >
            <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
            title="Nueva conversación"
          >
            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-4 p-4 border border-gray-200 dark:border-white/[0.08] rounded-lg bg-gray-50 dark:bg-black">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Nueva Conversación</h3>
          <form onSubmit={createConversation} className="space-y-3">
            <input
              type="email"
              placeholder="Email del participante"
              value={newConversation.email}
              onChange={(e) => setNewConversation({ ...newConversation, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-white/[0.08] rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Título de conversación (opcional)"
              value={newConversation.name}
              onChange={(e) => setNewConversation({ ...newConversation, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-white/[0.08] rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Crear e invitar
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Cargando conversaciones...</p>
          </div>
        ) : rooms.filter(room => showDone ? room.isDone : !room.isDone).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">
              {showDone ? 'No hay conversaciones completadas' : 'No hay conversaciones. Crea una nueva para empezar.'}
            </p>
          </div>
        ) : (
        <div className="space-y-3">
          {rooms.filter(room => showDone ? room.isDone : !room.isDone).map((room) => (
            <div
              key={room.id}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              onClick={() => setSelectedRoom(room)}
              className={`card-hover p-3 rounded-lg border cursor-pointer bg-white dark:bg-black border-gray-200 dark:border-white/[0.08] relative ${!room.isActive ? 'opacity-50' : ''}`}
            >
              {/* Done button on hover */}
              {hoveredRoom === room.id && (
                <button
                  onClick={(e) => toggleDone(room.id, e)}
                  className="absolute top-2 right-2 p-1.5 bg-white dark:bg-black rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors z-10"
                  title={room.isDone ? 'Marcar como pendiente' : 'Marcar como completado'}
                >
                  <Check className={`w-4 h-4 ${room.isDone ? 'text-gray-900 dark:text-white fill-current' : 'text-gray-500 dark:text-gray-400'}`} />
                </button>
              )}
              <div className="h-[60px] flex flex-col justify-between">
                {/* Fila 1: Título y estado */}
                <div className="flex items-center justify-between h-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate flex-1 text-sm">{room.name}</h3>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${room.isActive ? 'bg-gray-600 dark:bg-gray-400' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                </div>
                
                {/* Fila 2: Participantes */}
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 h-5">
                  <span className="text-xs">{room.participants.length} participantes</span>
                </div>
                
                {/* Fila 3: Último mensaje (placeholder) */}
                <p className="text-gray-400 dark:text-gray-500 truncate h-5 text-xs">
                  {room.isActive ? 'Conversación activa' : 'Sin actividad reciente'}
                </p>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
      </div>

      {/* Stack Modal dentro de la columna */}
      {selectedRoom && (
        <ModalWrapper>
          <ChatDetailModal
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
          />
        </ModalWrapper>
      )}
    </div>
  )
}

export default ChatPanelSimple
