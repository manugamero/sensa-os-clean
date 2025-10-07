import { tokenService } from './tokenService'

interface CreateEventData {
  summary: string
  start: Date
  end: Date
  attendees: Array<{ email: string }>
  description?: string
}

export const googleCalendarService = {
  async getEvents(_accessToken?: string): Promise<any> {
    try {
      // Obtener token válido
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      console.log('Fetching calendar events directly from Google API')

      // Llamar directamente a la API de Google Calendar
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=' + new Date().toISOString(),
        {
          headers: {
            'Authorization': `Bearer ${validToken}`
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Google Calendar API error:', errorData)
        throw new Error(`Failed to fetch events: ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      console.log('Google Calendar API success:', data.items?.length || 0, 'events')
      return data.items || []
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  },

  async createEvent(accessToken: string, eventData: CreateEventData): Promise<any> {
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
