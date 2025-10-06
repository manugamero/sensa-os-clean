import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Event {
  id: string
  summary: string
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  description?: string
  location?: string
  attendees?: Array<{ email: string; displayName?: string }>
  hangoutLink?: string
}

interface Email {
  id: string
  subject: string
  from: string
  snippet: string
  date: string
  isRead: boolean
  hasAttachments: boolean
}

interface ChatRoom {
  id: string
  name: string
  participants: string[]
  isActive: boolean
}

interface Note {
  id: string
  title: string
  content: string
  completed: boolean
  createdAt: string
  updatedAt: string
  mentions: string[]
  author: string
}

interface StackModalContextType {
  // Estados para cada columna con datos completos
  calendarModal: {
    isOpen: boolean
    event: Event | null
  }
  emailModal: {
    isOpen: boolean
    email: Email | null
  }
  chatModal: {
    isOpen: boolean
    room: ChatRoom | null
  }
  notesModal: {
    isOpen: boolean
    note: Note | null
  }
  
  // Funciones para abrir modales con datos
  openCalendarModal: (event: Event) => void
  openEmailModal: (email: Email) => void
  openChatModal: (room: ChatRoom) => void
  openNotesModal: (note: Note) => void
  
  // Funciones para cerrar modales
  closeCalendarModal: () => void
  closeEmailModal: () => void
  closeChatModal: () => void
  closeNotesModal: () => void
  closeAllModals: () => void
}

const StackModalContext = createContext<StackModalContextType | undefined>(undefined)

export const useStackModal = () => {
  const context = useContext(StackModalContext)
  if (!context) {
    throw new Error('useStackModal must be used within a StackModalProvider')
  }
  return context
}

interface StackModalProviderProps {
  children: ReactNode
}

export const StackModalProvider: React.FC<StackModalProviderProps> = ({ children }) => {
  const [calendarModal, setCalendarModal] = useState({ isOpen: false, event: null as Event | null })
  const [emailModal, setEmailModal] = useState({ isOpen: false, email: null as Email | null })
  const [chatModal, setChatModal] = useState({ isOpen: false, room: null as ChatRoom | null })
  const [notesModal, setNotesModal] = useState({ isOpen: false, note: null as Note | null })

  const openCalendarModal = (event: Event) => {
    setCalendarModal({ isOpen: true, event })
  }

  const openEmailModal = (email: Email) => {
    setEmailModal({ isOpen: true, email })
  }

  const openChatModal = (room: ChatRoom) => {
    setChatModal({ isOpen: true, room })
  }

  const openNotesModal = (note: Note) => {
    setNotesModal({ isOpen: true, note })
  }

  const closeCalendarModal = () => {
    setCalendarModal({ isOpen: false, event: null })
  }

  const closeEmailModal = () => {
    setEmailModal({ isOpen: false, email: null })
  }

  const closeChatModal = () => {
    setChatModal({ isOpen: false, room: null })
  }

  const closeNotesModal = () => {
    setNotesModal({ isOpen: false, note: null })
  }

  const closeAllModals = () => {
    setCalendarModal({ isOpen: false, event: null })
    setEmailModal({ isOpen: false, email: null })
    setChatModal({ isOpen: false, room: null })
    setNotesModal({ isOpen: false, note: null })
  }

  return (
    <StackModalContext.Provider
      value={{
        calendarModal,
        emailModal,
        chatModal,
        notesModal,
        openCalendarModal,
        openEmailModal,
        openChatModal,
        openNotesModal,
        closeCalendarModal,
        closeEmailModal,
        closeChatModal,
        closeNotesModal,
        closeAllModals,
      }}
    >
      {children}
    </StackModalContext.Provider>
  )
}