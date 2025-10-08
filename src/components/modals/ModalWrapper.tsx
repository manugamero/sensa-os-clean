import React from 'react'
import { useSettings } from '../../contexts/SettingsContext'

interface ModalWrapperProps {
  children: React.ReactNode
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children }) => {
  const { modalStyle } = useSettings()

  const getModalStyles = () => {
    // Modal siempre ocupa el espacio completo de la columna
    return 'absolute inset-0 z-10 pointer-events-auto'
  }

  const getContentStyles = () => {
    switch (modalStyle) {
      case 1:
        // Default: Modal con borde, sin animación especial
        return 'h-full w-full rounded-lg border border-black/[0.24] dark:border-white/[0.24] overflow-hidden bg-white dark:bg-black'
      case 2:
        // Slide from right
        return 'h-full w-full overflow-hidden rounded-lg border border-black/[0.24] dark:border-white/[0.24] animate-slide-in-right bg-white dark:bg-black'
      case 3:
        // Slide from bottom
        return 'h-full w-full overflow-hidden rounded-lg border border-black/[0.24] dark:border-white/[0.24] animate-slide-in-bottom bg-white dark:bg-black'
      default:
        return 'h-full w-full rounded-lg border border-black/[0.24] dark:border-white/[0.24] overflow-hidden bg-white dark:bg-black'
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