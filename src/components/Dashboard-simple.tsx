import React from 'react'
import { RefreshCw, Sun, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const DashboardSimple: React.FC = () => {
  const { user, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">sensa os</h1>
          <span className="text-gray-400">/</span>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            {user?.displayName || user?.email}
          </span>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title="Actualizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={signOut}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            title="Cerrar sesión"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content - Trello Layout */}
      <div className="h-[calc(100vh-80px)] p-4">
        <div className="grid grid-cols-4 gap-4 h-full">
          {/* Calendario */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-white/[0.08] p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Calendario</h2>
            </div>
            <div className="h-[calc(100%-3rem)] overflow-hidden">
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Panel de Calendario</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-white/[0.08] p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h2>
            </div>
            <div className="h-[calc(100%-3rem)] overflow-hidden">
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Panel de Email</p>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-white/[0.08] p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>
            </div>
            <div className="h-[calc(100%-3rem)] overflow-hidden">
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Panel de Chat</p>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-white/[0.08] p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notas</h2>
            </div>
            <div className="h-[calc(100%-3rem)] overflow-hidden">
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Panel de Notas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSimple