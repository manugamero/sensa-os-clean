import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'
import { Users, Filter, Search, Hash, User } from 'lucide-react'

interface Message {
  id: string
  content: string
  author: string
  authorEmail: string
  timestamp: string
  type: 'text' | 'image' | 'audio' | 'file'
  fileUrl?: string
  fileName?: string
}

interface ChatRoom {
  id: string
  name: string
  participants: string[]
  lastMessage?: Message
}

const ChatPanel: React.FC = () => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomParticipants, setNewRoomParticipants] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'group' | 'active'>('all')

  useEffect(() => {
    loadRooms()
    
    if (socket) {
      socket.on('message:received', (message: Message) => {
      setMessages(prev => [...prev, message])
      })
      
      socket.on('room:created', (room: ChatRoom) => {
        setRooms(prev => [...prev, room])
      })
      
      socket.on('room:joined', (room: ChatRoom) => {
        setRooms(prev => [...prev, room])
      })
    }

    return () => {
      if (socket) {
        socket.off('message:received')
        socket.off('room:created')
        socket.off('room:joined')
      }
    }
  }, [socket])

  useEffect(() => {
    if (currentRoom) {
      loadMessages(currentRoom.id)
    }
  }, [currentRoom])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadRooms = async () => {
    try {
      const token = await user?.getIdToken()
      const roomsData = await chatService.getRooms(token)
      setRooms(roomsData)
    } catch (error) {
      console.error('Error loading rooms:', error)
    }
  }

  const loadMessages = async (roomId: string) => {
    try {
      const token = await user?.getIdToken()
      const messagesData = await chatService.getMessages(token, roomId)
      setMessages(messagesData)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = await user?.getIdToken()
      const participants = newRoomParticipants
        .split(',')
        .map(email => email.trim())
        .filter(email => email)

      const room = await chatService.createRoom(token, {
        name: newRoomName,
        participants
      })

      setNewRoomName('')
      setNewRoomParticipants('')
      setShowCreateRoom(false)
      setCurrentRoom(room)
    } catch (error) {
      console.error('Error creating room:', error)
    }
  }

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase())
    if (!matchesSearch) return false

    switch (filterType) {
      case 'direct':
        return room.participants.length === 2
      case 'group':
        return room.participants.length > 2
      case 'active':
        return room.lastMessage && new Date(room.lastMessage.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      default:
        return true
    }
  })

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentRoom) return

    try {
      const token = await user?.getIdToken()
      await chatService.sendMessage(token, currentRoom.id, {
        content: newMessage,
        type: 'text'
      })

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentRoom) return

    try {
      const token = await user?.getIdToken()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('roomId', currentRoom.id)

      await chatService.uploadFile(token, formData)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    // Implement audio recording logic here
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Implement audio recording stop logic here
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const detectLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:underline">$1</a>')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filtros y búsqueda */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title="Filtros"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        
        {showFilters && (
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
              onClick={() => setFilterType('direct')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'direct' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <User className="w-3 h-3 inline mr-1" />
              Directos
            </button>
            <button
              onClick={() => setFilterType('group')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'group' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="w-3 h-3 inline mr-1" />
              Grupos
            </button>
            <button
              onClick={() => setFilterType('active')}
              className={`px-2 py-1 rounded text-xs ${
                filterType === 'active' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Hash className="w-3 h-3 inline mr-1" />
              Activos
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {showCreateRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Nueva conversación</h2>
            <form onSubmit={createRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la conversación
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participantes (emails separados por comas)
                </label>
                <input
                  type="text"
                  value={newRoomParticipants}
                  onChange={(e) => setNewRoomParticipants(e.target.value)}
                  className="input-field"
                  placeholder="usuario1@email.com, usuario2@email.com"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Crear conversación
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateRoom(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
        )}

        <div className="space-y-3">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {rooms.length === 0 ? 'No hay conversaciones' : 'No se encontraron conversaciones con los filtros aplicados'}
            </p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setCurrentRoom(room)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                currentRoom?.id === room.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">{room.name}</h3>
              {room.lastMessage && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {room.lastMessage.content}
                </p>
              )}
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
