'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'

interface AICallManyProps {
  selectedIds: string[]
  onCallComplete?: () => void
}

export default function AICallMany({ selectedIds, onCallComplete }: AICallManyProps) {
  const [calling, setCalling] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleAICallMany = async () => {
    if (selectedIds.length === 0) return

    setCalling(true)
    setProgress(0)

    // Simulate AI calling process
    for (let i = 0; i < selectedIds.length; i++) {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      setProgress(((i + 1) / selectedIds.length) * 100)
    }

    setCalling(false)
    if (onCallComplete) {
      onCallComplete()
    }
  }

  if (selectedIds.length === 0) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Phone className="text-blue-600" size={20} />
          <div>
            <p className="font-medium text-blue-900">AI Call Many</p>
            <p className="text-sm text-blue-700">
              {selectedIds.length} contact(s) selected for AI calling
            </p>
          </div>
        </div>
        <button
          onClick={handleAICallMany}
          disabled={calling}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Phone size={18} />
          <span>{calling ? 'Calling...' : 'Start AI Calls'}</span>
        </button>
      </div>
      {calling && (
        <div className="mt-4">
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-blue-700 mt-2 text-center">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}
    </div>
  )
}

