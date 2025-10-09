import React, { useState } from 'react'
import { Search, Filter, RefreshCw, Plus, Users } from 'lucide-react'
import ChatDetailModal from '../modals/ChatDetailModal'
import ModalWrapper from '../modals/ModalWrapper'

interface ChatRoom {
  id: string
  name: string
  participants: string[]
  isActive: boolean
}

const ChatPanelSimple: React.FC = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([
    { id: '1', name: 'General', participants: ['user1@example.com', 'user2@example.com'], isActive: true },
    { id: '2', name: 'Proyecto Alpha', participants: ['user1@example.com', 'user3@example.com'], isActive: false },
    { id: '3', name: 'Soporte', participants: ['user1@example.com', 'soporte@example.com'], isActive: false }
  ])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newConversation, setNewConversation] = useState({
    name: '',
    email: ''
  })

  const createConversation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newConversation.email.trim()) return

    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      name: newConversation.name || newConversation.email,
      participants: [newConversation.email],
      isActive: true
    }

    setRooms([newRoom, ...rooms])
    setNewConversation({ name: '', email: '' })
    setShowCreateForm(false)

    // Aquí se enviaría el email de invitación
    console.log('Invitación enviada a:', newConversation.email)
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
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
            title="Actualizar"
          >
            <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
            title="Nueva conversación"
          >
            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-black">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Nueva Conversación</h3>
          <form onSubmit={createConversation} className="space-y-3">
            <input
              type="email"
              placeholder="Email del participante"
              value={newConversation.email}
              onChange={(e) => setNewConversation({ ...newConversation, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Título de conversación (opcional)"
              value={newConversation.name}
              onChange={(e) => setNewConversation({ ...newConversation, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
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
        <div className="space-y-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`card-hover p-3 rounded-lg border cursor-pointer bg-white dark:bg-black border-gray-200 dark:border-gray-700 ${!room.isActive ? 'opacity-50' : ''}`}
            >
              {/* Fila 1: Título y estado */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate flex-1">{room.name}</h3>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${room.isActive ? 'bg-gray-600 dark:bg-gray-400' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
              </div>
              
              {/* Fila 2: Participantes */}
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>{room.participants.length} participantes</span>
              </div>
              
              {/* Fila 3: Último mensaje (placeholder) */}
              <p className="text-gray-400 dark:text-gray-500 truncate mt-1">
                {room.isActive ? 'Conversación activa' : 'Sin actividad reciente'}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {rooms.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No hay conversaciones</p>
        </div>
      )}
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
