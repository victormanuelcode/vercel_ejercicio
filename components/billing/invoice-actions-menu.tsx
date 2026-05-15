"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, Printer, Sheet, MoreVertical, Loader2 } from "lucide-react"
import { generateInvoicePDF, generateInvoiceExcel, printInvoice, type InvoiceData } from "@/lib/invoice-utils"

interface InvoiceActionsMenuProps {
  invoice: {
    id: string
    client: string
    cedula: string
    date: string
    total: number
    status: string
    items: number
  }
}

export function InvoiceActionsMenu({ invoice }: InvoiceActionsMenuProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  // Convert invoice to full format (in real app, fetch from API)
  const getFullInvoiceData = (): InvoiceData => {
    // Mock items data - in production, fetch from API
    const mockItems = Array.from({ length: invoice.items }, (_, i) => ({
      name: `Producto ${i + 1}`,
      price: 25.99,
      quantity: 2,
      subtotal: 51.98,
    }))

    const subtotal = mockItems.reduce((sum, item) => sum + item.subtotal, 0)
    const tax = subtotal * 0.19

    return {
      id: invoice.id,
      client: invoice.client,
      cedula: invoice.cedula,
      date: invoice.date,
      items: mockItems,
      subtotal,
      tax,
      total: invoice.total,
    }
  }

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    try {
      const fullInvoice = getFullInvoiceData()
      await generateInvoicePDF(fullInvoice)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error al generar el PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadExcel = () => {
    setIsGenerating(true)
    try {
      const fullInvoice = getFullInvoiceData()
      generateInvoiceExcel(fullInvoice)
    } catch (error) {
      console.error("Error generating Excel:", error)
      alert("Error al generar el Excel")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    const fullInvoice = getFullInvoiceData()
    printInvoice(fullInvoice)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-lg" disabled={isGenerating}>
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleDownloadPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Descargar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadExcel}>
          <Sheet className="h-4 w-4 mr-2" />
          Descargar Excel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
