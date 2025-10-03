import { tokenService } from './tokenService'

export const gmailService = {
  async getEmails(accessToken?: string) {
    try {
      // Obtener token válido
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      console.log('Sending Gmail request with token:', validToken)

      const response = await fetch('/api/gmail/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${validToken}`
        },
        body: JSON.stringify({ accessToken: validToken })
      })

      console.log('Gmail API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Gmail API error response:', errorData)
        
        // Intentar manejar el error de credenciales
        const shouldRetry = await tokenService.handleApiError(errorData)
        if (shouldRetry) {
          // Reintentar con el nuevo token
          return await this.getEmails()
        }
        
        throw new Error(`Failed to fetch emails: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      console.log('Gmail API success response:', data)
      return data
    } catch (error) {
      console.error('Error fetching emails:', error)
      throw error
    }
  },

  async markAsRead(accessToken: string, emailId: string) {
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
