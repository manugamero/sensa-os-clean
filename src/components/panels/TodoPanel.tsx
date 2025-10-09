import React, { useState, useEffect, useRef } from 'react'
import { CheckSquare, Square, Hash, Bold, Italic, List, X, RefreshCw, Plus, Check } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'
import NoteDetailModal from '../modals/NoteDetailModal'
import ModalWrapper from '../modals/ModalWrapper'

interface Todo {
  id: string
  title: string
  content: string
  completed: boolean
  createdAt: string
  updatedAt: string
  mentions: string[]
  author: string
  isDone?: boolean
}

const TodoPanel: React.FC = () => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Todo | null>(null)
  const [hoveredTodo, setHoveredTodo] = useState<string | null>(null)
  const [showDone, setShowDone] = useState(false)
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
      // Simular carga sin backend
      setTodos([])
    } catch (error) {
      console.error('Error loading todos:', error)
      setTodos([])
    } finally {
      setLoading(false)
    }
  }

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.content.trim()) return
    
    try {
      const mentions = newTodo.mentions
        .split(',')
        .map(email => email.trim())
        .filter(email => email)

      // Crear nota localmente sin backend
      const newNote: Todo = {
        id: Date.now().toString(),
        title: '',
        content: newTodo.content,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mentions,
        author: user?.email || 'Usuario'
      }

      setTodos(prev => [newNote, ...prev])
      setNewTodo({ content: '', mentions: '' })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating todo:', error)
      alert('Error al crear la nota. Por favor, intenta de nuevo.')
    }
  }

  const toggleTodo = async (todoId: string, completed: boolean) => {
    try {
      // Actualizar localmente sin backend
      setTodos(prev => prev.map(todo => 
        todo.id === todoId ? { ...todo, completed, updatedAt: new Date().toISOString() } : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (todoId: string) => {
    try {
      // Eliminar localmente sin backend
      setTodos(prev => prev.filter(todo => todo.id !== todoId))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const toggleDone = (todoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setTodos(todos.map(todo => 
      todo.id === todoId ? { ...todo, isDone: !todo.isDone } : todo
    ))
  }

  const formatMarkdown = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">$1</code>')
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
      
      // Restaurar posición del cursor
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, end + before.length)
      }, 0)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Contenido de la lista - se reduce cuando hay modal */}
      <div className={`h-full flex flex-col transition-all duration-300 origin-top ${selectedNote ? 'scale-[0.98] opacity-30 pointer-events-none' : 'scale-100 opacity-100'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notas</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDone(!showDone)}
              className={`p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-black/60 dark:text-white/60 ${showDone ? 'bg-black/5 dark:bg-white/5' : ''}`}
              title={showDone ? 'Mostrar pendientes' : 'Mostrar completados'}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-black/60 dark:text-white/60"
              title="Nueva nota"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={loadTodos}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-black/60 dark:text-white/60"
              title="Actualizar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Create Form */}
          {showCreateForm && (
            <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black">
              <form onSubmit={createTodo} className="space-y-3">
                <div className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-black">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
                    title="Negrita"
                  >
                    <Bold className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
                    title="Cursiva"
                  >
                    <Italic className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('`', '`')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
                    title="Código"
                  >
                    <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- ', '')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
                    title="Lista"
                  >
                    <List className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('@', '@email.com')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded text-gray-500 dark:text-gray-400 font-bold"
                    title="Mencionar"
                  >
                    @
                  </button>
                  <div className="flex-1"></div>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  ref={textareaRef}
                  value={newTodo.content}
                  onChange={(e) => setNewTodo({ ...newTodo, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-0 resize-none bg-white dark:bg-black text-gray-900 dark:text-white"
                  placeholder="Escribe tu nota aquí..."
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    Crear nota
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Todos List */}
          {todos.filter(todo => showDone ? todo.isDone : !todo.isDone).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No hay notas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todos.filter(todo => showDone ? todo.isDone : !todo.isDone).map((todoItem) => (
                <div 
                  key={todoItem.id} 
                  onMouseEnter={() => setHoveredTodo(todoItem.id)}
                  onMouseLeave={() => setHoveredTodo(null)}
                  onClick={() => setSelectedNote(todoItem)}
                  className={`card-hover border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-black cursor-pointer relative ${todoItem.completed ? 'opacity-50' : ''}`}
                >
                  {/* Done button on hover */}
                  {hoveredTodo === todoItem.id && (
                    <button
                      onClick={(e) => toggleDone(todoItem.id, e)}
                      className="absolute top-2 right-2 p-1.5 bg-white dark:bg-black rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors z-10"
                      title={todoItem.isDone ? 'Marcar como pendiente' : 'Marcar como completado'}
                    >
                      <Check className={`w-4 h-4 ${todoItem.isDone ? 'text-gray-900 dark:text-white fill-current' : 'text-gray-500 dark:text-gray-400'}`} />
                    </button>
                  )}
                  {/* Fila 1: Checkbox y contenido principal */}
                  <div className="flex items-center gap-2 mb-1 h-5 leading-5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTodo(todoItem.id, !todoItem.completed)
                      }}
                      className="flex-shrink-0"
                    >
                      {todoItem.completed ? (
                        <CheckSquare className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Square className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                    <div 
                      className={`flex-1 text-sm font-semibold text-gray-900 dark:text-white truncate ${
                        todoItem.completed ? 'line-through opacity-70' : ''
                      }`}
                      dangerouslySetInnerHTML={{ 
                        __html: formatMarkdown(todoItem.content || 'Nota vacía') 
                      }}
                    />
                  </div>
                  
                  {/* Fila 2: Fecha - altura fija */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1 h-5 leading-5">
                    <span className="truncate">
                      {new Date(todoItem.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  
                  {/* Fila 3: Menciones - altura fija */}
                  <div className="flex items-center justify-between gap-2 h-5 leading-5">
                    {todoItem.mentions.length > 0 ? (
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>{todoItem.mentions.length} menciones</span>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTodo(todoItem.id)
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                      title="Eliminar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stack Modal dentro de la columna */}
      {selectedNote && (
        <ModalWrapper>
          <NoteDetailModal
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            onUpdate={(noteId, updates) => {
              setTodos(todos.map(t => t.id === noteId ? { ...t, ...updates } : t))
            }}
            onDelete={(noteId) => {
              deleteTodo(noteId)
              setSelectedNote(null)
            }}
          />
        </ModalWrapper>
      )}
    </div>
  )
}

export default TodoPanel