interface CreateTodoData {
  title: string
  content: string
  mentions: string[]
}

export const todoService = {
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
