import React from 'react'
import { useSettings } from '../../contexts/SettingsContext'

interface ModalWrapperProps {
  children: React.ReactNode
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children }) => {
  const { modalStyle } = useSettings()

  const getModalStyles = () => {
    switch (modalStyle) {
      case 1:
        // Estilo 1: Modal ocupa el espacio completo de la columna - SIN OVERLAY
        return 'absolute inset-0 z-10'
      case 2:
        // Estilo 2: Slide from right
        return 'absolute inset-y-0 right-0 z-10 w-full animate-slide-in-right'
      case 3:
        // Estilo 3: Slide from bottom
        return 'absolute inset-x-0 bottom-0 z-10 h-full animate-slide-in-bottom'
      default:
        return 'absolute inset-0 z-10'
    }
  }

  const getContentStyles = () => {
    switch (modalStyle) {
      case 1:
        // Modal con borde como las columnas, sin overlay
        return 'h-full w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900'
      case 2:
        // Slide from right con borde
        return 'h-full overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 animate-slide-in-right bg-white dark:bg-gray-900'
      case 3:
        // Slide from bottom con borde
        return 'h-full overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 animate-slide-in-bottom bg-white dark:bg-gray-900'
      default:
        return 'h-full w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900'
    }
  }

  return (
    <div className={getModalStyles()}>
      <div className={getContentStyles()}>
        {children}
      </div>
    </div>
  )
}

export default ModalWrapper