import React, { useState } from 'react'
import ChatDetailModal from '../modals/ChatDetailModal'
import ModalWrapper from '../modals/ModalWrapper'

interface ChatRoom {
  id: string
  name: string
  participants: string[]
  isActive: boolean
}

const ChatPanelSimple: React.FC = () => {
  const [rooms] = useState<ChatRoom[]>([
    { id: '1', name: 'General', participants: ['user1@example.com', 'user2@example.com'], isActive: true },
    { id: '2', name: 'Proyecto Alpha', participants: ['user1@example.com', 'user3@example.com'], isActive: false },
    { id: '3', name: 'Soporte', participants: ['user1@example.com', 'soporte@example.com'], isActive: false }
  ])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 ${!room.isActive ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{room.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {room.participants.length} participantes
                  </p>
                </div>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {rooms.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No hay conversaciones</p>
        </div>
      )}

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
