import { tokenService } from './tokenService'

export const gmailService = {
  async getEmails(_accessToken?: string): Promise<any> {
    try {
      // Obtener token válido
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      console.log('Fetching emails directly from Gmail API')

      // Primero obtener la lista de mensajes
      const listResponse = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&labelIds=INBOX',
        {
          headers: {
            'Authorization': `Bearer ${validToken}`
          }
        }
      )

      if (!listResponse.ok) {
        const errorData = await listResponse.json()
        console.error('Gmail API error:', errorData)
        throw new Error(`Failed to fetch emails: ${errorData.error?.message || 'Unknown error'}`)
      }

      const listData = await listResponse.json()
      const messages = listData.messages || []

      // Obtener detalles de cada mensaje con formato completo
      const emailPromises = messages.slice(0, 10).map(async (msg: any) => {
        const detailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
          {
            headers: {
              'Authorization': `Bearer ${validToken}`
            }
          }
        )
        
        if (detailResponse.ok) {
          const detail = await detailResponse.json()
          const headers = detail.payload?.headers || []
          const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || ''
          
          // Decodificar base64 con UTF-8 correcto
          const decodeBase64 = (data: string): string => {
            try {
              // Convertir de URL-safe base64 a base64 normal
              const base64 = data.replace(/-/g, '+').replace(/_/g, '/')
              
              // Decodificar base64 a string binario
              const binaryString = atob(base64)
              
              // Convertir bytes a UTF-8
              const bytes = new Uint8Array(binaryString.length)
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
              }
              
              // Decodificar UTF-8 correctamente
              return new TextDecoder('utf-8').decode(bytes)
            } catch (error) {
              console.error('Error decoding base64:', error)
              // Fallback: intentar decodificación simple
              try {
                return atob(data.replace(/-/g, '+').replace(/_/g, '/'))
              } catch {
                return ''
              }
            }
          }
          
          // Limpiar contenido HTML y extraer solo el texto nuevo (sin citas)
          const cleanEmailContent = (content: string): string => {
            // Si es HTML, intentar extraer solo el texto nuevo
            if (content.includes('<') && content.includes('>')) {
              // Crear un elemento temporal para parsear HTML
              const div = document.createElement('div')
              div.innerHTML = content
              
              // Remover elementos de citas comunes
              const quotesToRemove = div.querySelectorAll('blockquote, .gmail_quote, .gmail_quote_container')
              quotesToRemove.forEach(quote => quote.remove())
              
              // Obtener texto limpio
              let text = div.textContent || div.innerText || ''
              
              // Limpiar espacios extra
              text = text.replace(/\n{3,}/g, '\n\n').trim()
              
              return text
            }
            
            // Si es texto plano, remover líneas de citas
            const lines = content.split('\n')
            const cleanLines: string[] = []
            let inQuote = false
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i]
              
              // Detectar inicio de cita
              if (
                line.startsWith('>') ||
                line.startsWith('On ') && line.includes(' wrote:') ||
                line.match(/^From:.*$/i) ||
                line.match(/^Sent:.*$/i) ||
                line.match(/^To:.*$/i) ||
                line.match(/^Subject:.*$/i) ||
                line.match(/^Date:.*$/i) ||
                line.match(/^Cc:.*$/i) ||
                line.includes('________________________________')
              ) {
                inQuote = true
                continue
              }
              
              // Si no estamos en cita, agregar línea
              if (!inQuote) {
                cleanLines.push(line)
              }
              
              // Detectar posible fin de cita (línea vacía después de cita)
              if (inQuote && line.trim() === '' && i < lines.length - 1) {
                const nextLine = lines[i + 1]
                if (nextLine && !nextLine.startsWith('>') && nextLine.trim() !== '') {
                  inQuote = false
                }
              }
            }
            
            return cleanLines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
          }
          
          // Extraer cuerpo del email
          const getBody = (payload: any): string => {
            let rawContent = ''
            
            if (payload.body?.data) {
              rawContent = decodeBase64(payload.body.data)
            } else if (payload.parts) {
              for (const part of payload.parts) {
                if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
                  if (part.body?.data) {
                    rawContent = decodeBase64(part.body.data)
                    break
                  }
                }
                if (part.parts) {
                  const body = getBody(part)
                  if (body) {
                    rawContent = body
                    break
                  }
                }
              }
            }
            
            return cleanEmailContent(rawContent)
          }
          
          // Extraer attachments
          const getAttachments = (payload: any): any[] => {
            const attachments: any[] = []
            const extractAttachments = (parts: any[]) => {
              if (!parts) return
              for (const part of parts) {
                if (part.filename && part.body?.attachmentId) {
                  attachments.push({
                    filename: part.filename,
                    mimeType: part.mimeType,
                    size: part.body.size,
                    attachmentId: part.body.attachmentId
                  })
                }
                if (part.parts) {
                  extractAttachments(part.parts)
                }
              }
            }
            extractAttachments(payload.parts || [])
            return attachments
          }
          
          return {
            id: detail.id,
            threadId: detail.threadId,
            subject: getHeader('Subject') || '(Sin asunto)',
            from: getHeader('From') || 'Desconocido',
            to: getHeader('To') || '',
            snippet: detail.snippet || '',
            body: getBody(detail.payload),
            date: getHeader('Date') || new Date().toISOString(),
            isRead: !detail.labelIds?.includes('UNREAD'),
            hasAttachments: getAttachments(detail.payload).length > 0,
            attachments: getAttachments(detail.payload)
          }
        }
        return null
      })

      const emails = (await Promise.all(emailPromises)).filter(e => e !== null)
      console.log('Gmail API success:', emails.length, 'emails')
      return emails
    } catch (error) {
      console.error('Error fetching emails:', error)
      throw error
    }
  },

  async markAsRead(accessToken: string, emailId: string): Promise<any> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      const response = await fetch(`/api/gmail/emails/${emailId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${validToken}`
        },
        body: JSON.stringify({ accessToken: validToken })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        const shouldRetry = await tokenService.handleApiError(errorData)
        if (shouldRetry) {
          return await this.markAsRead(accessToken, emailId)
        }
        throw new Error('Failed to mark email as read')
      }
      
      return response.json()
    } catch (error) {
      console.error('Error marking email as read:', error)
      throw error
    }
  },

  async getThread(threadId: string): Promise<any[]> {
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
        throw new Error('Failed to fetch thread')
      }

      const threadData = await response.json()
      const messages = threadData.messages || []

      // Decodificar base64 con UTF-8 correcto
      const decodeBase64 = (data: string): string => {
        try {
          const base64 = data.replace(/-/g, '+').replace(/_/g, '/')
          const binaryString = atob(base64)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          return new TextDecoder('utf-8').decode(bytes)
        } catch (error) {
          console.error('Error decoding base64:', error)
          try {
            return atob(data.replace(/-/g, '+').replace(/_/g, '/'))
          } catch {
            return ''
          }
        }
      }

      // Limpiar contenido HTML y extraer solo el texto nuevo (sin citas)
      const cleanEmailContent = (content: string): string => {
        // Si es HTML, intentar extraer solo el texto nuevo
        if (content.includes('<') && content.includes('>')) {
          const div = document.createElement('div')
          div.innerHTML = content
          
          // Remover elementos de citas comunes
          const quotesToRemove = div.querySelectorAll('blockquote, .gmail_quote, .gmail_quote_container')
          quotesToRemove.forEach(quote => quote.remove())
          
          let text = div.textContent || div.innerText || ''
          text = text.replace(/\n{3,}/g, '\n\n').trim()
          
          return text
        }
        
        // Si es texto plano, remover líneas de citas
        const lines = content.split('\n')
        const cleanLines: string[] = []
        let inQuote = false
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          
          if (
            line.startsWith('>') ||
            line.startsWith('On ') && line.includes(' wrote:') ||
            line.match(/^From:.*$/i) ||
            line.match(/^Sent:.*$/i) ||
            line.match(/^To:.*$/i) ||
            line.match(/^Subject:.*$/i) ||
            line.match(/^Date:.*$/i) ||
            line.match(/^Cc:.*$/i) ||
            line.includes('________________________________')
          ) {
            inQuote = true
            continue
          }
          
          if (!inQuote) {
            cleanLines.push(line)
          }
          
          if (inQuote && line.trim() === '' && i < lines.length - 1) {
            const nextLine = lines[i + 1]
            if (nextLine && !nextLine.startsWith('>') && nextLine.trim() !== '') {
              inQuote = false
            }
          }
        }
        
        return cleanLines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
      }

      const getBody = (payload: any): string => {
        let rawContent = ''
        
        if (payload.body?.data) {
          rawContent = decodeBase64(payload.body.data)
        } else if (payload.parts) {
          for (const part of payload.parts) {
            if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
              if (part.body?.data) {
                rawContent = decodeBase64(part.body.data)
                break
              }
            }
            if (part.parts) {
              const body = getBody(part)
              if (body) {
                rawContent = body
                break
              }
            }
          }
        }
        
        return cleanEmailContent(rawContent)
      }

      const getAttachments = (payload: any): any[] => {
        const attachments: any[] = []
        const extractAttachments = (parts: any[]) => {
          if (!parts) return
          for (const part of parts) {
            if (part.filename && part.body?.attachmentId) {
              attachments.push({
                filename: part.filename,
                mimeType: part.mimeType,
                size: part.body.size,
                attachmentId: part.body.attachmentId
              })
            }
            if (part.parts) {
              extractAttachments(part.parts)
            }
          }
        }
        extractAttachments(payload.parts || [])
        return attachments
      }

      // Procesar cada mensaje del thread
      return messages.map((msg: any) => {
        const headers = msg.payload?.headers || []
        const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || ''
        
        return {
          id: msg.id,
          subject: getHeader('Subject') || '(Sin asunto)',
          from: getHeader('From') || 'Desconocido',
          to: getHeader('To') || '',
          snippet: msg.snippet || '',
          body: getBody(msg.payload),
          date: getHeader('Date') || new Date().toISOString(),
          isRead: !msg.labelIds?.includes('UNREAD'),
          hasAttachments: getAttachments(msg.payload).length > 0,
          attachments: getAttachments(msg.payload)
        }
      })
    } catch (error) {
      console.error('Error fetching thread:', error)
      throw error
    }
  },

  async downloadAttachment(messageId: string, attachmentId: string): Promise<Blob> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`,
        {
          headers: {
            'Authorization': `Bearer ${validToken}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to download attachment')
      }

      const data = await response.json()
      
      // Convertir base64 a blob
      const base64 = data.data.replace(/-/g, '+').replace(/_/g, '/')
      const binaryString = atob(base64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      return new Blob([bytes])
    } catch (error) {
      console.error('Error downloading attachment:', error)
      throw error
    }
  }
}
