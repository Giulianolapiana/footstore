// src/types/categoria.ts
// Interface TypeScript que define la forma de una Categoria

export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  parent_id?: number | null
  imagen_url?: string | null
}

// Tipo para crear/editar (sin id)
export type CategoriaForm = Omit<Categoria, 'id'>
