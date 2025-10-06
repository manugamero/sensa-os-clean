import React, { useState } from 'react'
import { RefreshCw, Plus, Sun, Moon, Calendar, Mail, MessageCircle, StickyNote } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import CalendarPanel from './panels/CalendarPanel'
import MailPanel from './panels/MailPanel'
import TodoPanel from './panels/TodoPanel'
import ChatPanel from './panels/ChatPanel-simple'

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { id: 0, name: 'Calendario', icon: Calendar, component: CalendarPanel },
    { id: 1, name: 'Email', icon: Mail, component: MailPanel },
    { id: 2, name: 'Chat', icon: MessageCircle, component: ChatPanel },
    { id: 3, name: 'Notas', icon: StickyNote, component: TodoPanel }
  ]

  const ActiveComponent = tabs[activeTab].component

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
            title="Actualizar todo"
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

      {/* Mobile Navigation */}
      <div className="lg:hidden px-4 pb-2">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)] p-4">
        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-4 h-full">
          {/* Calendario */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="h-full overflow-hidden">
              <CalendarPanel />
            </div>
          </div>

          {/* Email */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="h-full overflow-hidden">
              <MailPanel />
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="h-full overflow-hidden">
              <ChatPanel />
            </div>
          </div>

          {/* Notas */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="h-full overflow-hidden">
              <TodoPanel />
            </div>
          </div>
        </div>

        {/* Mobile: Single Column */}
        <div className="lg:hidden h-full">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 h-full">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
