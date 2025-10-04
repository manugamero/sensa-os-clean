import React, { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'

const ChatPanelSimple: React.FC = () => {
  const [rooms] = useState([
    { id: '1', name: 'General', participants: ['user1@example.com', 'user2@example.com'] },
    { id: '2', name: 'Proyecto Alpha', participants: ['user1@example.com', 'user3@example.com'] }
  ])

  return (
    <div className="h-full flex flex-col">
      {/* Header con iconos colapsados */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title="Buscar"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title="Filtros"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title="Nueva conversación"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{room.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {room.participants.length} participantes
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
    </div>
  )
}

export default ChatPanelSimple
