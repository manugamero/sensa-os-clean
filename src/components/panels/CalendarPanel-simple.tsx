import React from 'react'

const CalendarPanelSimple: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white">Evento de prueba</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hoy, 10:00 AM</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Panel de Calendario</p>
      </div>
    </div>
  )
}

export default CalendarPanelSimple
