import React from 'react'
import { Calendar, Mail, CheckSquare, MessageCircle } from 'lucide-react'

interface LoginPageProps {
  onSignIn: () => Promise<void>
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignIn }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">sensa os</h1>
          <p className="text-gray-600 dark:text-gray-400">Cliente integrado para productividad</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Calendario</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Mail className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <CheckSquare className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notas</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MessageCircle className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chat</span>
          </div>
        </div>

        <button
          onClick={onSignIn}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Iniciar sesión con Google
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad
        </p>
      </div>
    </div>
  )
}

export default LoginPage
