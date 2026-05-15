"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Save, Building, DollarSign, Bell, Shield, Palette } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function SettingsPage() {
  const [businessData, setBusinessData] = useState({
    name: "TRIUNFOGO S.A.S",
    nit: "900123456-7",
    address: "Calle 123 #45-67, Bogotá, Colombia",
    phone: "+57 1 234 5678",
    email: "info@triunfogo.com",
    website: "www.triunfogo.com",
    description: "Empresa especializada en productos agrícolas y fertilizantes",
  })

  const [taxSettings, setTaxSettings] = useState({
    currency: "COP",
    taxRate: "19",
    taxName: "IVA",
    priceIncludesTax: false,
  })

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    paymentReminders: true,
    systemUpdates: false,
    emailNotifications: true,
    smsNotifications: false,
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleBusinessChange = (field: string, value: string) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTaxChange = (field: string, value: string | boolean) => {
    setTaxSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurity((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      alert("Configuración guardada exitosamente")
    }, 1000)
  }

  const handleLogoUpload = () => {
    alert("Funcionalidad de subida de logo en desarrollo")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
                <p className="text-muted-foreground mt-1">Administra la configuración del sistema</p>
              </div>
              <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 rounded-xl">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>

            <Tabs defaultValue="business" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 rounded-xl">
                <TabsTrigger value="business" className="rounded-lg">
                  <Building className="h-4 w-4 mr-2" />
                  Empresa
                </TabsTrigger>
                <TabsTrigger value="financial" className="rounded-lg">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financiero
                </TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-lg">
                  <Bell className="h-4 w-4 mr-2" />
                  Notificaciones
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg">
                  <Shield className="h-4 w-4 mr-2" />
                  Seguridad
                </TabsTrigger>
                <TabsTrigger value="appearance" className="rounded-lg">
                  <Palette className="h-4 w-4 mr-2" />
                  Apariencia
                </TabsTrigger>
              </TabsList>

              {/* Business Settings */}
              <TabsContent value="business">
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>Información de la Empresa</CardTitle>
                    <CardDescription>Configure los datos básicos de su empresa</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Nombre de la Empresa</Label>
                        <Input
                          id="businessName"
                          value={businessData.name}
                          onChange={(e) => handleBusinessChange("name", e.target.value)}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nit">NIT</Label>
                        <Input
                          id="nit"
                          value={businessData.nit}
                          onChange={(e) => handleBusinessChange("nit", e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={businessData.address}
                        onChange={(e) => handleBusinessChange("address", e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={businessData.phone}
                          onChange={(e) => handleBusinessChange("phone", e.target.value)}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={businessData.email}
                          onChange={(e) => handleBusinessChange("email", e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        value={businessData.website}
                        onChange={(e) => handleBusinessChange("website", e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={businessData.description}
                        onChange={(e) => handleBusinessChange("description", e.target.value)}
                        className="rounded-xl"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Logo de la Empresa</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center">
                          <Building className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button variant="outline" onClick={handleLogoUpload} className="rounded-xl bg-transparent">
                          <Upload className="h-4 w-4 mr-2" />
                          Subir Logo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Financial Settings */}
              <TabsContent value="financial">
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>Configuración Financiera</CardTitle>
                    <CardDescription>Configure moneda, impuestos y precios</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Moneda</Label>
                        <Select
                          value={taxSettings.currency}
                          onValueChange={(value) => handleTaxChange("currency", value)}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                            <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taxName">Nombre del Impuesto</Label>
                        <Input
                          id="taxName"
                          value={taxSettings.taxName}
                          onChange={(e) => handleTaxChange("taxName", e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tasa de Impuesto (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxSettings.taxRate}
                        onChange={(e) => handleTaxChange("taxRate", e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="priceIncludesTax"
                        checked={taxSettings.priceIncludesTax}
                        onCheckedChange={(checked) => handleTaxChange("priceIncludesTax", checked)}
                      />
                      <Label htmlFor="priceIncludesTax">Los precios incluyen impuestos</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications">
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>Configuración de Notificaciones</CardTitle>
                    <CardDescription>Configure qué notificaciones desea recibir</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="lowStock">Alertas de Stock Bajo</Label>
                          <p className="text-sm text-muted-foreground">
                            Recibir notificaciones cuando los productos tengan stock bajo
                          </p>
                        </div>
                        <Switch
                          id="lowStock"
                          checked={notifications.lowStock}
                          onCheckedChange={(checked) => handleNotificationChange("lowStock", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="newOrders">Nuevas Órdenes</Label>
                          <p className="text-sm text-muted-foreground">Notificar cuando se generen nuevas facturas</p>
                        </div>
                        <Switch
                          id="newOrders"
                          checked={notifications.newOrders}
                          onCheckedChange={(checked) => handleNotificationChange("newOrders", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="paymentReminders">Recordatorios de Pago</Label>
                          <p className="text-sm text-muted-foreground">Recordatorios para facturas vencidas</p>
                        </div>
                        <Switch
                          id="paymentReminders"
                          checked={notifications.paymentReminders}
                          onCheckedChange={(checked) => handleNotificationChange("paymentReminders", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="systemUpdates">Actualizaciones del Sistema</Label>
                          <p className="text-sm text-muted-foreground">Notificaciones sobre nuevas funcionalidades</p>
                        </div>
                        <Switch
                          id="systemUpdates"
                          checked={notifications.systemUpdates}
                          onCheckedChange={(checked) => handleNotificationChange("systemUpdates", checked)}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">Métodos de Notificación</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                          <Switch
                            id="emailNotifications"
                            checked={notifications.emailNotifications}
                            onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="smsNotifications">Notificaciones por SMS</Label>
                          <Switch
                            id="smsNotifications"
                            checked={notifications.smsNotifications}
                            onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security">
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>Configuración de Seguridad</CardTitle>
                    <CardDescription>Configure las opciones de seguridad del sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactorAuth">Autenticación de Dos Factores</Label>
                        <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad a tu cuenta</p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={security.twoFactorAuth}
                        onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                        <Select
                          value={security.sessionTimeout}
                          onValueChange={(value) => handleSecurityChange("sessionTimeout", value)}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutos</SelectItem>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="60">1 hora</SelectItem>
                            <SelectItem value="120">2 horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passwordExpiry">Expiración de Contraseña (días)</Label>
                        <Select
                          value={security.passwordExpiry}
                          onValueChange={(value) => handleSecurityChange("passwordExpiry", value)}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 días</SelectItem>
                            <SelectItem value="60">60 días</SelectItem>
                            <SelectItem value="90">90 días</SelectItem>
                            <SelectItem value="never">Nunca</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loginAttempts">Intentos de Login Máximos</Label>
                      <Select
                        value={security.loginAttempts}
                        onValueChange={(value) => handleSecurityChange("loginAttempts", value)}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 intentos</SelectItem>
                          <SelectItem value="5">5 intentos</SelectItem>
                          <SelectItem value="10">10 intentos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance">
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>Configuración de Apariencia</CardTitle>
                    <CardDescription>Personaliza la apariencia del sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium">Tema del Sistema</Label>
                        <p className="text-sm text-muted-foreground mb-3">Selecciona el tema visual del sistema</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="border rounded-xl p-4 cursor-pointer hover:bg-accent">
                            <div className="w-full h-20 bg-background border rounded-lg mb-2"></div>
                            <p className="text-sm font-medium text-center">Claro</p>
                          </div>
                          <div className="border rounded-xl p-4 cursor-pointer hover:bg-accent">
                            <div className="w-full h-20 bg-foreground rounded-lg mb-2"></div>
                            <p className="text-sm font-medium text-center">Oscuro</p>
                          </div>
                          <div className="border rounded-xl p-4 cursor-pointer hover:bg-accent border-primary">
                            <div className="w-full h-20 bg-gradient-to-br from-background to-foreground rounded-lg mb-2"></div>
                            <p className="text-sm font-medium text-center">Automático</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium">Colores del Sistema</Label>
                        <p className="text-sm text-muted-foreground mb-3">
                          Los colores actuales están optimizados para el sector agrícola
                        </p>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg border"></div>
                            <span className="text-sm">Verde Primario</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-secondary rounded-lg border"></div>
                            <span className="text-sm">Verde Secundario</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent rounded-lg border"></div>
                            <span className="text-sm">Verde Accent</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
