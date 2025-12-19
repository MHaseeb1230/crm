'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { supabase, TeamMember } from '@/lib/supabase'
import { Trash2, Edit, Search, Download, Settings, Plus } from 'lucide-react'
import PhoneInput from './PhoneInput'
import AICallMany from './AICallMany'

type SortField = 'id' | 'email' | 'name' | 'role' | 'phone'
type SortDirection = 'asc' | 'desc'

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('All Roles')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>('id')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [phoneNumber, setPhoneNumber] = useState('')

  // Fast data loading
  const fetchTeamMembers = useCallback(async () => {
    setLoading(true)
    try {
      if (!supabase) {
        console.warn('Supabase not configured. Using mock data.')
        // Mock data for development
        setTeamMembers([
          { id: 'BBU592', email: 'hardikvij195@gmail.com', name: 'Hardik', role: 'Super Admin', phone: '+918588099741' },
          { id: 'KA1821', email: 'Enrick@sparkint.com', name: 'Enrick', role: 'Super Admin', phone: '+33' },
        ])
        setLoading(false)
        return
      }

      const { data, error } = await supabase!
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000) // Optimized limit

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
      // Fallback to empty array on error
      setTeamMembers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeamMembers()
  }, [fetchTeamMembers])

  // Fast search and filter
  const filteredMembers = useMemo(() => {
    let filtered = teamMembers

    // Fast search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (member) =>
          member.name?.toLowerCase().includes(query) ||
          member.email?.toLowerCase().includes(query) ||
          member.phone?.includes(query) ||
          member.id?.toLowerCase().includes(query)
      )
    }

    // Role filter
    if (selectedRole !== 'All Roles') {
      filtered = filtered.filter((member) => member.role === selectedRole)
    }

    // Fast sorting - Click on Table Heading
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortField] || ''
      const bValue = b[sortField] || ''
      const comparison = aValue.toString().localeCompare(bValue.toString())
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [teamMembers, searchQuery, selectedRole, sortField, sortDirection])

  // Fast pagination
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredMembers.slice(startIndex, endIndex)
  }, [filteredMembers, currentPage, pageSize])

  const totalPages = Math.ceil(filteredMembers.length / pageSize)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedMembers.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedMembers.map((m) => m.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  // Delete Many and show check boxes
  const handleDeleteMany = async () => {
    if (selectedIds.size === 0) return

    try {
      if (!supabase) {
        console.warn('Supabase not configured. Delete operation skipped.')
        // Remove from local state for demo
        setTeamMembers((prev) => prev.filter((m) => !selectedIds.has(m.id)))
        setSelectedIds(new Set())
        return
      }

      const { error } = await supabase!
        .from('team_members')
        .delete()
        .in('id', Array.from(selectedIds))

      if (error) throw error
      setSelectedIds(new Set())
      fetchTeamMembers()
    } catch (error) {
      console.error('Error deleting members:', error)
    }
  }

  const roles = useMemo(() => {
    const uniqueRoles = new Set(teamMembers.map((m) => m.role))
    return ['All Roles', ...Array.from(uniqueRoles)]
  }, [teamMembers])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Fast Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by Name, Email, Phone or Unique ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* DropDowns */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Download className="text-gray-600 cursor-pointer hover:text-blue-600" size={20} />
            <Settings className="text-gray-600 cursor-pointer hover:text-blue-600" size={20} />
          </div>
        </div>
      </div>

      {/* Delete Many and AI Call Many */}
      {selectedIds.size > 0 && (
        <div className="space-y-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-red-700 font-medium">
              {selectedIds.size} item(s) selected
            </span>
            <button
              onClick={handleDeleteMany}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <Trash2 size={20} />
              <span>Delete Selected</span>
            </button>
          </div>
          <AICallMany
            selectedIds={Array.from(selectedIds)}
            onCallComplete={() => {
              setSelectedIds(new Set())
              fetchTeamMembers()
            }}
          />
        </div>
      )}

      {/* Fast Table with Sorting */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === paginatedMembers.length && paginatedMembers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('id')}
                    >
                      Id <SortIcon field="id" />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('email')}
                    >
                      Email <SortIcon field="email" />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      Name <SortIcon field="name" />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('role')}
                    >
                      Role <SortIcon field="role" />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('phone')}
                    >
                      Phone <SortIcon field="phone" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(member.id)}
                          onChange={() => handleSelectOne(member.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{member.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{member.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{member.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{member.role}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{member.phone}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fast Pagination */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Total {filteredMembers.length} records | {currentPage} of {totalPages} Pages
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>Page Size: 10</option>
                  <option value={25}>Page Size: 25</option>
                  <option value={50}>Page Size: 50</option>
                  <option value={100}>Page Size: 100</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

