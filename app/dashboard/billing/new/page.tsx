"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Trash2, Search, Download, Printer, FileText } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { generateInvoicePDF, generateInvoiceExcel, printInvoice } from "@/lib/invoice-utils"
import { useEffect } from "react"
import { getProducts, Product } from "@/lib/api/inventory"
import { addInvoice } from "@/lib/api/billing"

interface InvoiceItem {
  productId: number
  name: string
  price: number
  quantity: number
  subtotal: number
}

export default function NewInvoicePage() {
  const [clientData, setClientData] = useState({
    name: "",
    cedula: "",
    address: "",
    phone: "",
  })
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [invoiceGenerated, setInvoiceGenerated] = useState(false)
  const [generatedInvoiceNumber, setGeneratedInvoiceNumber] = useState<string>("")

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleClientChange = (field: string, value: string) => {
    setClientData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addProduct = () => {
    if (!selectedProduct || !quantity) {
      setErrors({ product: "Seleccione un producto y cantidad" })
      return
    }

    const product = products.find((p) => p.id.toString() === selectedProduct)
    if (!product) return

    const qty = Number.parseInt(quantity)
    if (qty <= 0 || qty > product.stock) {
      setErrors({ quantity: `Cantidad debe ser entre 1 y ${product.stock}` })
      return
    }

    const existingItem = invoiceItems.find((item) => item.productId === product.id)
    if (existingItem) {
      setInvoiceItems((items) =>
        items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + qty, subtotal: (item.quantity + qty) * item.price }
            : item,
        ),
      )
    } else {
      const newItem: InvoiceItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        subtotal: product.price * qty,
      }
      setInvoiceItems((prev) => [...prev, newItem])
    }

    setSelectedProduct("")
    setQuantity("")
    setSearchTerm("")
    setErrors({})
  }

  const removeProduct = (productId: number) => {
    setInvoiceItems((items) => items.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) return

    setInvoiceItems((items) =>
      items.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price } : item,
      ),
    )
  }

  const total = invoiceItems.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = total * 0.19 // 19% IVA
  const finalTotal = total + tax

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!clientData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!clientData.cedula.trim()) newErrors.cedula = "La cédula es requerida"
    if (!clientData.address.trim()) newErrors.address = "La dirección es requerida"
    if (invoiceItems.length === 0) newErrors.items = "Debe agregar al menos un producto"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const invoiceNumber = `FAC-${Date.now()}`
      
      // Save to Supabase
      const newInvoice = await addInvoice({
        id: invoiceNumber,
        client: clientData.name,
        cedula: clientData.cedula,
        total: finalTotal,
        status: "Pendiente",
        items_count: invoiceItems.length,
        items: invoiceItems.map(i => ({ nombre: i.name, precio: i.price, cantidad: i.quantity }))
      })

      if (newInvoice) {
        setGeneratedInvoiceNumber(invoiceNumber)
        setInvoiceGenerated(true)
        alert("Factura generada exitosamente")
      } else {
        alert("Error al generar la factura")
      }
    }
  }

  const handleDownloadPDF = () => {
    const invoice = {
      id: generatedInvoiceNumber,
      cliente: clientData.name,
      cedula: clientData.cedula,
      fecha: new Date().toLocaleDateString("es-CO"),
      productos: invoiceItems.map((item) => ({
        nombre: item.name,
        precio: item.price,
        cantidad: item.quantity,
      })),
      subtotal: total,
      iva: tax,
      total: finalTotal,
    }

    generateInvoicePDF(invoice)
  }

  const handleDownloadExcel = () => {
    const invoice = {
      id: generatedInvoiceNumber,
      cliente: clientData.name,
      cedula: clientData.cedula,
      fecha: new Date().toLocaleDateString("es-CO"),
      productos: invoiceItems.map((item) => ({
        nombre: item.name,
        precio: item.price,
        cantidad: item.quantity,
      })),
      subtotal: total,
      iva: tax,
      total: finalTotal,
    }

    generateInvoiceExcel(invoice)
  }

  const handlePrint = () => {
    const invoice = {
      id: generatedInvoiceNumber,
      cliente: clientData.name,
      cedula: clientData.cedula,
      fecha: new Date().toLocaleDateString("es-CO"),
      productos: invoiceItems.map((item) => ({
        nombre: item.name,
        precio: item.price,
        cantidad: item.quantity,
      })),
      subtotal: total,
      iva: tax,
      total: finalTotal,
    }

    printInvoice(invoice)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Nueva Factura</h1>
                <p className="text-muted-foreground mt-1">Complete la información para generar la factura</p>
              </div>
            </div>

            {invoiceGenerated && (
              <Card className="rounded-2xl shadow-md border-primary bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Factura Generada: {generatedInvoiceNumber}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Puede descargar o imprimir la factura usando las opciones a continuación
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadPDF}
                        className="rounded-xl bg-transparent"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadExcel}
                        className="rounded-xl bg-transparent"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-xl bg-transparent">
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Information */}
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle>Información del Cliente</CardTitle>
                  <CardDescription>Datos del cliente para la factura</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        placeholder="Juan Pérez"
                        value={clientData.name}
                        onChange={(e) => handleClientChange("name", e.target.value)}
                        className="rounded-xl"
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cedula">Cédula *</Label>
                      <Input
                        id="cedula"
                        placeholder="12345678"
                        value={clientData.cedula}
                        onChange={(e) => handleClientChange("cedula", e.target.value)}
                        className="rounded-xl"
                      />
                      {errors.cedula && <p className="text-sm text-destructive">{errors.cedula}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      placeholder="Calle 123 #45-67"
                      value={clientData.address}
                      onChange={(e) => handleClientChange("address", e.target.value)}
                      className="rounded-xl"
                    />
                    {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono (Opcional)</Label>
                    <Input
                      id="phone"
                      placeholder="300 123 4567"
                      value={clientData.phone}
                      onChange={(e) => handleClientChange("phone", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Selection */}
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle>Selección de Productos</CardTitle>
                  <CardDescription>Busque y agregue productos a la factura</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Buscar Producto</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar productos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Producto</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name} - ${product.price} (Stock: {product.stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-32 space-y-2">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="flex items-end">
                      <Button type="button" onClick={addProduct} className="rounded-xl bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar
                      </Button>
                    </div>
                  </div>

                  {errors.product && <p className="text-sm text-destructive">{errors.product}</p>}
                  {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                </CardContent>
              </Card>

              {/* Invoice Items */}
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle>Productos en la Factura</CardTitle>
                  <CardDescription>Lista de productos agregados</CardDescription>
                </CardHeader>
                <CardContent>
                  {invoiceItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay productos agregados a la factura
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-xl border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Producto</TableHead>
                              <TableHead>Precio</TableHead>
                              <TableHead>Cantidad</TableHead>
                              <TableHead>Subtotal</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {invoiceItems.map((item) => (
                              <TableRow key={item.productId}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.productId, Number.parseInt(e.target.value))}
                                    className="w-20 rounded-lg"
                                  />
                                </TableCell>
                                <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeProduct(item.productId)}
                                    className="rounded-lg text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Totals */}
                      <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>IVA (19%):</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>${finalTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
                  Generar Factura
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
