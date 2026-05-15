import { supabase } from '../supabase'

export interface InvoiceItem {
  nombre: string
  precio: number
  cantidad: number
}

export interface Invoice {
  id: string
  client: string
  cedula: string
  date?: string
  total: number
  status: string
  items_count: number
  items?: InvoiceItem[]
}

export const getInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('date', { ascending: false })
  
  if (error) {
    console.error('Error fetching invoices:', error)
    return []
  }
  
  return data as Invoice[]
}

export const addInvoice = async (invoice: Invoice): Promise<Invoice | null> => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single()

  if (error) {
    console.error('Error adding invoice:', error)
    return null
  }
  
  return data as Invoice
}

export const updateInvoiceStatus = async (id: string, status: string): Promise<boolean> => {
  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating invoice status:', error)
    return false
  }
  
  return true
}

export const deleteInvoice = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting invoice:', error)
    return false
  }
  
  return true
}
