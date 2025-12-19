import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client only if credentials are provided
let supabase: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
} else {
  console.warn('Supabase environment variables not set. Some features may not work.')
}

// Database types
export interface TeamMember {
  id: string
  email: string
  name: string
  role: string
  phone: string
  created_at?: string
  updated_at?: string
}

export interface Task {
  id: string
  task_name: string
  description: string
  assigned_to: string
  status: string
  urgency: string
  created_at?: string
  updated_at?: string
}

// Export supabase with null check helper
export { supabase }
export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not initialized. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
  }
  return supabase
}

