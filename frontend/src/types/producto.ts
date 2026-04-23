// src/types/producto.ts
// Interface TypeScript que define la forma de un Producto

export interface CategoriaInfo {
  id: number
  nombre: string
}

export interface IngredienteInfo {
  id: number
  nombre: string
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio_base: number
  categoria_id: number
  categoria_nombre: string
  imagenes_url: string[]
  stock_cantidad: number
  disponible: boolean
  categorias: CategoriaInfo | null
  ingredientes: IngredienteInfo[]
}

// Tipo para crear/editar (lo que se envía al backend)
export interface ProductoForm {
  nombre: string
  descripcion: string
  precio_base: number
  categoria_id: number
  imagenes_url: string[]
  stock_cantidad: number
  disponible: boolean
  ingrediente_ids: number[]
}
