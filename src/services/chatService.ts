interface CreateRoomData {
  name: string
  participants: string[]
}

interface SendMessageData {
  content: string
  type: 'text' | 'image' | 'audio' | 'file'
}

export const chatService = {
  async getRooms(token: string) {
    const response = await fetch('/api/chat/rooms', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch rooms')
    }
    
    return response.json()
  },

  async createRoom(token: string, roomData: CreateRoomData) {
    const response = await fetch('/api/chat/rooms', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(roomData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create room')
    }
    
    return response.json()
  },

  async getMessages(token: string, roomId: string) {
    const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }
    
    return response.json()
  },

  async sendMessage(token: string, roomId: string, messageData: SendMessageData) {
    const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to send message')
    }
    
    return response.json()
  },

  async uploadFile(token: string, formData: FormData) {
    const response = await fetch('/api/chat/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload file')
    }
    
    return response.json()
  }
}
