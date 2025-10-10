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
        
        // Crear el email en formato MIME
        const subject = 'Invitación a chat en Sensa OS'
        const body = `
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #000;">Has sido invitado a un chat</h2>
              <p>${currentUserEmail} te ha invitado a una conversación en Sensa OS.</p>
              <p><strong>Nombre de la conversación:</strong> ${room.name}</p>
              <div style="margin: 30px 0;">
                <a href="${inviteLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Unirse a la conversación
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">O copia este enlace: ${inviteLink}</p>
            </body>
          </html>
        `
        
        const emailLines = [
          `To: ${invitedEmail}`,
          `Subject: ${subject}`,
          'Content-Type: text/html; charset=utf-8',
          '',
          body
        ]
        
        const email = emailLines.join('\r\n')
        const encodedEmail = btoa(unescape(encodeURIComponent(email)))
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
      
      return roomMessages.sort((a, b) => 
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
