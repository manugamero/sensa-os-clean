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
        // Estilo 1: Borde grueso + sombra
        return 'absolute inset-0 z-10 bg-gray-50 dark:bg-gray-950 p-2'
      case 2:
        // Estilo 2: Sin borde + blur
        return 'absolute inset-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-xl p-0'
      case 3:
        // Estilo 3: Borde fino + padding grande
        return 'absolute inset-0 z-10 bg-gray-50 dark:bg-gray-950 p-6'
      case 4:
        // Estilo 4: Card elevado - COLUMNA SE REDUCE
        return 'absolute inset-0 z-10 bg-transparent p-0'
      case 5:
        // Estilo 5: Fullscreen con padding
        return 'absolute inset-0 z-10 bg-white dark:bg-gray-900 p-8'
      case 6:
        // Estilo 6: Slide from right
        return 'absolute inset-y-0 right-0 z-10 bg-white dark:bg-gray-900 w-full animate-slide-in-right'
      case 7:
        // Estilo 7: Minimal - sin padding
        return 'absolute inset-0 z-10 bg-white dark:bg-gray-900 p-0'
      case 8:
        // Estilo 8: Card con mucho espacio
        return 'absolute inset-0 z-10 bg-transparent p-8 flex items-center'
      case 9:
        // Estilo 9: Borde doble
        return 'absolute inset-0 z-10 bg-gray-100 dark:bg-gray-950 p-4'
      case 10:
        // Estilo 10: Glassmorphism
        return 'absolute inset-0 z-10 bg-white/60 dark:bg-black/60 backdrop-blur-2xl p-3'
      case 11:
        // Estilo 11: Paper style
        return 'absolute inset-0 z-10 bg-gray-50 dark:bg-gray-900 p-4'
      case 12:
        // Estilo 12: Float left
        return 'absolute inset-y-0 left-0 z-10 bg-white dark:bg-gray-900 w-full animate-slide-in-left'
      default:
        return 'absolute inset-0 z-10 bg-gray-50 dark:bg-gray-950 p-2'
    }
  }

  const getContentStyles = () => {
    switch (modalStyle) {
      case 1:
        // Borde grueso + sombra
        return 'h-full rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-2xl overflow-hidden'
      case 2:
        // Sin borde + blur
        return 'h-full overflow-hidden'
      case 3:
        // Borde fino + padding grande
        return 'h-full rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden'
      case 4:
        // Card elevado - ocupa todo el ancho
        return 'h-full w-full rounded-none shadow-[0_0_60px_rgba(0,0,0,0.4)] overflow-hidden'
      case 5:
        // Fullscreen con padding
        return 'h-full rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden'
      case 6:
        // Slide from right
        return 'h-full overflow-hidden border-l-2 border-gray-300 dark:border-gray-700 shadow-[-10px_0_30px_rgba(0,0,0,0.2)]'
      case 7:
        // Minimal
        return 'h-full overflow-hidden'
      case 8:
        // Card con mucho espacio
        return 'h-full w-full rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.35)] overflow-hidden'
      case 9:
        // Borde doble
        return 'h-full rounded-xl border-4 border-double border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden'
      case 10:
        // Glassmorphism
        return 'h-full rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden'
      case 11:
        // Paper style
        return 'h-full rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.1)] overflow-hidden'
      case 12:
        // Float left
        return 'h-full overflow-hidden border-r-2 border-gray-300 dark:border-gray-700 shadow-[10px_0_30px_rgba(0,0,0,0.2)]'
      default:
        return 'h-full rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-2xl overflow-hidden'
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
