"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import Image from "next/image"

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    supplier: "",
    description: "",
    image: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNameChange = (value: string) => {
    // Remove any numbers from the input
    const lettersOnly = value.replace(/[0-9]/g, "")
    handleChange("name", lettersOnly)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Por favor seleccione un archivo de imagen válido" }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "La imagen no debe superar los 5MB" }))
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        handleChange("image", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    handleChange("image", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (formData.name.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name)) {
      newErrors.name = "El nombre solo puede contener letras"
    }
    if (!formData.category) newErrors.category = "La categoría es requerida"
    if (!formData.stock || Number.parseInt(formData.stock) < 0) newErrors.stock = "El stock debe ser un número válido"
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "El precio debe ser mayor a 0"
    if (!formData.supplier.trim()) newErrors.supplier = "El proveedor es requerido"
    if (!formData.image.trim()) newErrors.image = "La imagen es requerida"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        // Redirect back to inventory
        window.location.href = "/dashboard/inventory"
      }, 1000)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Agregar Producto</h1>
                <p className="text-muted-foreground mt-1">Complete la información del nuevo producto</p>
              </div>
            </div>

            {/* Form */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle>Información del Producto</CardTitle>
                <CardDescription>Todos los campos marcados con * son obligatorios</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Producto (solo letras) *</Label>
                    <Input
                      id="name"
                      placeholder="Ej: Fertilizante NPK"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="rounded-xl"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Imagen del Producto *</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {!imagePreview ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full rounded-xl h-40 border-2 border-dashed hover:border-primary hover:bg-primary/5"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-10 w-10 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Haga clic para subir imagen</span>
                          <span className="text-xs text-muted-foreground">PNG, JPG, WEBP (máx. 5MB)</span>
                        </div>
                      </Button>
                    ) : (
                      <div className="relative w-full h-40 border-2 border-border rounded-xl overflow-hidden">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Vista previa del producto"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fertilizantes">Fertilizantes</SelectItem>
                        <SelectItem value="Semillas">Semillas</SelectItem>
                        <SelectItem value="Pesticidas">Pesticidas</SelectItem>
                        <SelectItem value="Herramientas">Herramientas</SelectItem>
                        <SelectItem value="Equipos">Equipos</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Cantidad en Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => handleChange("stock", e.target.value)}
                        className="rounded-xl"
                      />
                      {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Precio ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        className="rounded-xl"
                      />
                      {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">Proveedor *</Label>
                    <Input
                      id="supplier"
                      placeholder="Ej: AgroSupplies S.A."
                      value={formData.supplier}
                      onChange={(e) => handleChange("supplier", e.target.value)}
                      className="rounded-xl"
                    />
                    {errors.supplier && <p className="text-sm text-destructive">{errors.supplier}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción (Opcional)</Label>
                    <Input
                      id="description"
                      placeholder="Descripción adicional del producto"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                      className="flex-1 rounded-xl"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Guardando..." : "Guardar Producto"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
