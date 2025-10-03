import React, { useState } from 'react'

const ChatPanelSimple: React.FC = () => {
  const [rooms] = useState([
    { id: '1', name: 'General', participants: ['user1@example.com', 'user2@example.com'] },
    { id: '2', name: 'Proyecto Alpha', participants: ['user1@example.com', 'user3@example.com'] }
  ])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-3 rounded-lg border cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
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
