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
        // Estilo 1: Lista se reduce 5% - SIN OVERLAY
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
        // Lista se reduce - card con sombra fuerte
        return 'h-full w-full rounded-none shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden bg-white dark:bg-gray-900'
      case 2:
        // Slide from right
        return 'h-full overflow-hidden border-l-2 border-white dark:border-gray-700 shadow-[-10px_0_30px_rgba(0,0,0,0.2)] bg-white dark:bg-gray-900'
      case 3:
        // Slide from bottom
        return 'h-full overflow-hidden border-t-2 border-white dark:border-gray-700 shadow-[0_-10px_30px_rgba(0,0,0,0.2)] bg-white dark:bg-gray-900'
      default:
        return 'h-full w-full rounded-none shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden bg-white dark:bg-gray-900'
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