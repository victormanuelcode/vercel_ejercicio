"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "Administrador" | "Vendedor" | "Inventario" | "Cajero"

interface User {
  id: number
  name: string
  email: string
  cedula: string
  role: UserRole
  status: "Activo" | "Inactivo"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  hasRole: (roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUsers: Array<User & { password: string }> = [
  {
    id: 1,
    name: "Admin Usuario",
    email: "admin@triunfogo.com",
    password: "admin123",
    cedula: "12345678",
    role: "Administrador",
    status: "Activo",
  },
  {
    id: 2,
    name: "Vendedor Usuario",
    email: "vendedor@triunfogo.com",
    password: "vendedor123",
    cedula: "87654321",
    role: "Vendedor",
    status: "Activo",
  },
  {
    id: 3,
    name: "Cajero Usuario",
    email: "cajero@triunfogo.com",
    password: "cajero123",
    cedula: "11223344",
    role: "Cajero",
    status: "Activo",
  },
  {
    id: 4,
    name: "Inventario Usuario",
    email: "inventario@triunfogo.com",
    password: "inventario123",
    cedula: "44332211",
    role: "Inventario",
    status: "Activo",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("triunfogo_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password && u.status === "Activo")

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("triunfogo_user", JSON.stringify(userWithoutPassword))
    } else {
      throw new Error("Credenciales inválidas o usuario inactivo")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("triunfogo_user")
  }

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
