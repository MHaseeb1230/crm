'use client'

import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import TeamManagement from './TeamManagement'
import TaskManagement from './TaskManagement'
import Leads from './Leads'
import Logs from './Logs'
import Messages from './Messages'

type Module = 'team' | 'tasks' | 'leads' | 'logs' | 'messages'

interface DashboardProps {
  onLogout?: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeModule, setActiveModule] = useState<Module>('team')
  const router = useRouter()

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth)
      }
      // Clear user state and redirect to login
      if (onLogout) {
        onLogout()
      } else {
        // Fallback: reload page to reset state
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, redirect to login
      if (onLogout) {
        onLogout()
      } else {
        window.location.href = '/'
      }
    }
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'team':
        return <TeamManagement />
      case 'tasks':
        return <TaskManagement />
      case 'leads':
        return <Leads />
      case 'logs':
        return <Logs />
      case 'messages':
        return <Messages />
      default:
        return <TeamManagement />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">CRM Setup</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  )
}

