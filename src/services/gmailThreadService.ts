import { tokenService } from './tokenService'

interface ThreadMessage {
  id: string
  from: string
  content: string
  date: string
}

interface EmailThread {
  id: string
  subject: string
  participants: string[]
  lastMessage: string
  lastMessageDate: string
  unreadCount: number
  messages: ThreadMessage[]
}

export const gmailThreadService = {
  /**
   * Obtener todos los threads (conversaciones)
   */
  async getThreads(): Promise<EmailThread[]> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      console.log('Fetching Gmail threads...')

      // Obtener lista de threads
      const listResponse = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=20',
        {
          headers: {
            'Authorization': `Bearer ${validToken}`
          }
        }
      )

      if (!listResponse.ok) {
        const errorData = await listResponse.json()
        console.error('Gmail Threads API error:', errorData)
        throw new Error(`Failed to fetch threads: ${errorData.error?.message || 'Unknown error'}`)
      }

      const listData = await listResponse.json()
      const threads = listData.threads || []

      // Obtener detalles de cada thread
      const threadPromises = threads.slice(0, 15).map(async (thread: any) => {
        const detailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/threads/${thread.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
          {
            headers: {
              'Authorization': `Bearer ${validToken}`
            }
          }
        )

        if (detailResponse.ok) {
          const detail = await detailResponse.json()
          const messages = detail.messages || []
          
          if (messages.length === 0) return null

          // Obtener información del primer mensaje (subject)
          const firstMessage = messages[0]
          const firstHeaders = firstMessage.payload?.headers || []
          const getHeader = (headers: any[], name: string) => 
            headers.find((h: any) => h.name === name)?.value || ''

          const subject = getHeader(firstHeaders, 'Subject') || '(Sin asunto)'

          // Obtener información del último mensaje
          const lastMessage = messages[messages.length - 1]
          const lastHeaders = lastMessage.payload?.headers || []
          const lastDate = getHeader(lastHeaders, 'Date') || new Date().toISOString()

          // Extraer participantes únicos
          const participantsSet = new Set<string>()
          messages.forEach((msg: any) => {
            const headers = msg.payload?.headers || []
            const from = getHeader(headers, 'From')
            if (from) {
              // Extraer email del formato "Name <email@domain.com>"
              const emailMatch = from.match(/<(.+?)>/) || [null, from]
              if (emailMatch[1]) participantsSet.add(emailMatch[1])
            }
          })

          // Contar mensajes no leídos
          const unreadCount = messages.filter((msg: any) => 
            msg.labelIds?.includes('UNREAD')
          ).length

          // Parsear mensajes para el thread
          const threadMessages: ThreadMessage[] = messages.map((msg: any) => {
            const headers = msg.payload?.headers || []
            const from = getHeader(headers, 'From')
            const date = getHeader(headers, 'Date')
            
            // Obtener contenido del mensaje
            let content = msg.snippet || ''
            
            return {
              id: msg.id,
              from: from || 'Desconocido',
              content,
              date: date || new Date().toISOString()
            }
          })

          return {
            id: detail.id,
            subject,
            participants: Array.from(participantsSet),
            lastMessage: lastMessage.snippet || '',
            lastMessageDate: lastDate,
            unreadCount,
            messages: threadMessages
          }
        }
        return null
      })

      const threadDetails = (await Promise.all(threadPromises)).filter(t => t !== null) as EmailThread[]
      console.log('Gmail Threads API success:', threadDetails.length, 'threads')
      return threadDetails

    } catch (error) {
      console.error('Error fetching Gmail threads:', error)
      throw error
    }
  },

  /**
   * Obtener un thread específico con todos sus mensajes
   */
  async getThread(threadId: string): Promise<EmailThread | null> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}?format=full`,
        {
          headers: {
            'Authorization': `Bearer ${validToken}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch thread details')
      }

      const detail = await response.json()
      const messages = detail.messages || []

      if (messages.length === 0) return null

      // Procesar igual que en getThreads pero con formato full
      const firstMessage = messages[0]
      const firstHeaders = firstMessage.payload?.headers || []
      const getHeader = (headers: any[], name: string) => 
        headers.find((h: any) => h.name === name)?.value || ''

      const subject = getHeader(firstHeaders, 'Subject') || '(Sin asunto)'

      const lastMessage = messages[messages.length - 1]
      const lastHeaders = lastMessage.payload?.headers || []
      const lastDate = getHeader(lastHeaders, 'Date') || new Date().toISOString()

      const participantsSet = new Set<string>()
      messages.forEach((msg: any) => {
        const headers = msg.payload?.headers || []
        const from = getHeader(headers, 'From')
        if (from) {
          const emailMatch = from.match(/<(.+?)>/) || [null, from]
          if (emailMatch[1]) participantsSet.add(emailMatch[1])
        }
      })

      const unreadCount = messages.filter((msg: any) => 
        msg.labelIds?.includes('UNREAD')
      ).length

      const threadMessages: ThreadMessage[] = messages.map((msg: any) => {
        const headers = msg.payload?.headers || []
        const from = getHeader(headers, 'From')
        const date = getHeader(headers, 'Date')
        
        // Extraer contenido completo del mensaje
        let content = ''
        if (msg.payload?.body?.data) {
          content = atob(msg.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'))
        } else if (msg.payload?.parts) {
          const textPart = msg.payload.parts.find((p: any) => p.mimeType === 'text/plain')
          if (textPart?.body?.data) {
            content = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'))
          }
        }
        
        return {
          id: msg.id,
          from: from || 'Desconocido',
          content: content || msg.snippet || '',
          date: date || new Date().toISOString()
        }
      })

      return {
        id: detail.id,
        subject,
        participants: Array.from(participantsSet),
        lastMessage: lastMessage.snippet || '',
        lastMessageDate: lastDate,
        unreadCount,
        messages: threadMessages
      }

    } catch (error) {
      console.error('Error fetching thread:', error)
      throw error
    }
  },

  /**
   * Enviar un mensaje (reply) a un thread existente
   */
  async replyToThread(threadId: string, content: string): Promise<any> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      // Primero obtener el thread para sacar el subject y recipients
      const thread = await this.getThread(threadId)
      if (!thread) {
        throw new Error('Thread not found')
      }

      // Crear el mensaje en formato RFC 2822
      const to = thread.participants.filter(p => p !== 'me').join(', ')
      const subject = thread.subject.startsWith('Re:') ? thread.subject : `Re: ${thread.subject}`
      
      const messageParts = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        '',
        content
      ]
      
      const message = messageParts.join('\r\n')
      const encodedMessage = btoa(unescape(encodeURIComponent(message)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${validToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            raw: encodedMessage,
            threadId: threadId
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Gmail Send API error:', errorData)
        throw new Error(`Failed to send message: ${errorData.error?.message || 'Unknown error'}`)
      }

      const result = await response.json()
      console.log('Message sent successfully:', result.id)
      return result

    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  },

  /**
   * Crear un nuevo thread (nuevo email/conversación)
   */
  async createThread(to: string, subject: string, content: string = ''): Promise<any> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      // Crear el mensaje en formato RFC 2822
      const messageParts = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        '',
        content || 'Conversación iniciada desde Sensa OS'
      ]
      
      const message = messageParts.join('\r\n')
      const encodedMessage = btoa(unescape(encodeURIComponent(message)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${validToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            raw: encodedMessage
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Gmail Send API error:', errorData)
        throw new Error(`Failed to create thread: ${errorData.error?.message || 'Unknown error'}`)
      }

      const result = await response.json()
      console.log('Thread created successfully:', result.id)
      return result

    } catch (error) {
      console.error('Error creating thread:', error)
      throw error
    }
  },

  /**
   * Marcar thread como leído
   */
  async markThreadAsRead(threadId: string): Promise<any> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}/modify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${validToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            removeLabelIds: ['UNREAD']
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to mark thread as read')
      }

      return response.json()

    } catch (error) {
      console.error('Error marking thread as read:', error)
      throw error
    }
  }
}
