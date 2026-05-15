"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, FileText, BarChart3, Plus, Receipt, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Redirect cashier to their specific view
    if (user?.role === "Cajero") {
      router.push("/dashboard/cashier")
    }
  }, [isAuthenticated, user, router])

  if (user?.role === "Cajero") {
    return null
  }

  const stats = [
    {
      title: "Inventario Total",
      value: "1,247",
      description: "productos en stock",
      icon: Package,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Ventas del Día",
      value: "$2,847",
      description: "ingresos de hoy",
      icon: DollarSign,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Facturas Generadas",
      value: "23",
      description: "facturas este mes",
      icon: FileText,
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Stock Bajo",
      value: "8",
      description: "productos por reabastecer",
      icon: AlertTriangle,
      trend: "-3",
      trendUp: false,
    },
  ]

  const quickActions = [
    {
      title: "Agregar Producto",
      description: "Añadir nuevo producto al inventario",
      icon: Plus,
      href: "/dashboard/inventory/add",
    },
    {
      title: "Generar Factura",
      description: "Crear nueva factura de venta",
      icon: Receipt,
      href: "/dashboard/billing/new",
    },
  ]

  const recentActivity = [
    { action: "Producto agregado", item: "Fertilizante NPK 20kg", time: "Hace 2 horas" },
    { action: "Factura generada", item: "#FAC-001234", time: "Hace 3 horas" },
    { action: "Stock actualizado", item: "Semillas de Maíz", time: "Hace 5 horas" },
    { action: "Usuario registrado", item: "María González", time: "Hace 1 día" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Bienvenido al sistema TRIUNFOGO</p>
              </div>
              <div className="flex gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    className="bg-primary hover:bg-primary/90 rounded-xl"
                    onClick={() => (window.location.href = action.href)}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.title}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title} className="rounded-2xl shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                      <Badge variant={stat.trendUp ? "default" : "destructive"} className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.trend}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                        <div>
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.item}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
                  <CardDescription>Tareas frecuentes del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.title}
                      variant="outline"
                      className="w-full justify-start rounded-xl border-border hover:bg-accent bg-transparent"
                      onClick={() => (window.location.href = action.href)}
                    >
                      <action.icon className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl border-border hover:bg-accent bg-transparent"
                    onClick={() => (window.location.href = "/dashboard/reports")}
                  >
                    <BarChart3 className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Ver Reportes</div>
                      <div className="text-xs text-muted-foreground">Análisis y estadísticas</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
