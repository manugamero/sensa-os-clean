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

      // Obtener detalles de cada mensaje
      const emailPromises = messages.slice(0, 10).map(async (msg: any) => {
        const detailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
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
          
          return {
            id: detail.id,
            subject: getHeader('Subject') || '(Sin asunto)',
            from: getHeader('From') || 'Desconocido',
            snippet: detail.snippet || '',
            date: getHeader('Date') || new Date().toISOString(),
            isRead: !detail.labelIds?.includes('UNREAD'),
            hasAttachments: detail.payload?.parts?.some((p: any) => p.filename) || false
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
