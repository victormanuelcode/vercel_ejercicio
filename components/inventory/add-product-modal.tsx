"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (productData: any) => void
}

export function AddProductModal({ isOpen, onClose, onSubmit }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    supplier: "",
    image: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        category: formData.category,
        stock: Number.parseInt(formData.stock),
        price: Number.parseFloat(formData.price),
        supplier: formData.supplier.trim(),
        image: formData.image.trim(),
      })

      // Reset form
      setFormData({
        name: "",
        category: "",
        stock: "",
        price: "",
        supplier: "",
        image: "",
      })
      setImagePreview(null)
      setErrors({})
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      category: "",
      stock: "",
      price: "",
      supplier: "",
      image: "",
    })
    setImagePreview(null)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          <DialogDescription>Complete la información del producto para agregarlo al inventario</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto (solo letras)</Label>
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
            <Label htmlFor="image">Imagen del Producto</Label>
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
                className="w-full rounded-xl h-32 border-2 border-dashed hover:border-primary hover:bg-primary/5"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Haga clic para subir imagen</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG, WEBP (máx. 5MB)</span>
                </div>
              </Button>
            ) : (
              <div className="relative w-full h-32 border-2 border-border rounded-xl overflow-hidden">
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
            <Label htmlFor="category">Categoría</Label>
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
              <Label htmlFor="stock">Cantidad en Stock</Label>
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
              <Label htmlFor="price">Precio ($)</Label>
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
            <Label htmlFor="supplier">Proveedor</Label>
            <Input
              id="supplier"
              placeholder="Ej: AgroSupplies S.A."
              value={formData.supplier}
              onChange={(e) => handleChange("supplier", e.target.value)}
              className="rounded-xl"
            />
            {errors.supplier && <p className="text-sm text-destructive">{errors.supplier}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 rounded-xl bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
              Guardar Producto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
