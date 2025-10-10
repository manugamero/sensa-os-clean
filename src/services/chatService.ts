import { tokenService } from './tokenService'

export interface ChatRoom {
  id: string
  name: string
  participants: string[] // emails de los participantes
  createdBy: string // email del creador
  createdAt: string
  isActive: boolean
  isDone?: boolean
}

export interface ChatMessage {
  id: string
  roomId: string
  sender: string // email del remitente
  content: string
  timestamp: string
}

export const chatService = {
  // Crear una nueva conversación y enviar invitación
  async createConversation(
    name: string,
    invitedEmail: string,
    currentUserEmail: string
  ): Promise<ChatRoom> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${validToken}`
        },
        body: JSON.stringify({
          name,
          invitedEmail,
          currentUserEmail
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create conversation')
      }

      const data = await response.json()
      return data.room
    } catch (error) {
      console.error('Error creating conversation:', error)
      throw error
    }
  },

  // Obtener conversaciones del usuario actual
  async getUserConversations(userEmail: string): Promise<ChatRoom[]> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      const response = await fetch(`/api/chat/rooms?email=${encodeURIComponent(userEmail)}`, {
        headers: {
          'Authorization': `Bearer ${validToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const data = await response.json()
      return data.rooms || []
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  },

  // Obtener mensajes de una conversación
  async getRoomMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${validToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      return data.messages || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  },

  // Enviar un mensaje
  async sendMessage(roomId: string, content: string, senderEmail: string): Promise<ChatMessage> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${validToken}`
        },
        body: JSON.stringify({
          content,
          senderEmail
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      return data.message
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }
}
