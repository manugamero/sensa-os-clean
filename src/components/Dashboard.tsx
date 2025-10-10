import React, { useState } from 'react'
import { RefreshCw, Sun, Moon, Calendar, Mail, MessageCircle, StickyNote, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useSettings } from '../contexts/SettingsContext'
import CalendarPanel from './panels/CalendarPanel'
import MailPanel from './panels/MailPanel'
import TodoPanel from './panels/TodoPanel'
import ChatPanelSimple from './panels/ChatPanel-simple'
import ChatPanelEmail from './panels/ChatPanel-email'

const Dashboard: React.FC = () => {
  const { user, signOut, signInWithGoogle } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { modalStyle, setModalStyle, chatType, setChatType } = useSettings()
  const [activeTab, setActiveTab] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const ChatPanel = chatType === 'email' ? ChatPanelEmail : ChatPanelSimple

  const tabs = [
    { id: 0, name: 'Calendario', icon: Calendar, component: CalendarPanel },
    { id: 1, name: 'Email', icon: Mail, component: MailPanel },
    { id: 2, name: 'Chat', icon: MessageCircle, component: ChatPanel },
    { id: 3, name: 'Notas', icon: StickyNote, component: TodoPanel }
  ]

  const ActiveComponent = tabs[activeTab].component
  const activeTabName = tabs[activeTab].name

  // Manejar swipe en móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1)
    }
    if (isRightSwipe && activeTab > 0) {
      setActiveTab(activeTab - 1)
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <div className="h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-black dark:text-white">sensa os</h1>
          <span className="text-black/40 dark:text-white/40">/</span>
          {user ? (
            <>
              <span className="text-xl font-semibold text-black dark:text-white">
                {user.displayName || user.email}
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-black/60 dark:text-white/60"
                title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-black/60 dark:text-white/60"
                title="Ajustes"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.location.reload()}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-black/60 dark:text-white/60"
                title="Actualizar todo"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={signOut}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-black/60 dark:text-white/60"
                title="Cerrar sesión"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </>
          ) : (
            <>
                  <span
                    onClick={signInWithGoogle}
                    className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Connect
                  </span>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-black/60 dark:text-white/60"
                title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-4 pb-2">
          <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-white/[0.08] dark:border-gray-200 dark:border-white/[0.08] p-4">
            <h3 className="text-sm font-semibold text-black dark:text-white mb-3">Ajustes</h3>
            
            {/* Modal Style */}
            <div className="mb-4">
              <label className="text-xs text-black/60 dark:text-white/60 mb-2 block">Estilo de Modal</label>
              <select
                value={modalStyle}
                onChange={(e) => setModalStyle(Number(e.target.value) as any)}
                className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-white/[0.08] dark:border-white/[0.24] rounded-lg text-sm text-black dark:text-white"
              >
                <option value={1}>1. Sin animación</option>
                <option value={2}>2. Slide from right →</option>
                <option value={3}>3. Slide from bottom ↑ (default)</option>
              </select>
            </div>

            {/* Chat Type */}
            <div className="mb-4">
              <label className="text-xs text-black/60 dark:text-white/60 mb-2 block">Tipo de Chat</label>
              <select
                value={chatType}
                onChange={(e) => setChatType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-white/[0.08] dark:border-white/[0.24] rounded-lg text-sm text-black dark:text-white"
              >
                <option value="simple">Simple (demo)</option>
                <option value="email">Email Threads (real)</option>
              </select>
            </div>

            {/* Email Encoder */}
            <div>
              <label className="text-xs text-black/60 dark:text-white/60 mb-2 block">Email Encoding</label>
              <select
                defaultValue={localStorage.getItem('emailEncoder') || 'chunkedEncoder'}
                onChange={(e) => {
                  localStorage.setItem('emailEncoder', e.target.value)
                  alert('Encoder updated. Try sending invitation.')
                }}
                className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-white/[0.08] dark:border-white/[0.24] rounded-lg text-sm text-black dark:text-white"
              >
                <option value="chunkedEncoder">Chunked (Default)</option>
                <option value="asciiOnly">ASCII Only</option>
                <option value="textEncoder">TextEncoder</option>
                <option value="unicodeEscape">Unicode Escape</option>
                <option value="safeReplace">Safe Replace</option>
              </select>
              <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                Test different methods if garbled text
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Pagination Indicator */}
      <div className="lg:hidden px-4 pb-2">
        <div className="flex justify-center items-center gap-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`transition-all ${
                activeTab === tab.id
                  ? 'w-8 h-2 bg-black dark:bg-white rounded-full'
                  : 'w-2 h-2 bg-black/20 dark:bg-white/20 rounded-full'
              }`}
              aria-label={tab.name}
            />
          ))}
        </div>
        <div className="text-center text-sm text-black/60 dark:text-white/60 mb-2">
          {activeTabName}
        </div>
      </div>


      {/* Main Content */}
      <div className="h-[calc(100vh-200px)] lg:h-[calc(100vh-140px)] p-4">
        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-4 h-full">
          {/* Calendario */}
          <div className="rounded-lg border border-gray-200 dark:border-white/[0.08] dark:border-gray-200 dark:border-white/[0.08] p-4 h-full overflow-hidden">
            <CalendarPanel />
          </div>

          {/* Email */}
          <div className="rounded-lg border border-gray-200 dark:border-white/[0.08] dark:border-gray-200 dark:border-white/[0.08] p-4 h-full overflow-hidden">
            <MailPanel />
          </div>

          {/* Chat */}
          <div className="rounded-lg border border-gray-200 dark:border-white/[0.08] dark:border-gray-200 dark:border-white/[0.08] p-4 h-full overflow-hidden">
            <ChatPanel />
          </div>

          {/* Notas */}
          <div className="rounded-lg border border-gray-200 dark:border-white/[0.08] dark:border-gray-200 dark:border-white/[0.08] p-4 h-full overflow-hidden">
            <TodoPanel />
          </div>
        </div>

        {/* Mobile: Single Column with Swipe */}
        <div 
          className="lg:hidden bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-white/[0.08] dark:border-gray-200 dark:border-white/[0.08] p-4 h-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ActiveComponent />
        </div>
      </div>

    </div>
  )
}

export default Dashboard
