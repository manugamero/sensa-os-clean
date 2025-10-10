import { tokenService } from './tokenService'

export interface SharedNote {
  id: string
  title: string
  content: string
  completed: boolean
  createdAt: string
  updatedAt: string
  mentions: string[]
  author: string
  sharedWith: string[] // emails de usuarios con acceso
  isDone?: boolean
}

interface CreateTodoData {
  title: string
  content: string
  mentions: string[]
}

export const todoService = {
  // Crear una nota compartida y enviar invitación
  async createSharedNote(
    content: string,
    mentions: string[],
    currentUserEmail: string
  ): Promise<SharedNote> {
    try {
      const validToken = await tokenService.getValidToken()
      if (!validToken) {
        throw new Error('No valid authentication token available')
      }

      // Crear la nota localmente
      const note: SharedNote = {
        id: Date.now().toString(),
        title: content.substring(0, 50),
        content,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mentions,
        author: currentUserEmail,
        sharedWith: [currentUserEmail, ...mentions]
      }

      // Enviar emails de invitación a usuarios mencionados
      for (const invitedEmail of mentions) {
        try {
          const noteLink = `https://sos001.vercel.app/?note=${note.id}`
          
          const subject = 'You have been mentioned in a Sensa OS note'
          const htmlBody = `<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #000;">You have been mentioned in a note</h2>
  <p>${currentUserEmail} has mentioned you in a collaborative note in Sensa OS.</p>
  <p><strong>Content:</strong> ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</p>
  <div style="margin: 30px 0;">
    <a href="${noteLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      View shared note
    </a>
  </div>
  <p style="color: #666; font-size: 14px;">Or copy this link: ${noteLink}</p>
  <p style="color: #999; font-size: 12px;">This note syncs in real-time between all users with access.</p>
</body>
</html>`
          
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
            console.log(`✉️ Notificacion enviada a ${invitedEmail}`)
          }
        } catch (emailError) {
          console.error(`Error enviando email a ${invitedEmail}:`, emailError)
        }
      }

      // Guardar en localStorage para persistencia
      const savedNotes = JSON.parse(localStorage.getItem('sharedNotes') || '[]')
      savedNotes.push(note)
      localStorage.setItem('sharedNotes', JSON.stringify(savedNotes))

      return note
    } catch (error) {
      console.error('Error creating shared note:', error)
      throw error
    }
  },

  // Obtener notas compartidas del usuario
  async getUserNotes(userEmail: string): Promise<SharedNote[]> {
    try {
      const savedNotes = JSON.parse(localStorage.getItem('sharedNotes') || '[]')
      
      // Filtrar notas donde el usuario tiene acceso
      const userNotes = savedNotes.filter((note: SharedNote) => 
        note.sharedWith.includes(userEmail)
      )
      
      return userNotes.sort((a: SharedNote, b: SharedNote) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    } catch (error) {
      console.error('Error fetching notes:', error)
      return []
    }
  },

  // Actualizar una nota (live sync)
  async updateNote(noteId: string, content: string, userEmail: string): Promise<void> {
    try {
      const savedNotes = JSON.parse(localStorage.getItem('sharedNotes') || '[]')
      const noteIndex = savedNotes.findIndex((note: SharedNote) => note.id === noteId)
      
      if (noteIndex !== -1) {
        savedNotes[noteIndex].content = content
        savedNotes[noteIndex].updatedAt = new Date().toISOString()
        localStorage.setItem('sharedNotes', JSON.stringify(savedNotes))
        
        // Emitir evento para sincronización en tiempo real
        window.dispatchEvent(new CustomEvent('note:updated', { 
          detail: { noteId, content, userEmail } 
        }))
      }
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  },

  // Toggle completado de una nota
  async toggleNote(noteId: string, completed: boolean): Promise<void> {
    try {
      const savedNotes = JSON.parse(localStorage.getItem('sharedNotes') || '[]')
      const noteIndex = savedNotes.findIndex((note: SharedNote) => note.id === noteId)
      
      if (noteIndex !== -1) {
        savedNotes[noteIndex].completed = completed
        savedNotes[noteIndex].updatedAt = new Date().toISOString()
        localStorage.setItem('sharedNotes', JSON.stringify(savedNotes))
        
        window.dispatchEvent(new CustomEvent('note:updated', { 
          detail: { noteId, completed } 
        }))
      }
    } catch (error) {
      console.error('Error toggling note:', error)
      throw error
    }
  },

  // Eliminar una nota
  async deleteNote(noteId: string): Promise<void> {
    try {
      const savedNotes = JSON.parse(localStorage.getItem('sharedNotes') || '[]')
      const filteredNotes = savedNotes.filter((note: SharedNote) => note.id !== noteId)
      localStorage.setItem('sharedNotes', JSON.stringify(filteredNotes))
      
      window.dispatchEvent(new CustomEvent('note:deleted', { 
        detail: { noteId } 
      }))
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  },

  // Métodos legacy (mantener compatibilidad con backend)
  async getTodos(token: string) {
    const response = await fetch('/api/todos', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch todos')
    }
    
    return response.json()
  },

  async createTodo(token: string, todoData: CreateTodoData) {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todoData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create todo')
    }
    
    return response.json()
  },

  async updateTodo(token: string, todoId: string, updates: Partial<CreateTodoData & { completed: boolean }>) {
    const response = await fetch(`/api/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })
    
    if (!response.ok) {
      throw new Error('Failed to update todo')
    }
    
    return response.json()
  },

  async deleteTodo(token: string, todoId: string) {
    const response = await fetch(`/api/todos/${todoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete todo')
    }
    
    return response.json()
  }
}
