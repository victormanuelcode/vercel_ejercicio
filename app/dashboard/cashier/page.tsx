"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  Banknote,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  ShoppingCart,
  Search,
  CheckCircle,
  Receipt,
  Download,
  Printer,
  FileText,
} from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { generateInvoicePDF, generateInvoiceExcel, printInvoice } from "@/lib/invoice-utils"
import { getProducts, updateProduct, Product as APIDBProduct } from "@/lib/api/inventory"
import { addInvoice } from "@/lib/api/billing"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  stock: number
}

// Data is now fetched from Supabase

export default function CashierPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("efectivo")
  const [customerName, setCustomerName] = useState("")
  const [customerCedula, setCustomerCedula] = useState("")
  const [receivedAmount, setReceivedAmount] = useState<string>("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState<string | null>(null)

  const [products, setProducts] = useState<APIDBProduct[]>([])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Cajero") {
      router.push("/login")
    } else {
      const fetchProducts = async () => {
        const data = await getProducts()
        setProducts(data)
      }
      fetchProducts()
    }
  }, [isAuthenticated, user, router])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (product: APIDBProduct) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      }
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        },
      ])
    }
  }

  const updateQuantity = (id: number, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change
            if (newQuantity <= 0) return null
            if (newQuantity > item.stock) return item
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item): item is CartItem => item !== null),
    )
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.19
  const total = subtotal + tax

  const change = receivedAmount ? Number.parseFloat(receivedAmount) - total : 0

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío")
      return
    }

    if (!customerName || !customerCedula) {
      alert("Por favor complete los datos del cliente")
      return
    }

    if (paymentMethod === "efectivo" && change < 0) {
      alert("El monto recibido es insuficiente")
      return
    }

    const invoiceNumber = `FAC-${Date.now()}`
    
    // Guardar factura en Supabase
    const newInvoice = await addInvoice({
      id: invoiceNumber,
      client: customerName,
      cedula: customerCedula,
      total: total,
      status: "Pagada",
      items_count: cart.length,
      items: cart.map(i => ({ nombre: i.name, precio: i.price, cantidad: i.quantity }))
    })

    if (!newInvoice) {
      alert("Error al procesar la venta en la base de datos")
      return
    }

    // Opcional: reducir stock en la base de datos (inventario)
    for (const item of cart) {
      const newStock = item.stock - item.quantity
      await updateProduct(item.id, { stock: newStock })
    }

    setLastInvoiceNumber(invoiceNumber)

    // Simulate sale completion
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setCart([])
      setCustomerName("")
      setCustomerCedula("")
      setReceivedAmount("")
      setSelectedProduct("")
      setSearchTerm("")
    }, 3000)
  }

  const handleDownloadPDF = () => {
    if (!lastInvoiceNumber) return

    const invoice = {
      id: lastInvoiceNumber,
      cliente: customerName,
      cedula: customerCedula,
      fecha: new Date().toLocaleDateString("es-CO"),
      productos: cart.map((item) => ({
        nombre: item.name,
        precio: item.price,
        cantidad: item.quantity,
      })),
      subtotal: subtotal,
      iva: tax,
      total: total,
    }

    generateInvoicePDF(invoice)
  }

  const handleDownloadExcel = () => {
    if (!lastInvoiceNumber) return

    const invoice = {
      id: lastInvoiceNumber,
      cliente: customerName,
      cedula: customerCedula,
      fecha: new Date().toLocaleDateString("es-CO"),
      productos: cart.map((item) => ({
        nombre: item.name,
        precio: item.price,
        cantidad: item.quantity,
      })),
      subtotal: subtotal,
      iva: tax,
      total: total,
    }

    generateInvoiceExcel(invoice)
  }

  const handlePrint = () => {
    if (!lastInvoiceNumber) return

    const invoice = {
      id: lastInvoiceNumber,
      cliente: customerName,
      cedula: customerCedula,
      fecha: new Date().toLocaleDateString("es-CO"),
      productos: cart.map((item) => ({
        nombre: item.name,
        precio: item.price,
        cantidad: item.quantity,
      })),
      subtotal: subtotal,
      iva: tax,
      total: total,
    }

    printInvoice(invoice)
  }

  const clearCart = () => {
    if (confirm("¿Está seguro de que desea vaciar el carrito?")) {
      setCart([])
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Punto de Venta</h1>
                <p className="text-muted-foreground mt-1">Gestión de ventas rápidas</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-primary text-primary-foreground text-lg py-2 px-4">
                  <DollarSign className="h-5 w-5 mr-1" />
                  Total: ${total.toLocaleString("es-CO")}
                </Badge>
              </div>
            </div>

            {showSuccess && lastInvoiceNumber && (
              <Card className="rounded-2xl shadow-md border-primary bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">Venta Completada Exitosamente</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Factura {lastInvoiceNumber} generada correctamente
                        </p>
                      </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Products and Search */}
              <div className="lg:col-span-2 space-y-6">
                {/* Search Products */}
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Buscar Productos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nombre o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-xl"
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="p-4 border border-border rounded-xl hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => addToCart(product)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{product.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                              <p className="text-sm font-bold text-primary mt-2">
                                ${product.price.toLocaleString("es-CO")}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Stock: {product.stock}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shopping Cart */}
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Carrito de Compras ({cart.length} items)
                      </CardTitle>
                      {cart.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Vaciar
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {cart.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>El carrito está vacío</p>
                        <p className="text-sm mt-2">Busca y agrega productos para comenzar</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-xl border max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Subtotal</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {cart.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.name}</TableCell>
                                  <TableCell>${item.price.toLocaleString("es-CO")}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="h-8 w-8 p-0 rounded-lg"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="h-8 w-8 p-0 rounded-lg"
                                        disabled={item.quantity >= item.stock}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-bold">
                                    ${(item.price * item.quantity).toLocaleString("es-CO")}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFromCart(item.id)}
                                      className="text-destructive hover:text-destructive"
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
                        <div className="space-y-2 p-4 bg-muted rounded-xl">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="font-medium">${subtotal.toLocaleString("es-CO")}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">IVA (19%):</span>
                            <span className="font-medium">${tax.toLocaleString("es-CO")}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                            <span>Total:</span>
                            <span className="text-primary">${total.toLocaleString("es-CO")}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Customer and Payment */}
              <div className="space-y-6">
                {/* Customer Information */}
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>Información del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Nombre Completo</Label>
                      <Input
                        id="customerName"
                        placeholder="Nombre del cliente"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerCedula">Cédula</Label>
                      <Input
                        id="customerCedula"
                        placeholder="Número de cédula"
                        value={customerCedula}
                        onChange={(e) => setCustomerCedula(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>Método de Pago</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4" />
                            <span>Efectivo</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="tarjeta">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Tarjeta</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {paymentMethod === "efectivo" && (
                      <div className="space-y-2">
                        <Label htmlFor="receivedAmount">Monto Recibido</Label>
                        <Input
                          id="receivedAmount"
                          type="number"
                          placeholder="0"
                          value={receivedAmount}
                          onChange={(e) => setReceivedAmount(e.target.value)}
                          className="rounded-xl"
                        />
                        {receivedAmount && (
                          <div className="p-3 bg-muted rounded-xl">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Cambio:</span>
                              <span className={`text-lg font-bold ${change < 0 ? "text-destructive" : "text-primary"}`}>
                                ${Math.max(0, change).toLocaleString("es-CO")}
                              </span>
                            </div>
                            {change < 0 && <p className="text-xs text-destructive mt-2">Monto insuficiente</p>}
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 text-base"
                      onClick={handleCompleteSale}
                      disabled={cart.length === 0 || showSuccess}
                    >
                      {showSuccess ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Venta Completada
                        </>
                      ) : (
                        <>
                          <Receipt className="h-5 w-5 mr-2" />
                          Completar Venta
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Today's Stats */}
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>Ventas de Hoy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Ventas:</span>
                      <span className="font-bold text-foreground">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ingresos:</span>
                      <span className="font-bold text-primary">$847,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Promedio:</span>
                      <span className="font-bold text-foreground">$70,625</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
