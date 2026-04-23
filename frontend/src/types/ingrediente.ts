// src/types/ingrediente.ts
// Tipos para el módulo de Ingredientes

export interface Ingrediente {
  id: number
  nombre: string
  descripcion: string
  es_alergeno: boolean
}

export interface IngredienteForm {
  nombre: string
  descripcion: string
  es_alergeno: boolean
}
