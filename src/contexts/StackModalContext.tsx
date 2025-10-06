import React, { createContext, useContext, useState, ReactNode } from 'react'

interface StackModalContextType {
  // Estados para cada columna
  calendarModal: {
    isOpen: boolean
    eventId: string | null
  }
  emailModal: {
    isOpen: boolean
    emailId: string | null
  }
  chatModal: {
    isOpen: boolean
    roomId: string | null
  }
  notesModal: {
    isOpen: boolean
    noteId: string | null
  }
  
  // Funciones para abrir modales
  openCalendarModal: (eventId: string) => void
  openEmailModal: (emailId: string) => void
  openChatModal: (roomId: string) => void
  openNotesModal: (noteId: string) => void
  
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
  const [calendarModal, setCalendarModal] = useState({ isOpen: false, eventId: null })
  const [emailModal, setEmailModal] = useState({ isOpen: false, emailId: null })
  const [chatModal, setChatModal] = useState({ isOpen: false, roomId: null })
  const [notesModal, setNotesModal] = useState({ isOpen: false, noteId: null })

  const openCalendarModal = (eventId: string) => {
    setCalendarModal({ isOpen: true, eventId })
  }

  const openEmailModal = (emailId: string) => {
    setEmailModal({ isOpen: true, emailId })
  }

  const openChatModal = (roomId: string) => {
    setChatModal({ isOpen: true, roomId })
  }

  const openNotesModal = (noteId: string) => {
    setNotesModal({ isOpen: true, noteId })
  }

  const closeCalendarModal = () => {
    setCalendarModal({ isOpen: false, eventId: null })
  }

  const closeEmailModal = () => {
    setEmailModal({ isOpen: false, emailId: null })
  }

  const closeChatModal = () => {
    setChatModal({ isOpen: false, roomId: null })
  }

  const closeNotesModal = () => {
    setNotesModal({ isOpen: false, noteId: null })
  }

  const closeAllModals = () => {
    setCalendarModal({ isOpen: false, eventId: null })
    setEmailModal({ isOpen: false, emailId: null })
    setChatModal({ isOpen: false, roomId: null })
    setNotesModal({ isOpen: false, noteId: null })
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
