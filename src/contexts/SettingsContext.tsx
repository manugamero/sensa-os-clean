import React, { createContext, useContext, useState, ReactNode } from 'react'

type ColorScheme = 'gray' | 'blue' | 'green' | 'purple' | 'red' | 'orange'
type ModalStyle = 1 | 2 | 3
type ChatType = 'email' | 'simple'

interface SettingsContextType {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
  modalStyle: ModalStyle
  setModalStyle: (style: ModalStyle) => void
  chatType: ChatType
  setChatType: (type: ChatType) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('gray')
  const [modalStyle, setModalStyle] = useState<ModalStyle>(3) // Default: Slide from bottom
  const [chatType, setChatType] = useState<ChatType>('simple')

  return (
    <SettingsContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        modalStyle,
        setModalStyle,
        chatType,
        setChatType,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
