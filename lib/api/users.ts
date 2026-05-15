import { supabase } from '../supabase'

export interface AppUser {
  id: number
  name: string
  cedula: string
  email: string
  role: string
  status: string
  last_login?: string
  created_at?: string
}

export const getUsers = async (): Promise<AppUser[]> => {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching users:', error)
    return []
  }
  
  return data as AppUser[]
}

export const addUser = async (user: Omit<AppUser, 'id' | 'created_at' | 'last_login'>): Promise<AppUser | null> => {
  const { data, error } = await supabase
    .from('app_users')
    .insert([{ ...user, last_login: 'Nunca' }])
    .select()
    .single()

  if (error) {
    console.error('Error adding user:', error)
    return null
  }
  
  return data as AppUser
}

export const updateUser = async (id: number, updates: Partial<AppUser>): Promise<AppUser | null> => {
  const { data, error } = await supabase
    .from('app_users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    return null
  }
  
  return data as AppUser
}

export const deleteUser = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('app_users')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting user:', error)
    return false
  }
  
  return true
}
