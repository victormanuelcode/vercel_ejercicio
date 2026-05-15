"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Package, FileText, BarChart3, Users, Settings, LogOut, Leaf, Menu, X, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, logout, hasRole } = useAuth()

  const getMenuItems = () => {
    const items = []

    // Cajero only sees cashier interface
    if (hasRole(["Cajero"])) {
      items.push({
        title: "Caja",
        icon: CreditCard,
        href: "/dashboard/cashier",
        active: false,
      })
      return items
    }

    // Other roles see different menus
    if (hasRole(["Administrador", "Inventario"])) {
      items.push({
        title: "Inventario",
        icon: Package,
        href: "/dashboard/inventory",
        active: false,
      })
    }

    if (hasRole(["Administrador", "Vendedor", "Cajero"])) {
      items.push({
        title: "Facturación",
        icon: FileText,
        href: "/dashboard/billing",
        active: false,
      })
    }

    if (hasRole(["Administrador"])) {
      items.push(
        {
          title: "Reportes",
          icon: BarChart3,
          href: "/dashboard/reports",
          active: false,
        },
        {
          title: "Usuarios",
          icon: Users,
          href: "/dashboard/users",
          active: false,
        },
        {
          title: "Configuración",
          icon: Settings,
          href: "/dashboard/settings",
          active: false,
        },
      )
    }

    return items
  }

  const menuItems = getMenuItems()

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 lg:relative lg:translate-x-0",
          isCollapsed ? "-translate-x-full lg:w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className={cn("flex items-center gap-3", isCollapsed && "lg:justify-center")}>
              <div className="bg-sidebar-primary rounded-xl p-2">
                <Leaf className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="font-bold text-sidebar-foreground">TRIUNFOGO</h2>
                  <p className="text-xs text-muted-foreground">Gestión Agrícola</p>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {user && !isCollapsed && (
            <div className="p-4 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start rounded-xl hover:bg-sidebar-accent",
                      isCollapsed && "lg:justify-center lg:px-2",
                      item.active && "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                    onClick={() => (window.location.href = item.href)}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-3">{item.title}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-xl hover:bg-destructive/10 text-destructive hover:text-destructive",
                isCollapsed && "lg:justify-center lg:px-2",
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Cerrar Sesión</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsCollapsed(false)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  )
}
