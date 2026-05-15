"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Download, FileText, TrendingUp, DollarSign } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { SalesChart } from "@/components/reports/sales-chart"
import { ProductsChart } from "@/components/reports/products-chart"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("sales")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data for reports
  const reportStats = {
    totalSales: 15847.25,
    totalOrders: 156,
    avgOrderValue: 101.58,
    topProduct: "Fertilizante NPK 20kg",
    lowStockItems: 8,
    newCustomers: 23,
  }

  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      alert("Reporte generado exitosamente")
    }, 2000)
  }

  const handleExportPDF = () => {
    alert("Exportando reporte a PDF...")
  }

  const handleExportExcel = () => {
    alert("Exportando reporte a Excel...")
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
                <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
                <p className="text-muted-foreground mt-1">Análisis detallado de ventas y productos</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleExportPDF} className="rounded-xl bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline" onClick={handleExportExcel} className="rounded-xl bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle>Filtros de Reporte</CardTitle>
                <CardDescription>Configure los parámetros para generar el reporte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Reporte</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Ventas</SelectItem>
                        <SelectItem value="products">Productos Más Vendidos</SelectItem>
                        <SelectItem value="inventory">Inventario Bajo Stock</SelectItem>
                        <SelectItem value="customers">Clientes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha Desde</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha Hasta</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                      className="w-full rounded-xl bg-primary hover:bg-primary/90"
                    >
                      {isGenerating ? "Generando..." : "Generar Reporte"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="rounded-2xl shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ventas Totales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${reportStats.totalSales.toLocaleString()}</div>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-primary text-primary-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5%
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">vs mes anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Órdenes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{reportStats.totalOrders}</div>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-primary text-primary-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.2%
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">vs mes anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Valor Promedio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${reportStats.avgOrderValue.toFixed(2)}</div>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-primary text-primary-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3.8%
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">vs mes anterior</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle>Ventas por Día</CardTitle>
                  <CardDescription>Evolución de ventas en los últimos 30 días</CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesChart />
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle>Productos Más Vendidos</CardTitle>
                  <CardDescription>Top 5 productos por cantidad vendida</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductsChart />
                </CardContent>
              </Card>
            </div>

            {/* Detailed Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle>Productos con Stock Bajo</CardTitle>
                  <CardDescription>Productos que requieren reabastecimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Semillas de Maíz Premium", stock: 8, min: 20 },
                      { name: "Abono Orgánico 50kg", stock: 0, min: 15 },
                      { name: "Herbicida Selectivo 2L", stock: 3, min: 10 },
                      { name: "Fertilizante Foliar 1L", stock: 5, min: 12 },
                    ].map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Stock mínimo: {product.min}</p>
                        </div>
                        <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                          Stock: {product.stock}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle>Resumen del Período</CardTitle>
                  <CardDescription>Estadísticas generales del período seleccionado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Producto más vendido:</span>
                      <span className="font-medium">{reportStats.topProduct}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Nuevos clientes:</span>
                      <span className="font-medium">{reportStats.newCustomers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Productos sin stock:</span>
                      <span className="font-medium text-destructive">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Productos con stock bajo:</span>
                      <span className="font-medium text-yellow-600">{reportStats.lowStockItems}</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-muted-foreground">Crecimiento mensual:</span>
                      <Badge className="bg-primary text-primary-foreground">+12.5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
