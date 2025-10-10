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
          
          // Extraer cuerpo del email
          const getBody = (payload: any): string => {
            if (payload.body?.data) {
              return decodeBase64(payload.body.data)
            }
            if (payload.parts) {
              for (const part of payload.parts) {
                if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
                  if (part.body?.data) {
                    return decodeBase64(part.body.data)
                  }
                }
                if (part.parts) {
                  const body = getBody(part)
                  if (body) return body
                }
              }
            }
            return ''
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
  }
}
