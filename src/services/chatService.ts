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

      // Crear la conversación localmente
      const room: ChatRoom = {
        id: Date.now().toString(),
        name: name || `Chat con ${invitedEmail}`,
        participants: [currentUserEmail, invitedEmail],
        createdBy: currentUserEmail,
        createdAt: new Date().toISOString(),
        isActive: true
      }

      // Enviar email de invitación usando Gmail API
      try {
        const inviteLink = `https://sos001.vercel.app/?join=${room.id}`
        
        // Crear el email en formato MIME correcto
        const subject = 'Invitation to chat in Sensa OS'
        const htmlBody = `<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #000;">You have been invited to a chat</h2>
  <p>${currentUserEmail} has invited you to a conversation in Sensa OS.</p>
  <p><strong>Conversation name:</strong> ${room.name}</p>
  <div style="margin: 30px 0;">
    <a href="${inviteLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Join conversation
    </a>
  </div>
  <p style="color: #666; font-size: 14px;">Or copy this link: ${inviteLink}</p>
</body>
</html>`
        
        // Construir el mensaje MIME
        const messageParts = [
          `To: ${invitedEmail}`,
          `Subject: ${subject}`,
          'MIME-Version: 1.0',
          'Content-Type: text/html; charset=UTF-8',
          '',
          htmlBody
        ]
        
        const message = messageParts.join('\r\n')
        
        // Encoding UTF-8 seguro para base64
        const uint8array = new TextEncoder().encode(message)
        const binaryString = String.fromCharCode(...uint8array)
        const encodedEmail = btoa(binaryString)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '')

        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${validToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            raw: encodedEmail
          })
        })

        if (response.ok) {
          console.log(`✉️ Email de invitación enviado a ${invitedEmail}`)
        } else {
          const errorData = await response.json()
          console.warn('No se pudo enviar el email de invitación:', errorData)
        }
      } catch (emailError) {
        console.error('Error enviando email:', emailError)
        // No fallar si el email no se puede enviar
      }

      // Guardar en localStorage para persistencia
      const savedRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]')
      savedRooms.push(room)
      localStorage.setItem('chatRooms', JSON.stringify(savedRooms))

      return room
    } catch (error) {
      console.error('Error creating conversation:', error)
      throw error
    }
  },

  // Obtener conversaciones del usuario actual
  async getUserConversations(userEmail: string): Promise<ChatRoom[]> {
    try {
      // Cargar desde localStorage
      const savedRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]')
      
      // Filtrar conversaciones donde el usuario es participante
      const userRooms = savedRooms.filter((room: ChatRoom) => 
        room.participants.includes(userEmail)
      )
      
      return userRooms
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  },

  // Obtener mensajes de una conversación
  async getRoomMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      // Cargar desde localStorage
      const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
      
      // Filtrar mensajes de esta conversación
      const roomMessages = savedMessages.filter((msg: ChatMessage) => 
        msg.roomId === roomId
      )
      
      return roomMessages.sort((a: ChatMessage, b: ChatMessage) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  },

  // Enviar un mensaje
  async sendMessage(roomId: string, content: string, senderEmail: string): Promise<ChatMessage> {
    try {
      const message: ChatMessage = {
        id: Date.now().toString(),
        roomId,
        sender: senderEmail,
        content,
        timestamp: new Date().toISOString()
      }

      // Guardar en localStorage
      const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
      savedMessages.push(message)
      localStorage.setItem('chatMessages', JSON.stringify(savedMessages))

      return message
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }
}
