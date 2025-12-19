'use client'

import { CheckSquare, Users, UserPlus, FileText, MessageSquare } from 'lucide-react'

type Module = 'team' | 'tasks' | 'leads' | 'logs' | 'messages'

interface SidebarProps {
  activeModule: Module
  setActiveModule: (module: Module) => void
}

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const menuItems = [
    { id: 'tasks' as Module, label: 'Task Management', icon: CheckSquare },
    { id: 'team' as Module, label: 'Team Management', icon: Users },
    { id: 'leads' as Module, label: 'Leads', icon: UserPlus },
    { id: 'logs' as Module, label: 'Logs', icon: FileText },
    { id: 'messages' as Module, label: 'Messages', icon: MessageSquare },
  ]

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-4">
        <div className="text-xl font-bold text-gray-800 mb-6">CRM</div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeModule === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

