// Indica que este es un componente de cliente (necesario para hooks y APIs del navegador)
"use client"

// Importaciones de React y hooks
import type React from "react"
import { useState } from "react"
// Importaciones de componentes de UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Importación de iconos
import { Leaf, Lock, Mail } from "lucide-react"
// Importación del contexto de autenticación
import { useAuth } from "@/lib/auth-context"
// Importación del enrutador de Next.js
import { useRouter } from "next/navigation"

// Componente principal de la página de inicio de sesión
export default function LoginPage() {
  // Estados para manejar el formulario y la UI
  const [email, setEmail] = useState("") // Almacena el correo electrónico
  const [password, setPassword] = useState("") // Almacena la contraseña
  const [error, setError] = useState("") // Maneja mensajes de error
  const [isLoading, setIsLoading] = useState(false) // Controla el estado de carga
  
  // Obtiene la función de login del contexto de autenticación
  const { login } = useAuth()
  // Hook para la navegación programática
  const router = useRouter()

  // Función que maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Evita el comportamiento por defecto del formulario
    setError("") // Limpia cualquier error previo
    setIsLoading(true) // Activa el estado de carga

    // Validación de campos obligatorios
    if (!email || !password) {
      setError("Por favor complete todos los campos")
      setIsLoading(false)
      return
    }

    try {
      // Intenta iniciar sesión con las credenciales proporcionadas
      await login(email, password)
      // Redirige al dashboard si el inicio de sesión es exitoso
      router.push("/dashboard")
    } catch (err: any) {
      // Muestra un mensaje de error si el inicio de sesión falla
      setError(err.message || "Error al iniciar sesión")
    } finally {
      // Desactiva el estado de carga en cualquier caso
      setIsLoading(false)
    }
  }

  return (
    // Contenedor principal con fondo degradado
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary/80 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos del fondo */}
      {/* Patrón de cuadrícula sutil */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      {/* Efectos de burbujas decorativas */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      {/* Tarjeta de inicio de sesión */}
      <div className="w-full max-w-md relative z-10">
        {/* Encabezado con logo y título */}
        <div className="text-center mb-8">
          {/* Contenedor del ícono */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-3xl p-4 shadow-2xl">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
          </div>
          {/* Título y subtítulo */}
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a Triunfogo</h1>
          <p className="text-white/80">Inicia sesión para acceder a tu cuenta</p>
        </div>

        {/* Tarjeta del formulario */}
        <Card className="border-0 shadow-2xl">
          {/* Encabezado de la tarjeta */}
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo de correo electrónico */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {/* Campo de contraseña */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
              {/* Mensaje de error */}
              {error && (
                <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                  {error}
                </div>
              )}
              {/* Información de usuarios de prueba */}
              <div className="text-xs text-foreground/70 bg-muted/50 p-4 rounded-xl space-y-2 border border-border/50">
                <p className="font-semibold text-foreground text-sm">Usuarios de prueba:</p>
                <div className="space-y-1.5">
                  <div>
                    <p className="font-medium text-foreground">Administrador</p>
                    <p>Email: admin@triunfogo.com</p>
                    <p>Contraseña: admin123</p>
                  </div>
                  <div className="pt-1">
                    <p className="font-medium text-foreground">Cajero</p>
                    <p>Email: cajero@triunfogo.com</p>
                    <p>Contraseña: cajero123</p>
                  </div>
                  <div className="pt-1">
                    <p className="font-medium text-foreground">Vendedor</p>
                    <p>Email: vendedor@triunfogo.com</p>
                    <p>Contraseña: vendedor123</p>
                  </div>
                  <div className="pt-1">
                    <p className="font-medium text-foreground">Inventario</p>
                    <p>Email: inventario@triunfogo.com</p>
                    <p>Contraseña: inventario123</p>
                  </div>
                </div>
              </div>
              {/* Botón de envío del formulario */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  // Muestra un indicador de carga cuando se está procesando el inicio de sesión
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  // Texto normal del botón cuando no está cargando
                  "Iniciar sesión"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-white/80 text-sm mt-6">Solo los administradores pueden crear nuevos usuarios</p>
      </div>
    </div>
  )
}
