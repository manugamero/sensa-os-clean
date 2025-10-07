import React, { createContext, useContext, useState, ReactNode } from 'react'

type ColorScheme = 'gray' | 'blue' | 'green' | 'purple' | 'red' | 'orange'
type ModalStyle = 1 | 2 | 3 | 4 | 5 | 6

interface SettingsContextType {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
  modalStyle: ModalStyle
  setModalStyle: (style: ModalStyle) => void
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
  const [modalStyle, setModalStyle] = useState<ModalStyle>(1)

  return (
    <SettingsContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        modalStyle,
        setModalStyle,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
