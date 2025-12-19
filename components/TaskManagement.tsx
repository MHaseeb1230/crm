'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { supabase, Task } from '@/lib/supabase'
import { Search, Plus, Table, BarChart3 } from 'lucide-react'

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [selectedAssignee, setSelectedAssignee] = useState('All Assignees')
  const [selectedUrgency, setSelectedUrgency] = useState('All Urgency')
  const [viewMode, setViewMode] = useState<'table' | 'gantt'>('table')

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      if (!supabase) {
        console.warn('Supabase not configured. Using mock data.')
        setTasks([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase!
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filteredTasks = useMemo(() => {
    let filtered = tasks

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.task_name?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      )
    }

    if (selectedStatus !== 'All Statuses') {
      filtered = filtered.filter((task) => task.status === selectedStatus)
    }

    if (selectedAssignee !== 'All Assignees') {
      filtered = filtered.filter((task) => task.assigned_to === selectedAssignee)
    }

    if (selectedUrgency !== 'All Urgency') {
      filtered = filtered.filter((task) => task.urgency === selectedUrgency)
    }

    return filtered
  }, [tasks, searchQuery, selectedStatus, selectedAssignee, selectedUrgency])

  const statuses = useMemo(() => {
    const unique = new Set(tasks.map((t) => t.status))
    return ['All Statuses', ...Array.from(unique)]
  }, [tasks])

  const assignees = useMemo(() => {
    const unique = new Set(tasks.map((t) => t.assigned_to))
    return ['All Assignees', ...Array.from(unique)]
  }, [tasks])

  const urgencies = useMemo(() => {
    const unique = new Set(tasks.map((t) => t.urgency))
    return ['All Urgency', ...Array.from(unique)]
  }, [tasks])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {assignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {urgencies.map((urgency) => (
              <option key={urgency} value={urgency}>
                {urgency}
              </option>
            ))}
          </select>

          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 flex items-center space-x-2 ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <Table size={18} />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-4 py-2 flex items-center space-x-2 border-l border-gray-300 ${
                viewMode === 'gantt' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <BarChart3 size={18} />
              <span>Gantt View</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{task.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.task_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.assigned_to}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.status}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.urgency}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-center text-gray-500">Gantt View - Coming Soon</p>
        </div>
      )}
    </div>
  )
}

