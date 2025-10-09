import React from 'react'
import { useSettings } from '../../contexts/SettingsContext'

interface ModalWrapperProps {
  children: React.ReactNode
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children }) => {
  const { modalStyle } = useSettings()

  const getModalStyles = () => {
    // Modal ocupa el ancho completo de la columna (sin el padding p-4 = 16px)
    // Usamos -inset-x-4 para compensar el padding, top-8 (32px) para bajar desde arriba, -bottom-4 para ocupar hasta abajo
    return 'absolute -inset-x-4 top-8 -bottom-4 z-10 pointer-events-auto'
  }

  const getContentStyles = () => {
    switch (modalStyle) {
      case 1:
        // Default: Modal sin bordes redondeados para ancho completo
        return 'h-full w-full border border-black/[0.24] dark:border-white/[0.24] overflow-hidden bg-white dark:bg-black'
      case 2:
        // Slide from right
        return 'h-full w-full overflow-hidden border border-black/[0.24] dark:border-white/[0.24] animate-slide-in-right bg-white dark:bg-black'
      case 3:
        // Slide from bottom
        return 'h-full w-full overflow-hidden border border-black/[0.24] dark:border-white/[0.24] animate-slide-in-bottom bg-white dark:bg-black'
      default:
        return 'h-full w-full border border-black/[0.24] dark:border-white/[0.24] overflow-hidden bg-white dark:bg-black'
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