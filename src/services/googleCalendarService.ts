import { tokenService } from './tokenService'

interface CreateEventData {
  summary: string
  start: Date
  end: Date
  attendees: Array<{ email: string }>
  description?: string
}

export const googleCalendarService = {
  async getEvents(accessToken?: string) {
    try {
      // Obtener token válido
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      console.log('Sending Calendar request with token:', validToken)

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${validToken}`
        },
        body: JSON.stringify({ accessToken: validToken })
      })

      console.log('Calendar API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Calendar API error response:', errorData)
        
        // Intentar manejar el error de credenciales
        const shouldRetry = await tokenService.handleApiError(errorData)
        if (shouldRetry) {
          // Reintentar con el nuevo token
          return await this.getEvents()
        }
        
        throw new Error(`Failed to fetch events: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      console.log('Calendar API success response:', data)
      return data
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  },

  async createEvent(accessToken: string, eventData: CreateEventData) {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      const response = await fetch('/api/calendar/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${validToken}`
        },
        body: JSON.stringify({
          accessToken: validToken,
          summary: eventData.summary,
          start: {
            dateTime: eventData.start.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: eventData.end.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          attendees: eventData.attendees,
          description: eventData.description,
          conferenceData: {
            createRequest: {
              requestId: Math.random().toString(36).substring(7),
              conferenceSolutionKey: {
                type: 'hangoutsMeet'
              }
            }
          }
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        const shouldRetry = await tokenService.handleApiError(errorData)
        if (shouldRetry) {
          return await this.createEvent(accessToken, eventData)
        }
        throw new Error('Failed to create event')
      }
      
      return response.json()
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }
}
