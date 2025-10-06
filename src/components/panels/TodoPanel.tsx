import React, { useState, useEffect, useRef } from 'react'
import { CheckSquare, Square, Users, Hash, Bold, Italic, List, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'
import { useStackModal } from '../../contexts/StackModalContext'
import { todoService } from '../../services/todoService'

interface Todo {
  id: string
  title: string
  content: string
  completed: boolean
  createdAt: string
  updatedAt: string
  mentions: string[]
  author: string
}

const TodoPanel: React.FC = () => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const { openNotesModal } = useStackModal()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTodo, setNewTodo] = useState({
    content: '',
    mentions: ''
  })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadTodos()
    
    if (socket) {
      socket.on('todo:created', (todo: Todo) => {
        setTodos(prev => [todo, ...prev])
      })
      
      socket.on('todo:updated', (todo: Todo) => {
        setTodos(prev => prev.map(t => t.id === todo.id ? todo : t))
      })
      
      socket.on('todo:deleted', (todoId: string) => {
        setTodos(prev => prev.filter(t => t.id !== todoId))
      })
    }

    return () => {
      if (socket) {
        socket.off('todo:created')
        socket.off('todo:updated')
        socket.off('todo:deleted')
      }
    }
  }, [socket])

  const loadTodos = async () => {
    try {
      setLoading(true)
      const token = await user?.getIdToken()
      const todosData = await todoService.getTodos(token)
      setTodos(todosData)
    } catch (error) {
      console.error('Error loading todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = await user?.getIdToken()
      const mentions = newTodo.mentions
        .split(',')
        .map(email => email.trim())
        .filter(email => email)

      await todoService.createTodo(token, {
        title: '', // Sin título
        content: newTodo.content,
        mentions
      })

      setNewTodo({ content: '', mentions: '' })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  const toggleTodo = async (todoId: string, completed: boolean) => {
    try {
      const token = await user?.getIdToken()
      await todoService.updateTodo(token, todoId, { completed })
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (todoId: string) => {
    try {
      const token = await user?.getIdToken()
      await todoService.deleteTodo(token, todoId)
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const formatMarkdown = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/@(\w+@[\w.-]+)/g, '<span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 rounded text-sm">@$1</span>')
      .replace(/\n/g, '<br>')
  }


  const insertMarkdown = (before: string, after: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.substring(start, end)
      const newText = textarea.value.substring(0, start) + before + selectedText + after + textarea.value.substring(end)
      
      setNewTodo({ ...newTodo, content: newText })
      
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, end + before.length)
      }, 0)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">

      <div className="flex-1 overflow-y-auto">

      {showCreateForm && (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <form onSubmit={createTodo} className="space-y-3">
            <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white">
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Negrita"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Cursiva"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('`', '`')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Código"
              >
                <Hash className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('- ', '')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Lista"
              >
                <List className="w-4 h-4" />
              </button>
              <div className="flex-1"></div>
              <button
                type="submit"
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
                title="Guardar"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={newTodo.content}
              onChange={(e) => setNewTodo({ ...newTodo, content: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-0 resize-none"
              placeholder="Escribe tu nota aquí..."
              rows={3}
            />
          </form>
        </div>
        )}

        <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No hay notas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todoItem) => (
              <div 
                key={todoItem.id} 
                onClick={() => openNotesModal(todoItem)}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-900 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTodo(todoItem.id, !todoItem.completed)}
                    className="flex-shrink-0 mt-1"
                  >
                    {todoItem.completed ? (
                      <CheckSquare className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {todoItem.content && (
                          <div 
                            className={`text-gray-700 mb-3 ${
                              todoItem.completed ? 'line-through text-gray-500' : ''
                            }`}
                            dangerouslySetInnerHTML={{ 
                              __html: formatMarkdown(todoItem.content) 
                            }}
                          />
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            {new Date(todoItem.createdAt).toLocaleDateString('es-ES')}
                          </span>
                          {todoItem.mentions.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{todoItem.mentions.length} mención{todoItem.mentions.length !== 1 ? 'es' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteTodo(todoItem.id)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                        title="Eliminar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default TodoPanel
