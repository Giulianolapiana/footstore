// src/types/producto.ts
// Interface TypeScript que define la forma de un Producto

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio_base: number
  imagenes_url: string[]
  stock_cantidad: number
  disponible: boolean
}

// Tipo para crear/editar (sin id)
export type ProductoForm = Omit<Producto, 'id'>
